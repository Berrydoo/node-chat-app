const expect = require('expect');
const {
    isRealString
} = require('./validation');


describe('isRealString', () => {

    it('should reject non-string values', () => {
        expect(isRealString(34)).toBe(false);
    });

    it('should reject strings with only spaces', () => {
        expect(isRealString('    ')).toBe(false);
    });

    it('shold accept real strings', () => {
        expect(isRealString('  Jim is awesome   ')).toBe(true);
    })
});
