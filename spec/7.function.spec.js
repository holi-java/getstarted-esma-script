describe('function', function () {
    it('default parameters', function () {
        function sum(a, b = 2) {
            return a + b;
        }

        expect(sum(1, 3)).toBe(4);
        expect(sum(1)).toBe(3);
    });


    describe('double defaults', function () {
        it('object', function () {
            function sum({a = 1, b = 2}={}) {
                return a + b;
            }

            expect(sum({a: 3})).toBe(5);
            expect(sum({})).toBe(3);
            expect(sum()).toBe(3);
        });

        it('object2', function () {
            function sum({a, b}={a: 1, b: 2}) {
                return a + b;
            }

            expect(sum({a: 3})).toEqual(NaN);
            expect(sum({})).toEqual(NaN);
            expect(sum()).toBe(3);
        });


        it('array', function () {
            function sum([a = 1, b = 2]=[]) {
                return a + b;
            }

            expect(sum([3])).toBe(5);
            expect(sum([])).toBe(3);
            expect(sum()).toBe(3);
        });
    });

    describe('parameter length', function () {
        it('normal', function () {
            function sum0(a, b) {
            }

            expect(sum0.length).toBe(2);
        });

        it('default', function () {
            function sum1(a, b = 2) {
            }

            function sumx(a = 1, b) {
            }

            function sum2(a = 1, b = 2) {
            }

            expect(sum1.length).toBe(1);
            expect(sumx.length).toBe(0);
            expect(sum2.length).toBe(0);
        });


        it('rest', function () {
            function sum0(...numbers) {
            }

            expect(sum0.length).toBe(0);
        });
    });


    it('spread', function () {
        let array = [1, 2];

        function fn(a) {
            return a;
        }

        expect(fn(array)).toEqual(array);
        expect(fn(...array)).toEqual(1);
    });


    describe('name', function () {

        it('function within name', function () {
            function sum() {
            }

            expect(sum.name).toEqual('sum');
        });


        it('assign with anonymous function', function () {
            let sum = function () {
            }

            expect(sum.name).toEqual('sum');
        });


        it('assign with named function', function () {
            let sum = function add() {
            }

            expect(sum.name).toEqual('add');
        });
    });

    it('bind context', function () {
        function self() {
            return this;
        }

        let s = 'foo';

        expect(s::self()).toEqual('foo');
    });


});