const express = require('express');
const http = require('http');
const path = require('path');
const publicPath = path.join(__dirname, '../public/');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');
const {
    generateMessage
} = require('./utils/message');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (newMessage, callback) => {
        console.log('createMessage', newMessage);

        io.emit('newMessage', generateMessage(
            newMessage.from,
            newMessage.text));
        callback('This is from the server');

        // socket.broadcast.emit('newMessage', {
        //     from: newMessage.from,
        //     text: newMessage.text,
        //     createdAt: new Date().getTime()
        // })

    });

    socket.on('disconnect', (socket) => {
        console.log('Disconnected from client');
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
