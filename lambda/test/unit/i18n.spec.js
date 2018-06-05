'use strict';
exports.__esModule = true;
require("mocha");
var chai_1 = require("chai");
var LaunchRequestBuilder_1 = require("../utils/LaunchRequestBuilder");
var I18N_1 = require("../../src/utils/I18N");
describe('i18n', function () {
    var request_fr_FR = new LaunchRequestBuilder_1.LaunchRequestBuilder()
        .withLocale('fr-FR')
        .withRequestId('amzn1.echo-api.request.123')
        .withTimestamp('2017-03-04T19:02:37Z')
        .build();
    var request_en_GB = new LaunchRequestBuilder_1.LaunchRequestBuilder()
        .withLocale('en-GB')
        .withRequestId('amzn1.echo-api.request.123')
        .withTimestamp('2017-03-04T19:02:37Z')
        .build();
    it('gives an english string back', function () {
        var s = I18N_1.i18n.S(request_en_GB, "TEST");
        chai_1.expect(s).to.equal("test english");
    });
    it('gives an english string back, with string parameters', function () {
        var s = I18N_1.i18n.S(request_en_GB, "TEST_PARAMS", "param1", "param2");
        chai_1.expect(s).to.equal("test with parameters param1 and param2");
    });
    it('gives an english string back, with mixed parameters', function () {
        var s = I18N_1.i18n.S(request_en_GB, "TEST_PARAMS", "param1", 2);
        chai_1.expect(s).to.equal("test with parameters param1 and 2");
    });
    it('gives a french string back', function () {
        var s = I18N_1.i18n.S(request_fr_FR, "TEST");
        chai_1.expect(s).to.equal("test français");
    });
    it('gives an french string back, with string parameters', function () {
        var s = I18N_1.i18n.S(request_fr_FR, "TEST_PARAMS", "param1", "param2");
        chai_1.expect(s).to.equal("test avec paramètres param1 et param2");
    });
    it('gives an french string back, with mixed parameters', function () {
        var s = I18N_1.i18n.S(request_fr_FR, "TEST_PARAMS", "param1", 2);
        chai_1.expect(s).to.equal("test avec paramètres param1 et 2");
    });
});
