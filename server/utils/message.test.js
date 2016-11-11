var expect = require('expect');
var {
    generateMessage,
    generateLocationMessage
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
});

describe('generate locationMessage', () => {
    it('should generate correct location object', () => {

        var from = "Jim";
        var latitude = 10;
        var longitude = 25;

        var locationMessage = generateLocationMessage(from, latitude, longitude);

        expect(locationMessage.from).toBe(from);
        expect(locationMessage.url).toBe(`https://www.google.com/maps?q=${latitude},${longitude}`);
        expect(locationMessage.createdAt).toBeA('number');
    });
});
