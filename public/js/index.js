var socket = io();
socket.on('connect', function() {
    console.log('connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('new message', message);
    var li = jQuery('<li/>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    var li = jQuery('<li/>');
    var a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
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
