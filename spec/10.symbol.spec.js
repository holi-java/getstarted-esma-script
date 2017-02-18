describe('symbol', function () {
    it('type', function () {
        let s = Symbol();

        expect(typeof s).toEqual('symbol');
    });

    it('creation', function () {
        let s = Symbol('foo');

        expect(s.toString()).toEqual('Symbol(foo)');
    });

    it('equality', function () {
        expect(Symbol('foo')).not.toEqual(Symbol('foo'));
    });

    describe('convertion', function () {
        it('to string', function () {
            let s = Symbol('foo');

            expect(String(s)).toEqual(s.toString());
        });

        it('to boolean', function () {
            let s = Symbol('foo');

            expect(!s).toEqual(false);
        });

        it("can't cast to number", function () {
            let s = Symbol('1');

            expect(() => Number(s)).toThrowError(TypeError);
        });
    });


    it('using as object property name', function () {
        let [foo, fuzz]=[Symbol(), Symbol()];

        let o = {[foo]: 'bar', [fuzz]: 'buzz'};

        expect(o[foo]).toEqual('bar');
        expect(o[fuzz]).toEqual('buzz');
    });


});