const {
    UserController
} = require('./user-controller');
const expect = require('expect');

var userController;

beforeEach(() => {
    userController = new UserController();
    userController.users = [{
        id: '1',
        name: 'Mike',
        roomName: 'Node Course'
    }, {
        id: '2',
        name: 'Jim',
        roomName: 'React Course'
    }, {
        id: '3',
        name: 'Julie',
        roomName: 'Node Course'
    }];
});

describe('Users', () => {

    it('should add new user', () => {
        var userController = new UserController();
        var user = userController.addUser('abc', 'Jim', 'Games');
        expect(userController.users).toEqual([user]);

    });

    it('should return names for Node Course', () => {
        var userList = userController.getUserList('Node Course');
        expect(userList).toEqual(['Mike', 'Julie']);
    });

    it('should return names for React Course', () => {
        var userList = userController.getUserList('React Course');
        expect(userList).toEqual(['Jim']);
    });

    it('should remove a user', () => {
        var removedUser = userController.removeUser('3');
        expect(userController.users.length).toBe(2);
        expect(removedUser.id).toBe('3');
    });

    it('should not remove a user', () => {
        var removedUser = userController.removeUser('asklfj');
        expect(removedUser).toNotExist();
        expect(userController.users.length).toBe(3);
    });

    it('should find user', () => {
        var user = userController.getUser('1');
        expect(user.name).toBe('Mike');
        expect(user).toEqual(userController.users[0]);
    });

    it('should not find a user', () => {
        var user = userController.getUser('abc');
        expect(user).toNotExist();
    });



});
