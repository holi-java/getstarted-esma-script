describe('variable', function () {

    describe('scope', function () {

        it('block', function () {
            let_in_block:{
                let foo = 'bar';
                var fuzz = 'buzz';

                expect(foo).toBe('bar');
                expect(fuzz).toBe('buzz');
            }

            expect(typeof foo).toBe('undefined');
            expect(fuzz).toBe('buzz');
        });


        it('loop', function () {
            for (let a = 0; a < 5; a++);
            for (var b = 0; b < 5; b++);

            expect(typeof a).toBe('undefined');
            expect(b).toBe(5);
        });


        it('inner function', function () {
            let foo = [], bar = [];
            for (let i = 0; i < 5; i++) foo[i] = function () {
                return i;
            };
            for (var j = 0; j < 5; j++) bar[j] = function () {
                return j;
            };

            expect(foo[2]()).toBe(2);
            expect(bar[2]()).toBe(5);
        });


        it('duplicated variable in for loop', function () {
            let numbers = [];

            for (let i = 0; i < 3; i++) {
                numbers.push(i);
                let i = 2;
            }

            expect(numbers).toEqual([0]);
        });


        it('override', function () {

            var foo = new Date();

            function f() {
                if (false) {
                    var foo = 'override by this variable';
                }
                return foo;
            }

            expect(f()).toBeUndefined();
        });
    });


    describe('assignment', function () {

        it("can't declaring two same let variables", function () {
            expect(() => eval('let a;\nlet a;')).toThrowError();
            expect(() => eval('var a;\nvar a;')).not.toThrowError();
            expect(() => eval('let a;\nvar a;')).toThrowError(SyntaxError);
            expect(() => eval('var a;\nlet a;')).toThrowError(SyntaxError);
        });


        describe('const', function () {
            it("must be assigned once", function () {
                var code = `const PI = 3.1415;
                        PI = 2;`;

                expect(() => eval(code)).toThrowError(TypeError);
            });


            it("must be initialized", function () {
                var code = `const PI;`;

                expect(() => eval(code)).toThrowError(SyntaxError);
            });

        });
    });
});