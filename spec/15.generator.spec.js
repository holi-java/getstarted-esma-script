describe('generator', function () {
    it('function', function () {
        function *itr() {
            yield 'one';
            yield 'two';
        }

        const it = itr();

        expect(it.next()).toEqual({value: 'one', done: false});
        expect(it.next()).toEqual({value: 'two', done: false});
        expect(it.next()).toEqual({value: undefined, done: true});
    });

    it('object', function () {
        let itr = {
            [Symbol.iterator]: function *itr() {
                yield 'one';
                yield 'two';
            }
        };

        expect([...itr]).toEqual(['one', 'two']);
    });

    it('simple object', function () {
        let itr = {
            *[Symbol.iterator]() {
                yield 'one';
                yield 'two';
            }
        };

        expect([...itr]).toEqual(['one', 'two']);
    });

    it('class', function () {
        class Itr {
            [Symbol.iterator]() {
                return function*() {
                    yield 'one';
                    yield 'two';
                }();
            }

        }
        expect([...new Itr()]).toEqual(['one', 'two']);
    });

    it('yield *', function () {
        function* itr() {
            yield 'one';
            yield* ['two', 'three'];
            yield 'four';
        }

        expect([...itr()]).toEqual(['one', 'two', 'three', 'four']);
    });

    it('return', function () {
        function* itr() {
            yield 'one';
            return 'last';
        }

        expect([...itr()]).toEqual(['one']);
    });

    it('lazy eval yield statement', function () {
        function* fn() {
            throw 'error';
        }

        fn();

        expect(() => fn().next()).toThrow('error');
    });

    it("next(arg)", function () {
        function* gen() {
            let value = yield 1;
            yield 3;
            yield value;
        }

        let g = gen();

        expect(g.next()).toEqual({value: 1, done: false});
        expect(g.next(2)).toEqual({value: 3, done: false});
        expect(g.next()).toEqual({value: 2, done: false});
        expect(g.next()).toEqual({value: undefined, done: true});
    });
});