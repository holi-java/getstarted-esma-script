describe('promise', function () {

    it('async', function () {
        it('code out of promise', function (done) {
            let results = [];

            Promise.resolve().then(() => results.push('async')).then(() => {
                expect(results).toEqual(['sync', 'async']);
                done();
            });
            results.push('sync');
        });

        it('code in promise', function (done) {
            let results = [], expected = [];

            let p = Promise.resolve();
            for (let i = 0; i < 100; i++) {
                expected.push(i);
                p = p.then(() => results.push(i));
            }

            p.then(() => {
                expect(results).toEqual(expected);
                done();
            });
        });
    });

    describe('resolved', function () {
        it('notify changes after added callback', function (done) {
            let promise = new Promise((resolve) => resolve('ok'));

            promise.then((result) => {
                expect(result).toBe('ok');
                done();
            }, (error) => {
                fail();
                done();
            });
        });


        it('notify callback after changes', function (done) {
            let finish;
            let promise = new Promise((resolve) => finish = () => resolve('ok'));

            promise.then((result) => {
                expect(result).toBe('ok');
                done();
            });


            finish();
        });

        it('notify once', function (done) {

            let promise = new Promise((resolve) => {
                resolve('first');
                resolve('last');
            });

            promise.then((result) => {
                expect(result).toBe('first');
                done();
            }, (error) => {
                fail();
                done();
            });
        });
    });


    describe('rejected', function () {
        it('notify error after added callback', function (done) {
            let promise = new Promise((resolve, reject) => reject('reason'));

            promise.then((result) => {
                fail();
                done();
            }, (error) => {
                expect(error).toBe('reason');
                done();
            });
        });


        it('notify callback after reject', function (done) {
            let error;
            let promise = new Promise((resolve, reject) => error = () => reject('reason'));

            promise.then((result) => {
                fail();
                done();
            }, (error) => {
                expect(error).toBe('reason');
                done();
            });


            error();
        });

        it('notify once', function (done) {
            let promise = new Promise((resolve, reject) => {
                reject('first');
                reject('last');
            });

            promise.then(null, (error) => {
                expect(error).toBe('first');
                done();
            });
        });
    });

    describe('catch', function () {
        describe('fails', function () {
            it('in callback', function (done) {
                let promise = new Promise(() => {
                    throw 'failed';
                });

                promise.catch((e) => {
                    expect(e).toEqual('failed');
                    done();
                });
            });

            it('by reject', function (done) {
                let promise = new Promise((_, reject) => {
                    reject('failed');
                });

                promise.catch((e) => {
                    expect(e).toEqual('failed');
                    done();
                });
            });

            it('in then', function (done) {
                let promise = new Promise((resolve) => resolve());

                promise.then(() => {
                    throw 'failed';
                }).catch((e) => {
                    expect(e).toEqual('failed');
                    done();
                });
            });

            it('in catch then tail', function (done) {
                let promise = new Promise((resolve) => resolve());

                promise.catch((e) => {
                    fail("can't be notified");
                }).then(() => {
                    throw 'failed';
                }).catch(done);
            });
        });

        it('then', function (done) {
            let promise = new Promise(() => {
                throw 'failed';
            });

            promise.catch(() => 'ok').then((data) => {
                expect(data).toBe('ok');
                done();
            });
        });


        it('discard error when state is RESOLVED', function (done) {
            let promise = new Promise((resolve) => {
                resolve('ok');
                throw 'failed';
            });

            promise.catch(fail).then((data) => {
                expect(data).toEqual('ok');
                done();
            });
        });
    });

    describe('chain', function () {

        it('instances', function () {
            let promise = Promise.resolve();
            let chain = promise.then();

            expect(chain.then() === chain).toBe(false);
        });


        it('resolve', function (done) {
            let promise = new Promise((resolve) => resolve({foo: {fuzz: 'buzz'}}));

            promise.then(function (data) {
                return data.foo;
            }).then(function (foo) {
                expect(foo.fuzz).toEqual('buzz');
                done();
            });
        });

        it('nested promise', function (done) {
            let promise = new Promise((resolve) => resolve({foo: {fuzz: 'buzz'}}));

            promise.then(function (data) {
                return Promise.resolve(data.foo);
            }).then(function (foo) {
                expect(foo.fuzz).toEqual('buzz');
                done();
            });
        });


        it('catches', function (done) {
            let promise = new Promise((_, reject) => reject({error: 'failed'}));

            promise.catch((e) => {
                throw e.error;
            }).catch((e) => {
                expect(e).toEqual('failed');
                done();
            });
        });
    });

    describe('all', function () {
        it('resolved', function (done) {
            let promise = Promise.all([Promise.resolve('foo'), Promise.resolve('bar')]);


            promise.then((data) => {
                expect(data).toEqual(['foo', 'bar']);
                done();
            })
        });

        it('rejected', function (done) {
            let promise = Promise.all([Promise.reject('foo'), Promise.reject('bar')]);


            promise.then(fail).catch((data) => {
                expect(data).toEqual('foo');
                done();
            });
        });

        it('some rejected', function (done) {
            let promise = Promise.all([Promise.resolve('foo'), Promise.reject('bar')]);

            promise.then(fail).catch((data) => {
                expect(data).toEqual('bar');
                done();
            });
        });
    });

    describe('race', function () {
        it('resolved', function (done) {
            let promise = Promise.race([Promise.resolve('foo'), Promise.resolve('bar')]);


            promise.then((data) => {
                expect(data).toEqual('foo');
                done();
            })
        });

        it('rejected', function (done) {
            let promise = Promise.race([Promise.reject('foo'), Promise.reject('bar')]);


            promise.then(fail).catch((data) => {
                expect(data).toEqual('foo');
                done();
            });
        });

        it('some rejected', function (done) {
            let promise = Promise.race([Promise.resolve('foo'), Promise.reject('bar')]);

            promise.catch(fail).then((data) => {
                expect(data).toEqual('foo');
                done();
            });
        });
    });

    describe('resolve', function () {

        it('other types', function () {
            let promise = Promise.resolve('foo');

            expect(promise instanceof Promise).toBe(true);
        });

        it('promise', function () {
            let source = Promise.resolve('foo');
            let promise = Promise.resolve(source);

            expect(promise).toBe(source);
        });
    });

});