"use strict";
exports.__esModule = true;
require("mocha");
var chai_1 = require("chai");
describe('Logger', function () {
    var original_node_env;
    beforeEach(function () {
        original_node_env = process.env.NODE_ENV;
        delete require.cache[require.resolve('../../src/utils/logger')];
    });
    afterEach(function () {
        process.env.NODE_ENV = original_node_env;
    });
    context('when in test mode', function () {
        beforeEach(function () {
            process.env.NODE_ENV = 'test';
        });
        it('sets logger level to error', function () {
            chai_1.expect(require('../../src/utils/logger').winston.level).to.eq('error');
        });
    });
    context('when not in test mode', function () {
        it('sets logger level to error', function () {
            chai_1.expect(require('../../src/utils/logger').winston.level).to.eq('error');
        });
    });
});
