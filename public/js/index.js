var socket = io();
socket.on('connect', function() {
    console.log('connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {

    var formattedTime = moment(message.createdAt).format('h:mm:ss a');


    var template = $("#message-template").html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $("#messages").append(html);


});

socket.on('newLocationMessage', function(message) {

    var formattedTime = moment(message.createdAt).format('h:mm:ss a');
    var template = $("#location-message-template").html();
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });

    $("#messages").append(html);

})

jQuery("#message-form").on('submit', function(e) {
    e.preventDefault();

    var msgTextBox = $("#message");

    socket.emit('createMessage', {
        from: 'User',
        text: msgTextBox.val()
    }, function() {
        msgTextBox.val('');
    });

});

var locationButton = $("#send-location");
locationButton.on('click', function(e) {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');
    var position = navigator.geolocation.getCurrentPosition(function success(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.removeAttr('disabled').text('Send location');
    }, function error(err) {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });

});
