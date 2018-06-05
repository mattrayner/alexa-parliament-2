'use strict';

import 'mocha';

import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';

import { handler as skill } from '../../src/index';

import { Assertion } from '../utils/Assertion';

import { ddb } from "../utils/DDBController";

import { shared } from '../utils/Shared'

import * as r from '../fixtures/requests/launch_request.json'; // tslint:disable-line

const request: RequestEnvelope = <RequestEnvelope>r;
const assert = new Assertion();
let skill_response: ResponseEnvelope;

describe('Parliament : LaunchRequest', function () {
  beforeEach(() => {
    this.timeout(5000);
  });

  afterEach(() => {
    skill_response = null;
  });

  context('as a first-time user', function () {
    beforeEach(() => {
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

    it('it responds with valid response structure ', () => {
      assert.correctResponseStructure(skill_response);
    });

    it('it responses with output speech ', () => {
      assert.correctOutputSpeechStructure(skill_response);
    });

    it('it responds with the expected output speech', () => {
      assert.correctOutputSpeechIncludesText(skill_response, 'Welcome to Parliament');
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

  context('as a return user', () => {
    beforeEach(() => {
      return new Promise((resolve, reject) => {
        // prepare the database
        ddb.initialiseDDB(shared.user_id()).then((data) => {
          skill(request, null, (error, responseEnvelope) => {
            skill_response = responseEnvelope;
            resolve();
          }, shared.test_configuration());
        });
      });
    });

    it('it responds with the expected output speech', () => {
      assert.correctOutputSpeechIncludesText(skill_response, "Welcome back to Parliament. Try saying what's on, who's my MP, or help.");
    });

    it('it responds with the expected reprompt speech', () => {
      assert.correctRepromptSpeechIncludesText(skill_response, "Try saying, 'what's on', or, who's my MP.");
    });
  })
});