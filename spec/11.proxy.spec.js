describe('proxy', function () {
    const TAMPERED = ['tampered'];
    let target;

    beforeEach(function () {
        target = {foo: 'bar', action: () => 'action'};
    });

    describe('intercept', function () {
        it('get', function () {
            let proxy = new Proxy(target, {
                get(target, property){
                    return TAMPERED;
                }
            });

            expect(proxy.foo).toBe(TAMPERED);
            expect(proxy.missing).toBe(TAMPERED);
        });

        it('method', function () {
            let proxy = new Proxy(target, {
                get(target, property){
                    return function () {
                        return TAMPERED;
                    };
                }
            });

            expect(proxy.action()).toEqual(TAMPERED);
            expect(proxy.missing()).toEqual(TAMPERED);
            expect(proxy.action(1, 2, 3)).toEqual(TAMPERED);
        });

        describe('set', function () {
            it('in proxy', function () {
                let proxy = new Proxy(target, {
                    set(target, property, value){
                        return property != 'fuzz';

                    }
                });

                proxy.foo = 'buzz';

                expect(proxy.foo).toEqual('bar');
                expect(() => proxy.fuzz = 'buzz').toThrowError(TypeError);
            });

            it('in target', function () {
                let target = {
                    foo: 'bar',
                    change(){
                        this.foo = 'buzz';
                    }
                };
                let proxy = new Proxy(target, {
                    set(target, property, value){
                        return true;
                    }
                });

                proxy.change();

                expect(proxy.foo).toEqual('bar');//unchanged
            });
        });


        it('function', function () {
            let fn = () => 'original';
            let proxy = new Proxy(fn, {
                apply(target, context, args){
                    return TAMPERED;
                }
            });

            expect(proxy()).toEqual(TAMPERED);
        });

        describe('has', function () {
            let proxy;
            beforeEach(() => {
                proxy = new Proxy(target, {
                    has(target, key){
                        return false;
                    }
                });
            });

            it('prevent', function () {
                Object.preventExtensions(target);

                expect(() => 'foo' in proxy).toThrowError(TypeError);
            });

            it('intercept', function () {
                expect(proxy.hasOwnProperty('foo')).toBe(true);
                expect('foo' in proxy).toBe(false);
                expect('missing' in proxy).toBe(false);
            });

            it('disabled in for...in', function () {
                let keys = [];
                for (let key in proxy)keys.push(key);

                expect(keys).toContain('foo');
            });
        });


        it('constructor', function () {
            const value = 1, origin = () => value;

            let proxy = new Proxy(origin, {
                construct(target, args){
                    throw new SyntaxError();
                }
            });

            expect(proxy()).toBe(value);
            expect(() => new proxy()).toThrowError(SyntaxError);
        });


        it('delete property', function () {
            let proxy = new Proxy(target, {
                deleteProperty(){
                    return true;
                }
            });

            delete proxy.foo;

            expect(proxy.foo).toEqual('bar');
        });

        describe('define property', function () {
            let proxy;
            beforeEach(() => {
                proxy = new Proxy(target, {
                    defineProperty(){
                        return true;
                    }
                });
            });

            it('intercept', function () {
                proxy.fuzz = 'buzz';

                expect(proxy.fuzz).toBeUndefined();
            });

            it('prevent', function () {
                Object.preventExtensions(target);

                expect(() => proxy.fuzz = 'buzz').toThrowError(TypeError);
            });
        });


        it('get own property descriptor', function () {
            let proxy = new Proxy(target, {
                getOwnPropertyDescriptor(target, key){
                    return undefined;
                }
            });

            expect(proxy.hasOwnProperty('foo')).toBe(false);
            expect('foo' in proxy).toBe(true);
            expect(Object.getOwnPropertyDescriptor(proxy, 'foo')).toBe(undefined);
            expect(Object.getOwnPropertyDescriptor(proxy, 'missing')).toBe(undefined);
        });

        it('prototype', function () {
            let proxy = new Proxy(target, {
                getPrototypeOf(target){
                    return TAMPERED;
                }
            });

            expect(Object.getPrototypeOf(proxy)).toEqual(TAMPERED);
            expect(proxy.__proto__).toEqual(TAMPERED);
        });

        it('extensible', function () {
            let proxy = new Proxy(target, {
                isExtensible(){
                    return false;
                }
            });

            expect(Object.isExtensible(target)).toBe(true);
            expect(() => Object.isExtensible(proxy)).toThrowError(TypeError);
        });


        describe('ownKeys', function () {
            it('intercept', function () {
                let proxy = new Proxy(target, {
                    ownKeys(target){
                        return ['foo'];
                    }
                });

                expect(Object.keys(target)).toEqual(['foo', 'action']);
                expect(Object.keys(proxy)).toEqual(['foo']);
                expect(Object.getOwnPropertyNames(proxy)).toEqual(['foo']);
            });

            it('Object.keys() skip unknown keys', function () {
                let proxy = new Proxy(target, {
                    ownKeys(target){
                        return ['foo', 'bar'];
                    }
                });

                expect(Object.keys(proxy)).toEqual(['foo']);
                expect(Object.getOwnPropertyNames(proxy)).toEqual(['foo', 'bar']);
            });
        });

        describe('prevent extensions', function () {

            it('prevent', function () {
                let proxy = new Proxy({}, {
                    preventExtensions(target){
                        Object.preventExtensions(target);
                        return true;
                    }
                });

                Object.preventExtensions(proxy);
            });


            it("can't prevent extensible object", function () {
                let proxy = new Proxy(target, {
                    preventExtensions(target){
                        return true;
                    }
                });

                expect(() => Object.preventExtensions(proxy)).toThrowError(TypeError);
            });
        });

        it('set prototype of', function () {
            let proxy = new Proxy(target, {
                setPrototypeOf(target, proto){
                    throw 'intercepted';
                }
            });

            expect(() => proxy.__proto__ = {}).toThrow('intercepted');
        });


        it('revocable', function () {
            let {proxy, revoke}=Proxy.revocable(target, {
                get: () => TAMPERED
            });

            expect(proxy.foo).toEqual(TAMPERED);

            revoke();
            expect(() => proxy.foo).toThrowError(TypeError);
        });
    });

    describe('this', function () {
        it('handler', function () {
            const handler = {
                get(target, property){
                    return this;
                }
            };
            let proxy = new Proxy(target, handler);

            expect(proxy.name).toEqual(handler);
        });

        it('target', function () {
            let target = {
                play: function () {
                    return this;
                }
            };

            let proxy = new Proxy(target, {});

            expect(target.play()).toEqual(target);
            expect(proxy.play()).toEqual(proxy);
        });
    });

    describe('receiver', function () {
        it('method', function () {
            let proxy = new Proxy(target, {
                get(target, property, receiver){
                    return function () {
                        return receiver;
                    };
                }
            });
            expect(proxy.action()).toEqual(target.action);
        });

        it('get', function () {
            let proxy = new Proxy(target, {
                get(target, property, receiver){
                    return receiver;
                }
            });

            expect(proxy.foo).toEqual(proxy);
        });
    });

    it('proxy primitive is denied', () => {
        expect(() => new Proxy(1, () => {
        })).toThrowError(TypeError);
    });

    it('proxy is instanceof target', () => {
        function foo() {

        }

        var target = new foo();
        var p = new Proxy(target, {
            construct: function (target, ...args) {
                return Reflect.construct(ctor, ...args);
            }
        });

        expect(p instanceof foo).toBe(true);
        expect(p instanceof target.constructor).toBe(true);
    });

    it('target un-configurable properties must be exists in handler.ownKeys()', () => {
        function foo() {

        }

        Object.defineProperty(foo, 'bar', {configurable: false});

        var p = new Proxy(foo, {
            ownKeys() {
                return ['prototype','bar'];
            }
        });

        expect(() => Object.keys(p)).not.toThrow();
    });


});