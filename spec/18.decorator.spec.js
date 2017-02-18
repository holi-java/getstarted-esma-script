describe('decorator', function () {
    it('class', function () {
        function readable(target) {
            target.readonly = true;
        }

        @readable
        class A {
        }

        expect(A.readonly).toBe(true);
    });

    it('multi parameters', function () {
        function testable(enabled, name = 'default') {
            return function (target) {
                Object.assign(target, {
                    get testable() {
                        return enabled;
                    },
                    get testName() {
                        return name;
                    }
                });
            }
        }

        @testable(true, 'test')
        class A {
        }

        expect(A.testable).toBe(true);
        expect(A.testName).toBe('test');
    });

    describe('method', function () {
        it('method', function () {
            let parameters;

            function readonly(target, name, descriptor) {
                parameters = [target, name, descriptor];
                descriptor.writable = false;
            }

            class Bar {
                @readonly name
            }

            expect(parameters[0]).toEqual(Bar.prototype);
            expect(parameters[1]).toEqual('name');
            expect(parameters[2].writable).toEqual(false);
        });


        it('intercept', function () {
            let logs = [];

            function log(target, name, descriptor) {
                let origin = descriptor.value;
                descriptor.value = function () {
                    logs.push(`${target.constructor.name}.${name}() was called`);
                    return this::origin(...arguments);
                };
            }

            class Bar {
                @log foo() {
                    return 'bar';
                }
            }

            let bar = new Bar();
            expect(logs).toEqual([]);

            expect(bar.foo()).toBe('bar');
            expect(logs).toEqual([`Bar.foo() was called`]);
        });
    });

});