'use strict';
exports.__esModule = true;
require("mocha");
var index_1 = require("../../src/index");
var Assertion_1 = require("../utils/Assertion");
var DDBController_1 = require("../utils/DDBController");
var Shared_1 = require("../utils/Shared");
var r = require("../fixtures/requests/launch_request.json"); // tslint:disable-line
var request = r;
var assert = new Assertion_1.Assertion();
var skill_response;
describe('Parliament : LaunchRequest', function () {
    var _this = this;
    beforeEach(function () {
        _this.timeout(5000);
    });
    afterEach(function () {
        skill_response = null;
    });
    context('as a first-time user', function () {
        beforeEach(function () {
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
        it('it responds with valid response structure ', function () {
            assert.correctResponseStructure(skill_response);
        });
        it('it responses with output speech ', function () {
            assert.correctOutputSpeechStructure(skill_response);
        });
        it('it responds with the expected output speech', function () {
            assert.correctOutputSpeechIncludesText(skill_response, 'Welcome to Parliament');
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
    context('as a return user', function () {
        beforeEach(function () {
            return new Promise(function (resolve, reject) {
                // prepare the database
                DDBController_1.ddb.initialiseDDB(Shared_1.shared.user_id()).then(function (data) {
                    index_1.handler(request, null, function (error, responseEnvelope) {
                        skill_response = responseEnvelope;
                        resolve();
                    }, Shared_1.shared.test_configuration());
                });
            });
        });
        it('it responds with the expected output speech', function () {
            assert.correctOutputSpeechIncludesText(skill_response, "Welcome back to Parliament. Try saying what's on, who's my MP, or help.");
        });
        it('it responds with the expected reprompt speech', function () {
            assert.correctRepromptSpeechIncludesText(skill_response, "Try saying, 'what's on', or, who's my MP.");
        });
    });
});
