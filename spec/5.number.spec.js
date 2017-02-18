describe('number', function () {

    describe('forms', function () {
        it('binary', function () {
            expect(0b11).toBe(3);
        });


        it('octal', function () {
            expect(0o17).toBe(15);
        });


        it('hex', function () {
            expect(0x11).toBe(17);
        });
    });

});