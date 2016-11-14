class UserController {

    constructor() {
        this.users = [];
    }

    addUser(id, name, roomName) {
        var user = {
            id,
            name,
            roomName
        };

        this.users.push(user);
        return user;
    }

    removeUser(id) {
        var user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(roomName) {
        var filteredUsers = this.users.filter((user) => user.roomName === roomName);
        var namesArray = filteredUsers.map((user) => user.name);
        return namesArray;
    }

    getAllUsers() {
        return this.users;
    }

}

module.exports = {
    UserController
};
