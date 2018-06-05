'use strict';
exports.__esModule = true;
require("mocha");
var index_1 = require("../../src/index");
var Assertion_1 = require("../utils/Assertion");
var Shared_1 = require("../utils/Shared");
var nock = require("nock");
var no_permission = require("../fixtures/requests/find_my_mp_intent/no_permission.json"); // tslint:disable-line
var permission = require("../fixtures/requests/find_my_mp_intent/permission.json"); // tslint:disable-line
var no_permission_request = no_permission;
var permission_request = permission;
var assert = new Assertion_1.Assertion();
var skill_response;
describe('Parliament : FindMyMPIntent', function () {
    var _this = this;
    beforeEach(function () {
        _this.timeout(5000);
    });
    afterEach(function () {
        skill_response = null;
    });
    context('without permission', function () {
        beforeEach(function () {
            return new Promise(function (resolve, reject) {
                index_1.handler(no_permission_request, null, function (error, responseEnvelope) {
                    skill_response = responseEnvelope;
                    resolve();
                }, Shared_1.shared.test_configuration());
            });
        });
        it('it responds with valid response structure ', function () {
            assert.correctResponseStructure(skill_response);
        });
        it('it responses with output speech ', function () {
            assert.correctOutputSpeechStructure(skill_response);
        });
        it('it responds with the expected output speech', function () {
            assert.correctOutputSpeechIncludesText(skill_response, "Please enable Location permissions in the Amazon Alexa app.");
        });
        it('it responds without reprompt speech', function () {
            assert.withoutRepromptSpeechStructure(skill_response);
        });
        it('it closes the session ', function () {
            assert.correctSessionStatus(skill_response, true);
        });
        it('includes a permission card', function () {
            assert.includesAddressPermissionCard(skill_response);
        });
    });
    context('with permission', function () {
        context('Amazon API success', function () {
            beforeEach(function () {
                nock('https://api.amazonalexa.com/v1/devices/string-identifying-the-device/settings/address/countryAndPostalCode')
                    .get('').reply(200, '{"countryCode" : "GB", "postalCode" : "SW1A 0AA"}', {
                    'X-Amzn-RequestId': 'xxxx-xxx-xxx',
                    'content-type': 'application/json'
                });
            });
            context('with full postcode information', function () {
                beforeEach(function () {
                    nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
                        .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/full_response.nt', {
                        'Alexa-Parliament': 'true',
                        'Accept': 'application/ntriple'
                    });
                    return new Promise(function (resolve, reject) {
                        index_1.handler(permission_request, null, function (error, responseEnvelope) {
                            skill_response = responseEnvelope;
                            resolve();
                        }, Shared_1.shared.test_configuration());
                    });
                });
                it('it responds with valid response structure ', function () {
                    assert.correctResponseStructure(skill_response);
                });
                it('it responses with output speech ', function () {
                    assert.correctOutputSpeechStructure(skill_response);
                });
                it('it responds with the expected output speech', function () {
                    assert.correctOutputSpeechIncludesText(skill_response, "The MP for Cities of London and Westminster, is Mark Field. Your MP is a member of the Conservative party, and was elected on <say-as interpret-as=\"date\" format=\"dmy\">08-06-2017</say-as>.");
                });
                it('it responds without reprompt speech', function () {
                    assert.withoutRepromptSpeechStructure(skill_response);
                });
                it('it closes the session ', function () {
                    assert.correctSessionStatus(skill_response, true);
                });
            });
            context('with partial postcode information', function () {
                context('no constituency', function () {
                    beforeEach(function () {
                        nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
                            .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/no_constituency.nt', {
                            'Alexa-Parliament': 'true',
                            'Accept': 'application/ntriple'
                        });
                        return new Promise(function (resolve, reject) {
                            index_1.handler(permission_request, null, function (error, responseEnvelope) {
                                skill_response = responseEnvelope;
                                resolve();
                            }, Shared_1.shared.test_configuration());
                        });
                    });
                    it('it responds with valid response structure ', function () {
                        assert.correctResponseStructure(skill_response);
                    });
                    it('it responses with output speech ', function () {
                        assert.correctOutputSpeechStructure(skill_response);
                    });
                    it('it responds with the expected output speech', function () {
                        assert.correctOutputSpeechIncludesText(skill_response, "The MP for SW1A 0AA, is Mark Field. Your MP is a member of the Conservative party, and was elected on <say-as interpret-as=\"date\" format=\"dmy\">08-06-2017</say-as>.");
                    });
                    it('it responds without reprompt speech', function () {
                        assert.withoutRepromptSpeechStructure(skill_response);
                    });
                    it('it closes the session ', function () {
                        assert.correctSessionStatus(skill_response, true);
                    });
                });
                context('no MP', function () {
                    beforeEach(function () {
                        nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
                            .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/no_mp.nt', {
                            'Alexa-Parliament': 'true',
                            'Accept': 'application/ntriple'
                        });
                        return new Promise(function (resolve, reject) {
                            index_1.handler(permission_request, null, function (error, responseEnvelope) {
                                skill_response = responseEnvelope;
                                resolve();
                            }, Shared_1.shared.test_configuration());
                        });
                    });
                    it('it responds with valid response structure ', function () {
                        assert.correctResponseStructure(skill_response);
                    });
                    it('it responses with output speech ', function () {
                        assert.correctOutputSpeechStructure(skill_response);
                    });
                    it('it responds with the expected output speech', function () {
                        assert.correctOutputSpeechIncludesText(skill_response, "I couldn't find an MP for Cities of London and Westminster.");
                    });
                    it('it responds without reprompt speech', function () {
                        assert.withoutRepromptSpeechStructure(skill_response);
                    });
                    it('it closes the session ', function () {
                        assert.correctSessionStatus(skill_response, true);
                    });
                });
                context('no party', function () {
                    beforeEach(function () {
                        nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
                            .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/no_party.nt', {
                            'Alexa-Parliament': 'true',
                            'Accept': 'application/ntriple'
                        });
                        return new Promise(function (resolve, reject) {
                            index_1.handler(permission_request, null, function (error, responseEnvelope) {
                                skill_response = responseEnvelope;
                                resolve();
                            }, Shared_1.shared.test_configuration());
                        });
                    });
                    it('it responds with valid response structure ', function () {
                        assert.correctResponseStructure(skill_response);
                    });
                    it('it responses with output speech ', function () {
                        assert.correctOutputSpeechStructure(skill_response);
                    });
                    it('it responds with the expected output speech', function () {
                        assert.correctOutputSpeechIncludesText(skill_response, "The MP for Cities of London and Westminster, is Mark Field. Your MP was elected on <say-as interpret-as=\"date\" format=\"dmy\">08-06-2017</say-as>.");
                    });
                    it('it responds without reprompt speech', function () {
                        assert.withoutRepromptSpeechStructure(skill_response);
                    });
                    it('it closes the session ', function () {
                        assert.correctSessionStatus(skill_response, true);
                    });
                });
                context('no incumbency', function () {
                    beforeEach(function () {
                        nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
                            .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/no_incumbency.nt', {
                            'Alexa-Parliament': 'true',
                            'Accept': 'application/ntriple'
                        });
                        return new Promise(function (resolve, reject) {
                            index_1.handler(permission_request, null, function (error, responseEnvelope) {
                                skill_response = responseEnvelope;
                                resolve();
                            }, Shared_1.shared.test_configuration());
                        });
                    });
                    it('it responds with valid response structure ', function () {
                        assert.correctResponseStructure(skill_response);
                    });
                    it('it responses with output speech ', function () {
                        assert.correctOutputSpeechStructure(skill_response);
                    });
                    it('it responds with the expected output speech', function () {
                        assert.correctOutputSpeechIncludesText(skill_response, "The MP for Cities of London and Westminster, is Mark Field. Your MP is a member of the Conservative party.");
                    });
                    it('it responds without reprompt speech', function () {
                        assert.withoutRepromptSpeechStructure(skill_response);
                    });
                    it('it closes the session ', function () {
                        assert.correctSessionStatus(skill_response, true);
                    });
                });
                context('no party or incumbency', function () {
                    beforeEach(function () {
                        nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
                            .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/no_party_or_incumbency.nt', {
                            'Alexa-Parliament': 'true',
                            'Accept': 'application/ntriple'
                        });
                        return new Promise(function (resolve, reject) {
                            index_1.handler(permission_request, null, function (error, responseEnvelope) {
                                skill_response = responseEnvelope;
                                resolve();
                            }, Shared_1.shared.test_configuration());
                        });
                    });
                    it('it responds with valid response structure ', function () {
                        assert.correctResponseStructure(skill_response);
                    });
                    it('it responses with output speech ', function () {
                        assert.correctOutputSpeechStructure(skill_response);
                    });
                    it('it responds with the expected output speech', function () {
                        assert.correctOutputSpeechIncludesText(skill_response, "The MP for Cities of London and Westminster, is Mark Field.");
                    });
                    it('it responds without reprompt speech', function () {
                        assert.withoutRepromptSpeechStructure(skill_response);
                    });
                    it('it closes the session ', function () {
                        assert.correctSessionStatus(skill_response, true);
                    });
                });
                context('no information', function () {
                    beforeEach(function () {
                        nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
                            .get('').reply(200, '', { 'Alexa-Parliament': 'true', 'Accept': 'application/ntriple' });
                        return new Promise(function (resolve, reject) {
                            index_1.handler(permission_request, null, function (error, responseEnvelope) {
                                skill_response = responseEnvelope;
                                resolve();
                            }, Shared_1.shared.test_configuration());
                        });
                    });
                    it('it responds with valid response structure ', function () {
                        assert.correctResponseStructure(skill_response);
                    });
                    it('it responses with output speech ', function () {
                        assert.correctOutputSpeechStructure(skill_response);
                    });
                    it('it responds with the expected output speech', function () {
                        assert.correctOutputSpeechIncludesText(skill_response, "I couldn't find an MP for SW1A 0AA.");
                    });
                    it('it responds without reprompt speech', function () {
                        assert.withoutRepromptSpeechStructure(skill_response);
                    });
                    it('it closes the session ', function () {
                        assert.correctSessionStatus(skill_response, true);
                    });
                });
            });
            context('parliament responds with 404', function () {
                beforeEach(function () {
                    nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
                        .get('').reply(404, 'Not Found', { 'Alexa-Parliament': 'true', 'Accept': 'application/ntriple' });
                    return new Promise(function (resolve, reject) {
                        index_1.handler(permission_request, null, function (error, responseEnvelope) {
                            skill_response = responseEnvelope;
                            resolve();
                        }, Shared_1.shared.test_configuration());
                    });
                });
                it('it responds with valid response structure ', function () {
                    assert.correctResponseStructure(skill_response);
                });
                it('it responses with output speech ', function () {
                    assert.correctOutputSpeechStructure(skill_response);
                });
                it('it responds with the expected output speech', function () {
                    assert.correctOutputSpeechIncludesText(skill_response, "I was unable to find any information for SW1A 0AA.");
                });
                it('it responds without reprompt speech', function () {
                    assert.withoutRepromptSpeechStructure(skill_response);
                });
                it('it closes the session ', function () {
                    assert.correctSessionStatus(skill_response, true);
                });
            });
        });
        context('Amazon address API error', function () {
            beforeEach(function () {
                nock('https://api.amazonalexa.com/v1/devices/string-identifying-the-device/settings/address/countryAndPostalCode')
                    .get('').reply(403, '');
                return new Promise(function (resolve, reject) {
                    index_1.handler(permission_request, null, function (error, responseEnvelope) {
                        skill_response = responseEnvelope;
                        resolve();
                    }, Shared_1.shared.test_configuration());
                });
            });
            it('speaks the expected text', function () {
                assert.correctOutputSpeechIncludesText(skill_response, "There was a problem getting your postcode from Amazon. Please try again later.");
            });
        });
    });
});
