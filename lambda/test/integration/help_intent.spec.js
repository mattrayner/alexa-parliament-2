'use strict';
exports.__esModule = true;
require("mocha");
var index_1 = require("../../src/index");
var Assertion_1 = require("../utils/Assertion");
var Shared_1 = require("../utils/Shared");
var DDBController_1 = require("../utils/DDBController");
var r = require("../fixtures/requests/help_intent.json"); // tslint:disable-line
var request = r;
var assert = new Assertion_1.Assertion();
var skill_response;
describe('Parliament : HelpIntent', function () {
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
        assert.correctOutputSpeechIncludesText(skill_response, "Parliament for Alexa, can tell you what\'s on today at the Houses of Parliament, or tell you who your MP is. Try saying, \'what\'s on\', to hear about the events at both houses. Alternatively, say, \'whats on at the commons\', or, \'whats on in the lords\', to hear about the events at a specific house. To find out who your MP is, try saying, who\'s my MP.");
    });
    it('it responds with reprompt speech', function () {
        assert.correctRepromptSpeechStructure(skill_response);
    });
    it('it responds with the expected reprompt speech', function () {
        assert.correctRepromptSpeechIncludesText(skill_response, "Try saying, 'what's on', or, who's my MP.");
    });
    it('it does not close the session ', function () {
        assert.correctSessionStatus(skill_response, false);
    });
});
