describe('reflect', function () {
    it('implements observable pattern', function () {
        let changes = [], target = {
            value: 'foo',
            change() {
                this.value = 'baz';
            }
        };


        function observable(target) {
            const listeners = [],
                proxy = new Proxy(target, {
                    set(target, key, newValue, receiver){
                        listeners.forEach((listener) => listener(target[key], newValue));
                        return Reflect.set(target, key, newValue, receiver);
                    }
                });

            return Object.assign(proxy, {
                observe(listener) {
                    listeners.push(listener);
                }
            });
        }

        let proxy = observable(target);
        proxy.observe((oldValue, newValue) => changes.push(`${oldValue}=>${newValue}`));


        proxy.value = 'bar';
        proxy.change();

        expect(changes).toEqual(['foo=>bar', 'bar=>baz']);
    });
});