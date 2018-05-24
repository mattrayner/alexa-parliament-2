'use strict';

import 'mocha';
import { expect, should } from 'chai';

import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';

import { handler as skill } from '../src/index';

import * as r from './fixtures/requests/launch_request.json'; // tslint:disable-line
const request: RequestEnvelope = <RequestEnvelope>r;

import { Assertion } from './utils/Assertion';
const assert = new Assertion();

import {ddb} from "./utils/DDBController";

const USER_ID = "amzn1.ask.account.123";
let skill_response:ResponseEnvelope;

describe('Parliament : LaunchRequest', function () {
  beforeEach(() => {
    this.timeout(5000);
  });

  afterEach(() => {
    skill_response = null;
  });

  context('as a first-time user', function () {
    beforeEach(() => {
      this.timeout(5000);

      return new Promise((resolve, reject) => {
        // prepare the database
        ddb.deleteFromDDB(USER_ID).then((data) => {
          skill(request, null, (error, responseEnvelope) => {
            skill_response = responseEnvelope;
            resolve();
          });
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
      assert.correctRepromptSpeechIncludesText(skill_response, 'Reprompt');
    });

    it('it does not close the session ', () => {
      assert.correctSessionStatus(skill_response, false);
    });
  });

  context('as a return user', () => {
    beforeEach(() => {
      return new Promise((resolve, reject) => {
        // prepare the database
        ddb.initialiseDDB(USER_ID).then((data) => {
          skill(request, null, (error:JSON, responseEnvelope:ResponseEnvelope) => {
            skill_response = responseEnvelope;
            resolve();
          });
        });
      });
    });

    it('it responds with the expected output speech', () => {
      assert.correctOutputSpeechIncludesText(skill_response, 'Welcome back to Parliament');
    });

    it('it responds with the expected reprompt speech', () => {
      assert.correctRepromptSpeechIncludesText(skill_response, 'Reprompt');
    });
  })
});