'use strict';
exports.__esModule = true;
require("mocha");
var index_1 = require("../../src/index");
var Assertion_1 = require("../utils/Assertion");
var DDBController_1 = require("../utils/DDBController");
var Shared_1 = require("../utils/Shared");
var r = require("../fixtures/requests/unhandled_intent.json"); // tslint:disable-line
var request = r;
var assert = new Assertion_1.Assertion();
var skill_response;
describe('Parliament : UnhandledIntent', function () {
    var _this = this;
    beforeEach(function () {
        _this.timeout(5000);
        return new Promise(function (resolve, reject) {
            // prepare the database
            DDBController_1.ddb.deleteFromDDB(Shared_1.shared.user_id()).then(function (data) {
                index_1.handler(request, null, function (error, responseEnvelope) {
                    skill_response = responseEnvelope;
                    resolve();
                }, Shared_1.shared.test_configuration());
            });
        });
    });
    afterEach(function () {
        skill_response = null;
    });
    it('it responds with valid response structure ', function () {
        assert.correctResponseStructure(skill_response);
    });
    it('it responses with output speech ', function () {
        assert.correctOutputSpeechStructure(skill_response);
    });
    it('it responds with the expected output speech', function () {
        assert.correctOutputSpeechIncludesText(skill_response, 'Unhandled stuff');
    });
    it('it responds with reprompt speech', function () {
        assert.correctRepromptSpeechStructure(skill_response);
    });
    it('it responds with the expected reprompt speech', function () {
        assert.correctRepromptSpeechIncludesText(skill_response, 'Unhandled reprompt');
    });
    it('it does not close the session ', function () {
        assert.correctSessionStatus(skill_response, false);
    });
});
