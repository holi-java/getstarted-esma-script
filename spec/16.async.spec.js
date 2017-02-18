describe('async', function () {
    it('callback', function (done) {
        function callback() {
            done();
        }

        setTimeout(callback, 10);
    });

    it('promise', function (done) {
        new Promise((_, reject) => setTimeout(reject, 10)).catch(() => {
            done();
        });
    });


    describe('function', function () {
        it('all resolved', function (done) {
            async function go() {
                function it(n) {
                    return new Promise((resolve) => {
                        setTimeout(() => resolve(n), 100);
                    });
                }

                const first = await it(1);
                const last = await it(2);
                return [first, last];
            }

            go().then((result) => {
                expect(result).toEqual([1, 2]);
                done();
            });
        });

        it('all rejected', function (done) {
            async function go() {
                const first = await Promise.reject(1);
                const last = await Promise.reject(2);
                return [first, last];
            }

            go().catch((result) => {
                expect(result).toEqual(1);
                done();
            });
        });

        it('some rejected', function (done) {
            async function go() {
                const first = await Promise.resolve(1);
                const last = await Promise.reject(2);
                return [first, last];
            }

            go().then(fail).catch((result) => {
                expect(result).toEqual(2);
                done();
            });
        });

        it('try/catch some rejected', function (done) {
            async function go() {
                let first, last;
                try {
                    first = await Promise.reject(2);
                } catch (ignored) {
                    first = 'error';
                }
                last = await Promise.resolve(1);
                return [first, last];
            }

            go().catch(fail).then((result) => {
                expect(result).toEqual(['error', 1]);
                done();
            });
        });

        it('catch some rejected', function (done) {
            async function go() {
                let first, last;
                first = await Promise.reject(2).catch(() => first = 'error');
                last = await Promise.resolve(1);
                return [first, last];
            }

            go().catch(fail).then((result) => {
                expect(result).toEqual(['error', 1]);
                done();
            });
        });

    });


    it('generator', function (done) {
        async function* gen() {
            yield *[1, 2, 3];
        }

        async function fetch(g) {
            let results = [];
            for await(let v of g){
                results.push(v);
            }
            return results;
        }

        expect([...gen()]).toEqual([]);

        fetch(gen()).then((v) => {
            expect(v).toEqual([1, 2, 3]);
            done();
        });

    });
});