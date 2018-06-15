'use strict';

import 'mocha';

import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';

import { handler as skill } from '../../src/index';

import { Assertion } from '../utils/Assertion';

import { shared } from '../utils/Shared'

import * as nock from 'nock';

const no_permission = require('../fixtures/requests/find_my_mp_intent/no_permission.json'); // tslint:disable-line
const permission = require('../fixtures/requests/find_my_mp_intent/permission.json'); // tslint:disable-line

const no_permission_request: RequestEnvelope = <RequestEnvelope>no_permission;
const permission_request: RequestEnvelope = <RequestEnvelope>permission;
const assert = new Assertion();
let skill_response: ResponseEnvelope;

describe('Parliament : FindMyMPIntent', function () {
  beforeEach(() => {
    this.timeout(5000);
  });

  afterEach(() => {
    skill_response = null;
  });

  context('without permission', () => {
    beforeEach(() => {
      return new Promise((resolve, reject) => {
        skill(no_permission_request, null, (error, responseEnvelope) => {
          skill_response = responseEnvelope;
          resolve();
        }, shared.test_configuration());
      });
    });

    it('it responds with valid response structure ', () => {
      assert.correctResponseStructure(skill_response);
    });

    it('it responses with output speech ', () => {
      assert.correctOutputSpeechStructure(skill_response);
    });

    it('it responds with the expected output speech', () => {
      assert.correctOutputSpeechIncludesText(skill_response, "Please enable Location permissions in the Amazon Alexa app.");
    });

    it('it responds without reprompt speech', () => {
      assert.withoutRepromptSpeechStructure(skill_response);
    });

    it('it closes the session ', () => {
      assert.correctSessionStatus(skill_response, true);
    });

    it('includes a permission card', () => {
      assert.includesAddressPermissionCard(skill_response);
    });
  });

  context('with permission', () => {
    context('Amazon API success', () => {
      beforeEach(() => {
        nock('https://api.amazonalexa.com/v1/devices/string-identifying-the-device/settings/address/countryAndPostalCode')
          .get('').reply(200, '{"countryCode" : "GB", "postalCode" : "SW1A 0AA"}', {
          'X-Amzn-RequestId': 'xxxx-xxx-xxx',
          'content-type': 'application/json'
        });
      });

      context('with full postcode information', () => {
        beforeEach(() => {
          nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
            .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/full_response.nt', {
            'Alexa-Parliament': 'true',
            'Accept': 'application/ntriple'
          });

          return new Promise((resolve, reject) => {
            skill(permission_request, null, (error, responseEnvelope) => {
              skill_response = responseEnvelope;
              resolve();
            }, shared.test_configuration());
          });
        });

        it('it responds with valid response structure ', () => {
          assert.correctResponseStructure(skill_response);
        });

        it('it responses with output speech ', () => {
          assert.correctOutputSpeechStructure(skill_response);
        });

        it('it responds with the expected output speech', () => {
          assert.correctOutputSpeechIncludesText(skill_response, "The MP for Cities of London and Westminster, is Mark Field. Your MP is a member of the Conservative party, and was elected on <say-as interpret-as=\"date\" format=\"dmy\">08-06-2017</say-as>.");
        });

        it('it responds without reprompt speech', () => {
          assert.withoutRepromptSpeechStructure(skill_response);
        });

        it('it closes the session ', () => {
          assert.correctSessionStatus(skill_response, true);
        });
      });

      context('with partial postcode information', () => {
        context('no constituency', () => {
          beforeEach(() => {
            nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
              .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/no_constituency.nt', {
              'Alexa-Parliament': 'true',
              'Accept': 'application/ntriple'
            });

            return new Promise((resolve, reject) => {
              skill(permission_request, null, (error, responseEnvelope) => {
                skill_response = responseEnvelope;
                resolve();
              }, shared.test_configuration());
            });
          });

          it('it responds with valid response structure ', () => {
            assert.correctResponseStructure(skill_response);
          });

          it('it responses with output speech ', () => {
            assert.correctOutputSpeechStructure(skill_response);
          });

          it('it responds with the expected output speech', () => {
            assert.correctOutputSpeechIncludesText(skill_response, "The MP for SW1A 0AA, is Mark Field. Your MP is a member of the Conservative party, and was elected on <say-as interpret-as=\"date\" format=\"dmy\">08-06-2017</say-as>.");
          });

          it('it responds without reprompt speech', () => {
            assert.withoutRepromptSpeechStructure(skill_response);
          });

          it('it closes the session ', () => {
            assert.correctSessionStatus(skill_response, true);
          });
        });

        context('no MP', () => {
          beforeEach(() => {
            nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
              .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/no_mp.nt', {
              'Alexa-Parliament': 'true',
              'Accept': 'application/ntriple'
            });

            return new Promise((resolve, reject) => {
              skill(permission_request, null, (error, responseEnvelope) => {
                skill_response = responseEnvelope;
                resolve();
              }, shared.test_configuration());
            });
          });

          it('it responds with valid response structure ', () => {
            assert.correctResponseStructure(skill_response);
          });

          it('it responses with output speech ', () => {
            assert.correctOutputSpeechStructure(skill_response);
          });

          it('it responds with the expected output speech', () => {
            assert.correctOutputSpeechIncludesText(skill_response, "I couldn't find an MP for Cities of London and Westminster.");
          });

          it('it responds without reprompt speech', () => {
            assert.withoutRepromptSpeechStructure(skill_response);
          });

          it('it closes the session ', () => {
            assert.correctSessionStatus(skill_response, true);
          });
        });

        context('no party', () => {
          beforeEach(() => {
            nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
              .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/no_party.nt', {
              'Alexa-Parliament': 'true',
              'Accept': 'application/ntriple'
            });

            return new Promise((resolve, reject) => {
              skill(permission_request, null, (error, responseEnvelope) => {
                skill_response = responseEnvelope;
                resolve();
              }, shared.test_configuration());
            });
          });

          it('it responds with valid response structure ', () => {
            assert.correctResponseStructure(skill_response);
          });

          it('it responses with output speech ', () => {
            assert.correctOutputSpeechStructure(skill_response);
          });

          it('it responds with the expected output speech', () => {
            assert.correctOutputSpeechIncludesText(skill_response, "The MP for Cities of London and Westminster, is Mark Field. Your MP was elected on <say-as interpret-as=\"date\" format=\"dmy\">08-06-2017</say-as>.");
          });

          it('it responds without reprompt speech', () => {
            assert.withoutRepromptSpeechStructure(skill_response);
          });

          it('it closes the session ', () => {
            assert.correctSessionStatus(skill_response, true);
          });
        });


        context('no incumbency', () => {
          beforeEach(() => {
            nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
              .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/no_incumbency.nt', {
              'Alexa-Parliament': 'true',
              'Accept': 'application/ntriple'
            });

            return new Promise((resolve, reject) => {
              skill(permission_request, null, (error, responseEnvelope) => {
                skill_response = responseEnvelope;
                resolve();
              }, shared.test_configuration());
            });
          });

          it('it responds with valid response structure ', () => {
            assert.correctResponseStructure(skill_response);
          });

          it('it responses with output speech ', () => {
            assert.correctOutputSpeechStructure(skill_response);
          });

          it('it responds with the expected output speech', () => {
            assert.correctOutputSpeechIncludesText(skill_response, "The MP for Cities of London and Westminster, is Mark Field. Your MP is a member of the Conservative party.");
          });

          it('it responds without reprompt speech', () => {
            assert.withoutRepromptSpeechStructure(skill_response);
          });

          it('it closes the session ', () => {
            assert.correctSessionStatus(skill_response, true);
          });
        });

        context('no party or incumbency', () => {
          beforeEach(() => {
            nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
              .get('').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/find_my_mp/no_party_or_incumbency.nt', {
              'Alexa-Parliament': 'true',
              'Accept': 'application/ntriple'
            });

            return new Promise((resolve, reject) => {
              skill(permission_request, null, (error, responseEnvelope) => {
                skill_response = responseEnvelope;
                resolve();
              }, shared.test_configuration());
            });
          });

          it('it responds with valid response structure ', () => {
            assert.correctResponseStructure(skill_response);
          });

          it('it responses with output speech ', () => {
            assert.correctOutputSpeechStructure(skill_response);
          });

          it('it responds with the expected output speech', () => {
            assert.correctOutputSpeechIncludesText(skill_response, "The MP for Cities of London and Westminster, is Mark Field.");
          });

          it('it responds without reprompt speech', () => {
            assert.withoutRepromptSpeechStructure(skill_response);
          });

          it('it closes the session ', () => {
            assert.correctSessionStatus(skill_response, true);
          });
        });

        context('no information', () => {
          beforeEach(() => {
            nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
              .get('').reply(200, '', { 'Alexa-Parliament': 'true', 'Accept': 'application/ntriple' });

            return new Promise((resolve, reject) => {
              skill(permission_request, null, (error, responseEnvelope) => {
                skill_response = responseEnvelope;
                resolve();
              }, shared.test_configuration());
            });
          });

          it('it responds with valid response structure ', () => {
            assert.correctResponseStructure(skill_response);
          });

          it('it responses with output speech ', () => {
            assert.correctOutputSpeechStructure(skill_response);
          });

          it('it responds with the expected output speech', () => {
            assert.correctOutputSpeechIncludesText(skill_response, "I couldn't find an MP for SW1A 0AA.");
          });

          it('it responds without reprompt speech', () => {
            assert.withoutRepromptSpeechStructure(skill_response);
          });

          it('it closes the session ', () => {
            assert.correctSessionStatus(skill_response, true);
          });
        });
      });

      context('parliament responds with 404', () => {
        beforeEach(() => {
          nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
            .get('').reply(404, 'Not Found', { 'Alexa-Parliament': 'true', 'Accept': 'application/ntriple' });

          return new Promise((resolve, reject) => {
            skill(permission_request, null, (error, responseEnvelope) => {
              skill_response = responseEnvelope;
              resolve();
            }, shared.test_configuration());
          });
        });

        it('it responds with valid response structure ', () => {
          assert.correctResponseStructure(skill_response);
        });

        it('it responses with output speech ', () => {
          assert.correctOutputSpeechStructure(skill_response);
        });

        it('it responds with the expected output speech', () => {
          assert.correctOutputSpeechIncludesText(skill_response, "I was unable to find any information for SW1A 0AA.");
        });

        it('it responds without reprompt speech', () => {
          assert.withoutRepromptSpeechStructure(skill_response);
        });

        it('it closes the session ', () => {
          assert.correctSessionStatus(skill_response, true);
        });
      });
    });

    context('Amazon address API error', () => {
      beforeEach(() => {
        nock('https://api.amazonalexa.com/v1/devices/string-identifying-the-device/settings/address/countryAndPostalCode')
          .get('').reply(403, '');

        return new Promise((resolve, reject) => {
          skill(permission_request, null, (error, responseEnvelope) => {
            skill_response = responseEnvelope;
            resolve();
          }, shared.test_configuration());
        });
      });

      it('speaks the expected text', () => {
        assert.correctOutputSpeechIncludesText(skill_response, "There was a problem getting your postcode from Amazon. Please try again later.");
      });
    });
  });
});
