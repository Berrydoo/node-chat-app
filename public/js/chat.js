var socket = io();

function scrollToBottom() {
    // selectors
    var messages = $("#messages");
    var newMessage = messages.children('li:last-child');

    // heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if ((clientHeight + scrollTop + newMessageHeight + lastMessageHeight) >= scrollHeight) {
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect', function() {

    var params = $.deparam(window.location.search);
    socket.emit('join', params, function(error) {
        if (error) {
            alert(error);
            window.location.href = '/';
        }
    });

});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {

    var ol = $("<ol></ol>");
    users.forEach(function(user) {
        ol.append($("<li></li>").text(user));
    });

    $("#users").html(ol);
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

    scrollToBottom();
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
    scrollToBottom();
})

$("#message-form").on('submit', function(e) {
    e.preventDefault();

    var msgTextBox = $("#message");

    socket.emit('createMessage', {
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
