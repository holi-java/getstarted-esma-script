describe('array', function () {

    describe('from', function () {
        it('array-like', function () {
            let o = {0: 'a', 1: 'b', length: 2};
            let array = Array.from(o);

            expect(array).toEqual(['a', 'b']);
        });


        it('iterator', function () {
            function* itr() {
                yield 1;
                yield 2;
            }

            let array = Array.from(itr());

            expect(array).toEqual([1, 2]);
        });


        it('map', function () {
            let evens = Array.from([1, 3, 5], (v) => v * 2);

            expect(evens).toEqual([2, 6, 10]);
        });
    });


    describe('of', function () {

        it('parameters', function () {
            let array = Array.of(1, 2);

            expect(array).toEqual([1, 2]);
        });
    });

    it('iteration', function () {
        let array = ['a', 'b'];
        let result = [];

        for (let [a, b] of array) result.push(`${a}:${b}`);

        expect(result).toEqual(['a:undefined', 'b:undefined']);
    });


    it('merge', function () {
        let a = [1, 2];
        let b = [3, 4, ...a];

        expect(b).toEqual([3, 4, 1, 2]);
    });

    it('spread string', function () {
        let a = [...'one'];

        expect(a).toEqual(['o', 'n', 'e']);
    });
});