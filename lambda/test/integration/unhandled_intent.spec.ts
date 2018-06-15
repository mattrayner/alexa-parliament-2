'use strict';

import 'mocha';

import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';

import { handler as skill } from '../../src/index';

import { Assertion } from '../utils/Assertion';

import { ddb } from "../utils/DDBController";

import { shared } from '../utils/Shared'

import * as r from '../fixtures/requests/unhandled_intent.json'; // tslint:disable-line

const request: RequestEnvelope = <RequestEnvelope>r;
const assert = new Assertion();
let skill_response: ResponseEnvelope;

describe('Parliament : UnhandledIntent', function () {
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
    assert.correctOutputSpeechIncludesText(skill_response, 'Unhandled stuff');
  });

  it('it responds with reprompt speech', () => {
    assert.correctRepromptSpeechStructure(skill_response);
  });

  it('it responds with the expected reprompt speech', () => {
    assert.correctRepromptSpeechIncludesText(skill_response, 'Unhandled reprompt');
  });

  it('it closes the session ', () => {
    assert.correctSessionStatus(skill_response, true);
  });
});
