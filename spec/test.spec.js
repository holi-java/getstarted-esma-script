describe('test', function () {
    it('environment is ready in use', function () {
        let value = () => 1;
        expect(value()).toBe(1);
    });
});