describe('object', function () {
    describe('assignment', function () {
        it('properties', function () {
            let foo = 'bar';
            let o = {foo};

            expect(o.foo).toEqual('bar');
        });

        it('methods', function () {
            let foo = () => 'bar';
            let o = {foo};

            expect(o.foo()).toEqual('bar');
        });

        it('dynamic name', function () {
            let foo = 'bar';

            let o = {[foo]: 'buzz'};

            expect(o.bar).toEqual('buzz');
        });
    });

    describe('get/set', function () {
        it('get', function () {
            let foo = {
                get name() {
                    return 'bar';
                }
            };

            expect(foo.name).toEqual('bar');
        });

        it('set', function () {
            let name;
            let foo = {
                set name(n) {
                    name = n;
                }
            };

            foo.name = 'bar';

            expect(name).toEqual('bar');
        });
    });


    it('iterator method', function () {
        let foo = {
            * values() {
                yield 1;
                yield 2;
            }
        };

        let result = [...foo.values()];

        expect(result).toEqual([1, 2]);
    });
});