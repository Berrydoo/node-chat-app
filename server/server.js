const express = require('express');
const http = require('http');
const path = require('path');
const publicPath = path.join(__dirname, '../public/');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage', {
        from: 'mike@example.com',
        text: 'Hey what is going on?',
        createdAt: 123
    })

    socket.on('createMessage', (newMessage) => {
        console.log('createMessage', newMessage);

        newMessage.createdAt = 84848;
        socket.emit('newMessage', newMessage);
    });

    socket.on('disconnect', (socket) => {
        console.log('Disconnected from client');
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
