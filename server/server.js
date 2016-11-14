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

    // io.emit => to every single connected user
    // io.to('roomName').emit => to every member of that room

    // socket.broadcast.emit => to everyone but the current user
    // socket.broadcast.to('roomName').emit => everyone in that room but the current user

    // socket.emit => to one user

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.roomName)) {
            return callback('name and room name are required');
        }

        var lcRoom = params.roomName.toLowerCase();

        socket.join(lcRoom);
        userController.removeUser(socket.id);
        var currentUser = userController.addUser(socket.id, params.name, lcRoom);

        console.log("Current User:", currentUser);

        socket.emit('updateUserName', currentUser.name);
        io.to(lcRoom).emit('updateRoomName', params.roomName.toUpperCase());
        io.to(lcRoom).emit('updateUserList', userController.getUserList(lcRoom));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
        socket.broadcast.to(lcRoom).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();

    });

    socket.on('createMessage', (newMessage, callback) => {

        var user = userController.getUser(socket.id);

        if (user && isRealString(newMessage.text)) {
            io.to(user.roomName).emit('newMessage', generateMessage(
                user.name,
                newMessage.text));
        }
        callback();

    });

    socket.on('createLocationMessage', (coords) => {
        var user = userController.getUser(socket.id);
        if (user) {
            io.to(user.roomName).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
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
