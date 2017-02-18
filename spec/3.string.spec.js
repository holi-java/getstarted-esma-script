describe('string', function () {
    const UCHAR = '𠮷';

    describe('unicode', function () {

        it('hex', function () {
            expect('\u0061').toBe('a');
            expect('\u{0061}').toBe('a');
        });

        it('hex support double bytes', function () {

            expect('\uD842\uDFB7').toBe(UCHAR);
            expect('\u20BB7').not.toBe(UCHAR);
            expect('\u{20BB7}').toBe(UCHAR);
        });
    });


    describe('length', function () {

        it('ascii', function () {
            expect('a'.length).toBe(1);
        });


        it('unicode', function () {
            expect(UCHAR.length).toBe(2);
        });
    });


    describe('code points', function () {
        it('get', function () {
            let [a, b]=[UCHAR.codePointAt(0), UCHAR.codePointAt(1)];

            expect(a).toBe(0x20BB7);
            expect(b).toBe(0xDFB7);
        });


        it('iterator', function () {
            let points = [];

            for (let c of UCHAR)points.push(c.codePointAt(0));

            expect(points).toEqual([0x20BB7]);
        });
    });


    it('from code points', function () {
        expect(String.fromCharCode(0x20BB7)).not.toEqual(UCHAR);
        expect(String.fromCodePoint(0x20BB7)).toEqual(UCHAR);
    });


    describe('methods', function () {

        it('*', function () {
            let a = 'a'.repeat(2);

            expect(a).toBe('aa');
        });
    });


    describe('templates', function () {

        it('interpret variable', function () {
            let foo = 'bar';
            let value = `foo+${foo}`;

            expect(value).toBe('foo+bar');
        });


        it('multi line', function () {
            let s = `a
                     b`;

            expect(s.replace(/ |\t/g, '')).toBe('a\nb');
        });


        it('escape', function () {
            let s = `\``;

            expect(s).toBe('`');
        });


        it('interpret function', function () {
            let fn = () => 'bar';

            let foo = `${fn()}`;

            expect(foo).toBe('bar');
        });


        it('missing variable', function () {
            expect(() => {
                let foo = `${missing}`;
            }).toThrowError(ReferenceError);
        });


        it('nested', function () {
            let foo = 'bar';

            let value = `foo${`+${foo}`}`;

            expect(value).toBe('foo+bar');
        });


        it('tagged template', function () {
            function tag(s, ...args) {
                return [s, ...args];
            }

            let [a, b] = [2, 3];

            expect(tag`a`).toEqual([['a']]);
            expect(tag`a${a + b}b${a * b}`).toEqual([['a', 'b', ''], 5, 6]);
            expect(tag(`a${a + b}b${a * b}`)).toEqual(['a5b6']);
            expect(tag`a${a + b}b${a * b}c`).toEqual([['a', 'b', 'c'], 5, 6]);
        });
    });


});