describe('spread', function () {
    it('array', function () {
        let a = [1, 2, 3];

        let b = [...a];

        expect(b).not.toBe(a);
        expect(b).toEqual(a);
    });

    it('array likes', function () {
        let a = {
            0: 1,
            1: 2,
            length: 2
        };

        let b = [...a];

        expect(b).not.toBe(a);
        expect(b).toEqual([1, 2]);
    });

    it('object', function () {
        let a = {foo: 'bar'};

        let b = {...a};

        expect(b).not.toBe(a);
        expect(b).toEqual(a);
    });

    it('iterator', function () {
        let array = [1, 2, 3];

        function *itr() {
            yield* array;
        }

        let a = [...itr()];

        expect(a).toEqual(array);
    });
});