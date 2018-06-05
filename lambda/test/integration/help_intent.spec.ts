'use strict';

import 'mocha';

import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';

import { handler as skill } from '../../src/index';

import { Assertion } from '../utils/Assertion';

import { shared } from '../utils/Shared'

import { ddb } from "../utils/DDBController";

import * as r from '../fixtures/requests/help_intent.json'; // tslint:disable-line

const request: RequestEnvelope = <RequestEnvelope>r;
const assert = new Assertion();
let skill_response: ResponseEnvelope;

describe('Parliament : HelpIntent', function () {
  beforeEach(() => {
    this.timeout(5000);

    return new Promise((resolve, reject) => {
      // prepare the database
      ddb.deleteFromDDB(shared.user_id()).then((data) => {
        skill(request, null, (error, responseEnvelope) => {
          skill_response = responseEnvelope;
          resolve();
        }, shared.test_configuration());
      });
    });
  });

  afterEach(() => {
    skill_response = null;
  });

  it('it responds with valid response structure ', () => {
    assert.correctResponseStructure(skill_response);
  });

  it('it responses with output speech ', () => {
    assert.correctOutputSpeechStructure(skill_response);
  });

  it('it responds with the expected output speech', () => {
    assert.correctOutputSpeechIncludesText(skill_response, "Parliament for Alexa, can tell you what\'s on today at the Houses of Parliament, or tell you who your MP is. Try saying, \'what\'s on\', to hear about the events at both houses. Alternatively, say, \'whats on at the commons\', or, \'whats on in the lords\', to hear about the events at a specific house. To find out who your MP is, try saying, who\'s my MP.");
  });

  it('it responds with reprompt speech', () => {
    assert.correctRepromptSpeechStructure(skill_response);
  });

  it('it responds with the expected reprompt speech', () => {
    assert.correctRepromptSpeechIncludesText(skill_response, "Try saying, 'what's on', or, who's my MP.");
  });

  it('it does not close the session ', () => {
    assert.correctSessionStatus(skill_response, false);
  });
});
