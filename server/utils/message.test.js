var expect = require('expect');
var {
    generateMessage
} = require('./message');


describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        var fromVal = 'Jim';
        var textVal = 'Here is a text message';
        var message = generateMessage(fromVal, textVal);

        expect(message.from).toBe(fromVal);
        expect(message.text).toBe(textVal);
        expect(message.createdAt).toBeA('number');

    });
})
