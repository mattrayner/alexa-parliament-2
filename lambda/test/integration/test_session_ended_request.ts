'use strict';

import 'mocha';

import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';

import { handler as skill } from '../../src/index';

import { Assertion } from '../utils/Assertion';

import { ddb } from "../utils/DDBController";

import { shared } from '../utils/Shared'

import * as r from '../fixtures/requests/session_ended_intent.json'; // tslint:disable-line

const request:RequestEnvelope = <RequestEnvelope>r;
const assert = new Assertion();
let skill_response:ResponseEnvelope;

describe('Parliament : SessionEndedIntent', function () {
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
});
