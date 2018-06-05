'use strict';
exports.__esModule = true;
require("mocha");
var chai_1 = require("chai");
var strings_1 = require("../../src/utils/strings");
describe('strings', function () {
    it('contains all the expected locales', function () {
        chai_1.expect(Object.keys(strings_1.strings)).to.deep.eq(['en-GB', 'en-US', 'en-IN', 'en-CA', 'en-AU', 'fr-FR']);
    });
    it('shares all the same keys across all of the locales', function () {
        var keys = Object.keys(strings_1.strings);
        var expectedStringKeys = Object.keys(strings_1.strings[keys[0]]);
        for (var _i = 0, _a = Object.keys(strings_1.strings); _i < _a.length; _i++) {
            var key = _a[_i];
            var localeSpecificStringKeys = Object.keys(strings_1.strings[key]);
            chai_1.expect(localeSpecificStringKeys).to.deep.eq(expectedStringKeys, "Expected " + key + " to have the same translations as " + keys[0]);
        }
    });
});
