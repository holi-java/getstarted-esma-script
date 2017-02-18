describe('iterator', function () {
    describe("return", function () {
        it('no finally', function () {

            function* itr() {
                yield 'one';
                yield 'two';
            }

            let it = itr();

            expect(it.return('foo')).toEqual({value: 'foo', done: true});
            expect(it.next()).toEqual({value: undefined, done: true});
        });

        it('finally', function () {

            function* itr() {
                try {
                    yield 'one';
                    yield 'two';
                } finally {
                    yield 'three';
                }
            }

            let it = itr();

            expect(it.next()).toEqual({value: 'one', done: false});
            expect(it.return('foo')).toEqual({value: 'three', done: false});
            expect(it.next()).toEqual({value: 'foo', done: true});
        });
    });


    describe('throw', function () {
        it('has catch in generator', function () {
            let errors = [];

            function* fn() {
                try {
                    yield;
                } catch (e) {
                    errors.push(e);
                }
            }

            let itr = fn();
            itr.next();

            itr.throw('first');

            expect(errors).toEqual(['first']);
            expect(() => itr.throw('last')).toThrow('last');
        });

        it('no catch in generator', function () {
            function* fn() {
            }

            let itr = fn();

            expect(() => itr.throw('last')).toThrow('last');
        });
    });

    describe('this', function () {
        it('normal', function () {
            function *f() {
                this.name = 'foo';
                yield this;
            }

            let itr = f();

            expect(() => itr.next()).toThrowError(/'name' of undefined/);

        });

        it('normal', function () {
            function *f() {
                this.name = 'foo';
                yield this;
            }

            let itr = f.call(f.prototype);

            itr.next();

            expect(itr.name).toEqual('foo');
        });

    });
});