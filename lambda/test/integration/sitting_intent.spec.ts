'use strict';

import 'mocha';

import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';

import { handler as skill } from '../../src/index';

import { Assertion } from '../utils/Assertion';
import { shared } from "../utils/Shared";

import * as nock from 'nock';

const r = require('../fixtures/requests/sitting_intent.json'); // tslint:disable-line

const request: RequestEnvelope = <RequestEnvelope>r;
const assert = new Assertion();
let skill_response: ResponseEnvelope;

describe('Parliament : SittingIntent', function () {
  beforeEach(() => {
    this.timeout(5000);
  });

  afterEach(() => {
    skill_response = null;
  });

  context('with both houses sitting', () => {
    beforeEach(() => {
      nock('http://service.calendar.parliament.uk')
        .get('/calendar/events/nonsitting.json?date=today').reply(200, '[]', {
        'alexa-parliament': 'true',
        'accept': 'application/json'
      });

      return new Promise((resolve, reject) => {
        skill(request, null, (error, responseEnvelope) => {
          skill_response = responseEnvelope;
          resolve();
        })//, shared.test_configuration());
      });
    });

    it('it responds with valid response structure ', () => {
      assert.correctResponseStructure(skill_response);
    });

    it('it responses with output speech ', () => {
      assert.correctOutputSpeechStructure(skill_response);
    });

    it('it responds with the expected output speech', () => {
      assert.correctOutputSpeechIncludesText(skill_response, "Both houses are sitting today.");
    });

    it('it responds without reprompt speech', () => {
      assert.withoutRepromptSpeechStructure(skill_response);
    });

    it('it closes the session ', () => {
      assert.correctSessionStatus(skill_response, true);
    });
  });

  context('with only the commons sitting', () => {
    beforeEach(() => {
      nock('http://service.calendar.parliament.uk')
        .get('/calendar/events/nonsitting.json?date=today').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/calendar/nonsitting/lords.json', {
        'alexa-parliament': 'true',
        'accept': 'application/json'
      });

      return new Promise((resolve, reject) => {
        skill(request, null, (error, responseEnvelope) => {
          skill_response = responseEnvelope;
          resolve();
        })//, shared.test_configuration());
      });
    });

    it('it responds with valid response structure ', () => {
      assert.correctResponseStructure(skill_response);
    });

    it('it responses with output speech ', () => {
      assert.correctOutputSpeechStructure(skill_response);
    });

    it('it responds with the expected output speech', () => {
      assert.correctOutputSpeechIncludesText(skill_response, "Only the House of Commons is sitting today.");
    });

    it('it responds without reprompt speech', () => {
      assert.withoutRepromptSpeechStructure(skill_response);
    });

    it('it closes the session ', () => {
      assert.correctSessionStatus(skill_response, true);
    });
  });

  context('with only the lords sitting', () => {
    beforeEach(() => {
      nock('http://service.calendar.parliament.uk')
        .get('/calendar/events/nonsitting.json?date=today').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/calendar/nonsitting/commons.json', {
        'alexa-parliament': 'true',
        'accept': 'application/json'
      });

      return new Promise((resolve, reject) => {
        skill(request, null, (error, responseEnvelope) => {
          skill_response = responseEnvelope;
          resolve();
        })//, shared.test_configuration());
      });
    });

    it('it responds with valid response structure ', () => {
      assert.correctResponseStructure(skill_response);
    });

    it('it responses with output speech ', () => {
      assert.correctOutputSpeechStructure(skill_response);
    });

    it('it responds with the expected output speech', () => {
      assert.correctOutputSpeechIncludesText(skill_response, "Only the House of Lords is sitting today.");
    });

    it('it responds without reprompt speech', () => {
      assert.withoutRepromptSpeechStructure(skill_response);
    });

    it('it closes the session ', () => {
      assert.correctSessionStatus(skill_response, true);
    });
  });

  context('with neither house sitting', () => {
    beforeEach(() => {
      nock('http://service.calendar.parliament.uk')
        .get('/calendar/events/nonsitting.json?date=today').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/calendar/nonsitting/both.json', {
        'alexa-parliament': 'true',
        'accept': 'application/json'
      });

      return new Promise((resolve, reject) => {
        skill(request, null, (error, responseEnvelope) => {
          skill_response = responseEnvelope;
          resolve();
        })//, shared.test_configuration());
      });
    });

    it('it responds with valid response structure ', () => {
      assert.correctResponseStructure(skill_response);
    });

    it('it responses with output speech ', () => {
      assert.correctOutputSpeechStructure(skill_response);
    });

    it('it responds with the expected output speech', () => {
      assert.correctOutputSpeechIncludesText(skill_response, "Neither house is sitting today.");
    });

    it('it responds without reprompt speech', () => {
      assert.withoutRepromptSpeechStructure(skill_response);
    });

    it('it closes the session ', () => {
      assert.correctSessionStatus(skill_response, true);
    });
  });

  describe('handles multiple reasons for not sitting', () => {
    context('If descriptions are not empty, and match i.e. Conference', () => {
      beforeEach(() => {
        nock('http://service.calendar.parliament.uk')
          .get('/calendar/events/nonsitting.json?date=today').replyWithFile(200, __dirname + '/../fixtures/apis/parliament/calendar/nonsitting/conference.json', {
          'alexa-parliament': 'true',
          'accept': 'application/json'
        });

        return new Promise((resolve, reject) => {
          skill(request, null, (error, responseEnvelope) => {
            skill_response = responseEnvelope;
            resolve();
          })//, shared.test_configuration());
        });
      });

      it('it responds with valid response structure ', () => {
          assert.correctResponseStructure(skill_response);
      });

      it('it responses with output speech ', () => {
          assert.correctOutputSpeechStructure(skill_response);
      });

      it('it responds with the expected output speech', () => {
          assert.correctOutputSpeechIncludesText(skill_response, "Both the House of Commons and House of Lords are on Conference recess.");
      });

      it('it responds without reprompt speech', () => {
          assert.withoutRepromptSpeechStructure(skill_response);
      });

      it('it closes the session ', () => {
          assert.correctSessionStatus(skill_response, true);
      });
    });
  });
});