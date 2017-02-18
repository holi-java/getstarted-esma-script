describe('class', function () {
    describe('properties', function () {
        it('declaration', function () {
            class Bar {
                foo = 'bar';
            }

            let bar = new Bar();

            expect(bar.foo).toEqual('bar');
        });

        it('get', function () {
            class Bar {
                get foo() {
                    return 'bar';
                }
            }

            let bar = new Bar();

            expect(bar.foo).toEqual('bar');
        });

        it('set', function () {
            class Bar {
                value

                set foo(value) {
                    this.value = value;
                }
            }

            let bar = new Bar();

            bar.foo = 'bar';

            expect(bar.value).toEqual('bar');
        });

        it('list', function () {
            class Bar {
                value = 'foo'

                constructor() {
                    this.value = 'bar';
                }

                get foo() {
                }

                toString() {
                }
            }
            Bar.prototype.extension = 'foo';

            const members = Bar.prototype;
            expect(Object.keys(members)).toEqual(['extension']);
            expect(new Set(Object.getOwnPropertyNames(members))).toEqual(new Set(['toString', 'constructor', 'foo', 'extension']));
        });
    });

    describe('constructor', function () {
        it('declaration', function () {
            class Point {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                }
            }

            let p = new Point(3, 4);

            expect(p.x).toBe(3);
            expect(p.y).toBe(4);
        });

        it(`tampered by return`, function () {
            class Bar {
                constructor() {
                    this.foo = 'bar';
                    return new Number(1);
                }
            }

            let bar = new Bar(3, 4);
            expect(bar).toEqual(1);
        });
    });


    describe('method', function () {
        it('toString', function () {
            class Bar {
                toString() {
                    return 'bar';
                }
            }

            expect(`${new Bar()}`).toBe('bar');
        });
    });

    describe('mix-in', function () {
        it('class', function () {
            class Bar {
            }

            Object.assign(Bar.prototype, {
                value: 'bar',
                foo() {
                    return this.value;
                }
            });

            expect(new Bar().foo()).toBe('bar');
        });

        it('object', function () {
            class Bar {
            }
            let bar1 = new Bar();
            let bar2 = new Bar();

            Object.assign(bar1.__proto__, {
                value: 'bar',
                foo() {
                    return this.value;
                }
            });

            expect(bar1.foo()).toBe('bar');
            expect(bar2.foo()).toBe('bar');
            expect(Bar.prototype.foo).not.toBeUndefined();
        });
    });

    describe('assignment', function () {
        it('new anonymous class', function () {
            let instance = new class {
            };

            expect(instance.name).toBe(undefined);
        });

        it('class with name', function () {
            let _class = class Bar {
                get className() {
                    return Bar.name;
                }
            };

            expect(_class.name).toBe('Bar');
            expect(new _class().className).toBe('Bar');
        });

        it('anonymous class', function () {
            let _class = class {
            };

            expect(_class.name).toBe('_class');
        });
    });


    describe('extends', function () {

        it('inherit properties', function () {
            class Bar {
                foo = 'bar';
            }

            class Fuzz extends Bar {
                fuzz = 'buzz';

            }

            let fuzz = new Fuzz();
            expect(fuzz.fuzz).toBe('buzz');
            expect(fuzz.foo).toBe('bar');
        });

        describe('super', function () {
            it('call parent constructor', function () {
                class Bar {
                    constructor(foo) {
                        this.foo = foo;
                    }
                }

                class Fuzz extends Bar {
                    constructor(...args) {
                        super(...args);
                    }
                }

                let fuzz = new Fuzz('bar');

                expect(fuzz.foo).toBe('bar');
            });

            it('call parent method', function () {
                class Bar {
                    set foo(value) {
                        this._value = value;
                    }

                    get foo() {
                        return this._value;
                    }
                }

                class Fuzz extends Bar {
                    constructor(foo) {
                        super();
                        super.foo = foo;
                    }
                }

                let fuzz = new Fuzz('bar');

                expect(fuzz.foo).toBe('bar');
            });
        });
    });

    describe('prototype', function () {
        class Nil extends null {
        }
        class Parent {
        }
        class Child extends Parent {
        }

        it('no extends', function () {
            expect(Parent.__proto__).toBe(Function.prototype);
            expect(Parent.prototype.__proto__).toBe(Object.prototype);
            expect(new Parent().__proto__).toBe(Parent.prototype);
        });

        it('extends null', function () {
            expect(Nil.__proto__).toBe(Function.prototype);
            expect(Nil.prototype.__proto__).toBeUndefined();
        });

        it('subclass', function () {
            expect(Child.__proto__).toBe(Parent);
            expect(Child.prototype.__proto__).toBe(Parent.prototype);
        });
    });

    it('final class', function () {
        class A {
            constructor() {
                if (new.target != A) {
                    throw "can't be extended.";
                }
            }
        }
        class B extends A {

        }

        let success = new A();
        expect(() => new B()).toThrow("can't be extended.");
    });

    it('abstract class', function () {
        class A {
            constructor() {
                if (new.target == A) {
                    throw "class " + A.name + " is abstract.";
                }
            }
        }
        class B extends A {

        }

        let success = new B();
        expect(() => new A()).toThrow("class A is abstract.");
    });

    it('static', function () {
        class Bar {
            static value = 'bar';

            static foo() {
                return Bar.value;
            }
        }

        expect(Bar.value).toBe('bar');
        expect(Bar.foo()).toBe(Bar.value);
    });
});