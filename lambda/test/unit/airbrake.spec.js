"use strict";
exports.__esModule = true;
require("mocha");
var chai_1 = require("chai");
var RealClient = require("airbrake-js");
describe('Airbrake', function () {
    var original_node_env, original_airbrake_project_id, original_airbrake_project_key;
    beforeEach(function () {
        original_node_env = process.env.NODE_ENV;
        original_airbrake_project_id = process.env.AIRBRAKE_PROJECT_ID;
        original_airbrake_project_key = process.env.AIRBRAKE_PROJECT_KEY;
        delete require.cache[require.resolve('../../src/utils/airbrake')];
    });
    afterEach(function () {
        process.env.NODE_ENV = original_node_env;
        process.env.AIRBRAKE_PROJECT_ID = original_airbrake_project_id;
        process.env.AIRBRAKE_PROJECT_KEY = original_airbrake_project_key;
    });
    context('when in test mode', function () {
        beforeEach(function () {
            process.env.NODE_ENV = 'test';
            process.env.AIRBRAKE_PROJECT_ID = 'foo';
            process.env.AIRBRAKE_PROJECT_KEY = 'bar';
        });
        it('exports fake class', function () {
            chai_1.expect(require('../../src/utils/airbrake').Airbrake.fake).to.eq(true);
        });
    });
    context('when missing airbrake variables', function () {
        context('id', function () {
            beforeEach(function () {
                process.env.NODE_ENV = 'production';
                delete process.env.AIRBRAKE_PROJECT_ID;
                process.env.AIRBRAKE_PROJECT_KEY = 'bar';
            });
            it('exports fake class', function () {
                chai_1.expect(require('../../src/utils/airbrake').Airbrake.fake).to.eq(true);
            });
        });
        context('key', function () {
            beforeEach(function () {
                process.env.NODE_ENV = 'production';
                process.env.AIRBRAKE_PROJECT_ID = 'foo';
                delete process.env.AIRBRAKE_PROJECT_KEY;
            });
            it('exports fake class', function () {
                chai_1.expect(require('../../src/utils/airbrake').Airbrake.fake).to.eq(true);
            });
        });
        context('both', function () {
            beforeEach(function () {
                process.env.NODE_ENV = 'production';
                delete process.env.AIRBRAKE_PROJECT_ID;
                delete process.env.AIRBRAKE_PROJECT_KEY;
            });
            it('exports fake class', function () {
                chai_1.expect(require('../../src/utils/airbrake').Airbrake.fake).to.eq(true);
            });
        });
    });
    context('with all information set', function () {
        beforeEach(function () {
            process.env.NODE_ENV = 'production';
            process.env.AIRBRAKE_PROJECT_ID = 'foo';
            process.env.AIRBRAKE_PROJECT_KEY = 'bar';
            delete require.cache[require.resolve('../../src/utils/airbrake')];
        });
        it('exports real class', function () {
            chai_1.expect(require('../../src/utils/airbrake').Airbrake).to.be.instanceOf(RealClient);
        });
    });
});
