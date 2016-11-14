const express = require('express');
const http = require('http');
const path = require('path');
const publicPath = path.join(__dirname, '../public/');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');
const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var {
    isRealString
} = require('./utils/validation');
const {
    UserController
} = require('./utils/user-controller');


app.use(express.static(publicPath));
var userController = new UserController();

io.on('connection', (socket) => {
    console.log('new user connected');

    // io.emit => to every single connected user
    // io.to('roomName').emit => to every member of that room

    // socket.broadcast.emit => to everyone but the current user
    // socket.broadcast.to('roomName').emit => everyone in that room but the current user

    // socket.emit => to one user

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.roomName)) {
            return callback('name and room name are required');
        }

        socket.join(params.roomName);
        userController.removeUser(socket.id);
        userController.addUser(socket.id, params.name, params.roomName);

        io.to(params.roomName).emit('updateUserList', userController.getUserList(params.roomName));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
        socket.broadcast.to(params.roomName).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        //io.to(params.roomName).emit('')

        callback();

    });

    socket.on('createMessage', (newMessage, callback) => {

        io.emit('newMessage', generateMessage(
            newMessage.from,
            newMessage.text));
        callback();

    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {

        var user = userController.removeUser(socket.id);
        if (user) {
            io.to(user.roomName).emit('updateUserList', userController.getUserList(user.roomName));
            io.to(user.roomName).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
        }

    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
