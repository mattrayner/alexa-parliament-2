'use strict';
exports.__esModule = true;
var chai_1 = require("chai");
var Assertion = /** @class */ (function () {
    function Assertion() {
    }
    Assertion.prototype.correctResponseStructure = function (response) {
        chai_1.expect(response).to.have.property("version");
        chai_1.expect(response.version).to.be.equal("1.0");
        chai_1.expect(response).to.have.property("response");
    };
    Assertion.prototype.correctOutputSpeechStructure = function (response) {
        chai_1.expect(response).to.have.property("response");
        var r = response.response;
        chai_1.expect(r).to.have.property("outputSpeech");
        chai_1.expect(r.outputSpeech).to.have.property("type");
        chai_1.expect(r.outputSpeech.type).to.equal('SSML');
        chai_1.expect(r.outputSpeech).to.have.property("ssml");
        var os = r.outputSpeech;
        chai_1.expect(os.ssml).to.match(/^<speak>/, 'Message begins with speak tag'); // startWith('<speak>');
        chai_1.expect(os.ssml).to.match(/<\/speak>$/, 'Message ends with speak tag'); //.endWith('</speak>');
    };
    Assertion.prototype.correctOutputSpeechIncludesText = function (response, text) {
        var os = response.response.outputSpeech;
        chai_1.expect(os.ssml).to.contains(text, 'SSML contains text');
    };
    Assertion.prototype.correctOutputSpeechDoesNotIncludeText = function (response, text) {
        var os = response.response.outputSpeech;
        chai_1.expect(os.ssml).to.not.contain(text, 'SSML does not contain text');
    };
    Assertion.prototype.correctSessionStatus = function (response, shouldEndSession) {
        var r = response.response;
        chai_1.expect(r).to.have.property('shouldEndSession');
        chai_1.expect(r.shouldEndSession).to.equal(shouldEndSession, "shouldEndSession = " + shouldEndSession);
    };
    Assertion.prototype.includesStandardCard = function (response) {
        var r = response.response;
        chai_1.expect(r).to.have.property('card');
        chai_1.expect(r.card.type).to.equal('Standard');
        chai_1.expect(r.card.text).to.not.be.equal('');
        chai_1.expect(r.card.title).to.not.be.equal('');
    };
    Assertion.prototype.includesAddressPermissionCard = function (response) {
        var r = response.response;
        chai_1.expect(r).to.have.property('card');
        chai_1.expect(r.card.type).to.equal('AskForPermissionsConsent', 'Has a permission card');
        chai_1.expect(r.card.permissions.length).to.equal(1, 'Has exactly one permission');
        chai_1.expect(r.card.permissions[0]).to.equal('read::alexa:device:all:address:country_and_postal_code', 'Has the expected card permission');
    };
    Assertion.prototype.correctRepromptSpeechStructure = function (response) {
        chai_1.expect(response).to.have.property("response");
        var r = response.response;
        chai_1.expect(r).to.have.property("reprompt");
        chai_1.expect(r.reprompt).to.have.property("outputSpeech");
        chai_1.expect(r.reprompt.outputSpeech).to.have.property("type");
        chai_1.expect(r.reprompt.outputSpeech.type).to.equal('SSML');
        chai_1.expect(r.reprompt.outputSpeech).to.have.property("ssml");
        var os = r.reprompt.outputSpeech;
        chai_1.expect(os.ssml).to.match(/^<speak>/); // startWith('<speak>');
        chai_1.expect(os.ssml).to.match(/<\/speak>$/); //.endWith('</speak>');
    };
    Assertion.prototype.withoutRepromptSpeechStructure = function (response) {
        chai_1.expect(response).to.have.property("response");
        var r = response.response;
        chai_1.expect(r).not.to.have.property("reprompt");
    };
    Assertion.prototype.correctRepromptSpeechIncludesText = function (response, text) {
        var os = response.response.reprompt.outputSpeech;
        chai_1.expect(os.ssml).to.contains(text);
    };
    Assertion.prototype.repromptSpeechNotIncluded = function (response) {
        chai_1.expect(response).to.have.property("response");
        var r = response.response;
        chai_1.expect(r).to.not.have.property("reprompt");
    };
    return Assertion;
}());
exports.Assertion = Assertion;
