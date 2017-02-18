describe('destructing', function () {

    describe('array', function () {

        it('assign', function () {
            let [a, b]=[1, 2, 3];

            expect(a).toBe(1);
            expect(b).toBe(2);
        });


        it('nested assign', function () {

            let [a, [b]]=[1, [2, 4], 3];

            expect(a).toBe(1);
            expect(b).toBe(2);
        });


        it('skip', function () {
            let [a, , b]=[1, 2, 3];

            expect(a).toBe(1);
            expect(b).toBe(3);
        });


        it('tail', function () {
            let [a, , ...b]=[1, 2, 3];

            expect(a).toBe(1);
            expect(b).toEqual([3]);
        });


        it('no matching', function () {
            let [a, c, ...b]=[1];

            expect(a).toBe(1);
            expect(c).toBeUndefined();
            expect(b).toEqual([]);
        });


        it('defaults', function () {
            let [a = 1, b = 2, c = 3]=[, undefined, null];

            expect(a).toBe(1);
            expect(b).toBe(2);
            expect(c).toBe(null);
        });


        it('default expression', function () {
            let initValue = () => 1;
            let error = () => {
                throw 'failed'
            };

            let [a = initValue(), b = error()]=[, 2];

            expect(a).toBe(1);
            expect(b).toBe(2);
        });


        it('default variable', function () {
            let a = 1;
            let [b = a]=[];

            expect(b).toBe(1);
        });

        it('default ref destructing variables', function () {
            let [a = 1, b = a]=[2];

            expect(a).toBe(2);
            expect(b).toBe(2);
        });
    });


    describe('iterator', function () {
        it('assign one by one', function () {
            function* fibs() {
                let a = 1;
                let b = 1;
                while (true) {
                    yield a;
                    [a, b] = [b, a + b];
                }
            }


            let [a, b, c]=fibs();

            expect([a, b, c]).toEqual([1, 1, 2]);
        });
    });


    describe('object', function () {

        it('assign', function () {
            let {fuzz, foo, buzz}={foo: 'bar', fuzz: 'buzz'};

            expect(foo).toEqual('bar');
            expect(fuzz).toEqual('buzz');
            expect(buzz).toBeUndefined();
        });


        it('mapping', function () {
            let {foo:bar}={foo: 'bar'};

            expect(bar).toEqual('bar');
        });


        it('default', function () {
            let {foo = 'bar'}={};

            expect(foo).toEqual('bar');
        });


        it('nested assign', function () {
            let {value:{foo, fuzz}, value}={value: {foo: 'bar', fuzz: 'buzz'}};

            expect(foo).toEqual('bar');
            expect(fuzz).toEqual('buzz');
            expect(value.foo).toEqual('bar');
        });


        it('assign nested', function () {
            let o = {};

            ({foo: o.bar} = {foo: 'bar'});

            expect(o.bar).toEqual('bar');
        });

        it('missing property', function () {
            let {fuzz}={};

            expect(fuzz).toBeUndefined();
            expect(() => {
                let {foo:{bar}}={};
            }).toThrowError(TypeError);
        });
    });


    describe('string', function () {

        it('assign', function () {
            let [a, b]='one';

            expect(a).toBe('o');
            expect(b).toBe('n');
        });
    });


    describe('function', function () {

        it('array parameter', function () {
            let sum = ([a, b]) => a + b;

            expect(sum([1, 2])).toBe(3);
        });


        it('array default parameter', function () {
            let sum = ([a, b = 2]) => a + b;

            expect(sum([1])).toBe(3);
        });


        it('object parameter', function () {
            let sum = ({a, b}) => a + b;

            expect(sum({a: 1, b: 2})).toBe(3);
        });

        it('object default parameter', function () {
            let sum = ({a, b = 2}) => a + b;

            expect(sum({a: 1})).toBe(3);
        });
    });


    describe('usage', function () {

        it('swap', function () {
            let a = 1, b = 2;

            [a, b] = [b, a];

            expect(a).toBe(2);
            expect(b).toBe(1);
        });


        it('spread return value', function () {
            let fn = () => [1, 2, 3];

            let [a, b]=fn();

            expect(a).toBe(1);
            expect(b).toBe(2);
        });


        it('extract json data', function () {
            let json = {foo: 'bar', fuzz: {value: 'buzz'}}

            let {foo, fuzz:{value:fuzz}}=json;

            expect(foo).toBe('bar');
            expect(fuzz).toBe('buzz');
        });

        it('list map', function () {
            let map = new Map();
            map.set('foo', 'bar').set('fuzz', 'buzz');
            let pairs = [];

            for (let [key, value] of map)  pairs.push(`${key}+${value}`);

            expect(pairs).toEqual(['foo+bar', 'fuzz+buzz']);
        });
    });
});