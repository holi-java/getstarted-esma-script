let mail = Mary.mail;
import * as Mary from './stub/mary';
import Bob, {username} from './stub/bob';
import {username as bob} from './stub/bob';
import {id as guid1} from './stub/guid';
import {id as guid2} from './stub/guid';
import _variable from './stub/export-default-variable';
import _function from './stub/export-default-function';

describe('module', function () {

    describe('export', function () {
        it('normal', function () {
            let user = require('./stub/mary');

            expect(user.name).toEqual('mary');
            expect(user.toy()).toEqual('doll');
            expect(user.hasOwnProperty('age')).toBe(false);
        });

        it('... as', function () {
            let user = require('./stub/bob');

            expect(user.name).toBeUndefined();
            expect(user.username).toEqual('bob');
        });

        it('value binding', function () {
            let module = require('./stub/module-value-binding.js');
            expect(module.foo).toEqual('bar');

            module.change();

            expect(module.foo).toEqual('baz');
        });

        it('default variable', function () {
            expect(_variable).toEqual('##variable##');
            expect(_variable.other).toBeUndefined();
        });

        it('default function', function () {
            expect(_function()).toEqual('##function##');
            expect(_function.other).toBeUndefined();
        });
    });
    describe('import', function () {
        it('all', function () {
            expect(Object.keys(Mary)).toEqual(['name', 'mail', 'toy']);
        });

        it('some interfaces', function () {
            expect(username).toEqual('bob');
        });

        it('alias interface', function () {
            expect(bob).toEqual('bob');
        });

        it('execute on the top', function () {
            expect(mail).toEqual('mary@example.com');
        });

        it('once', function () {
            expect(guid1).toEqual(guid2);
        });
    });
});