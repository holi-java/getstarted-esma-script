describe('lambda', function () {

    it('type', function () {
        let f = (v) => v;

        expect(typeof f).toEqual('function');
    });

});