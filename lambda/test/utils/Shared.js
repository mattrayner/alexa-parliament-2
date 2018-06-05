'use strict';
exports.__esModule = true;
var configuration_1 = require("../../src/configuration");
var Shared = /** @class */ (function () {
    function Shared() {
    }
    Shared.prototype.user_id = function () {
        return 'amzn1.ask.account.123';
    };
    Shared.prototype.test_configuration = function () {
        var test_config = new configuration_1.Configuration();
        test_config.debug = false;
        test_config.useLocalDB = true;
        return test_config;
    };
    return Shared;
}());
exports.shared = new Shared();
