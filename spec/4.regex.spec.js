describe('regex', function () {

    describe('creation', function () {

        it('constructor', function () {
            let regex = new RegExp('abc', 'i');

            expect(regex.source).toBe('abc');
            expect(regex.flags).toBe('i');
        });


        it('literal', function () {
            let regex = /abc/i;

            expect(regex.source).toBe('abc');
            expect(regex.flags).toBe('i');
        });


        it('constructor with literal', function () {
            let regex = new RegExp(/abc/i);

            expect(regex).toEqual(/abc/i);
        });


        it('flags override', function () {
            let regex = new RegExp(/abc/i, 'u');

            expect(regex.flags).toEqual('u');
        });
    });

    const UCHAR = '𠮷';

    describe('u', function () {

        it('ascii', function () {
            expect(/a/.test('a')).toBe(true);
            expect(/a/u.test('a')).toBe(true);
        });


        it('unicode', function () {
            let unicode = '\uD842\uDFB7';


            expect(unicode).toBe(UCHAR);

            expect(/\uD842/.test(unicode)).toBe(true);
            expect(/\uD842/u.test(unicode)).toBe(false);
        });


        it('.', function () {
            expect(/^.$/.test(UCHAR)).toBe(false);
            expect(/^.$/u.test(UCHAR)).toBe(true);
        });


        it('\\u{}', function () {
            expect(/\u{61}/.test('a')).toBe(false);
            expect(/\u{61}/u.test('a')).toBe(true);
        });


        it('same graph', function () {
            expect(/K/i.test('\u212A')).toBe(false);
            expect(/K/i.test('\u004B')).toBe(true);

            expect(/K/iu.test('\u212A')).toBe(true);
            expect(/K/u.test('\u212A')).toBe(false);
            expect(/K/u.test('\u004B')).toBe(true);
        });
    });


    it('g', function () {
        let a = 'aaa_aa';
        let regex = /a+/g;

        expect(...regex.exec(a)).toEqual('aaa');
        expect(...regex.exec(a)).toEqual('aa');
        expect(regex.exec(a)).toBe(null);
    });


    describe('y', function () {

        it('flags', function () {
            expect(/a/y.flags).toBe('y');
        });


        it('matching', function () {
            let a = 'aaa_aa';
            let r1 = /a+/y;
            let r2 = /a+_?/y;

            expect(...r1.exec(a)).toEqual('aaa');
            expect(r1.exec(a)).toEqual(null);

            expect(...r2.exec(a)).toEqual('aaa_');
            expect(...r2.exec(a)).toEqual('aa');
        });


        it('sticky', function () {
            expect(/a/.sticky).toBe(false);
            expect(/a/y.sticky).toBe(true);
        });
    });


});