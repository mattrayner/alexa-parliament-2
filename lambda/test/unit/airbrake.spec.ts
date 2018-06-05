import 'mocha';
import { expect } from 'chai';

import * as RealClient from 'airbrake-js';

import { Airbrake } from '../../src/utils/airbrake';

describe('Airbrake', () => {
  let original_node_env, original_airbrake_project_id, original_airbrake_project_key;

  beforeEach(() => {
    original_node_env = process.env.NODE_ENV;
    original_airbrake_project_id = process.env.AIRBRAKE_PROJECT_ID;
    original_airbrake_project_key = process.env.AIRBRAKE_PROJECT_KEY;

    delete require.cache[ require.resolve('../../src/utils/airbrake') ]
  });

  afterEach(() => {
    process.env.NODE_ENV = original_node_env;
    process.env.AIRBRAKE_PROJECT_ID = original_airbrake_project_id;
    process.env.AIRBRAKE_PROJECT_KEY = original_airbrake_project_key;
  });

  context('when in test mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
      process.env.AIRBRAKE_PROJECT_ID = 'foo';
      process.env.AIRBRAKE_PROJECT_KEY = 'bar';
    });

    it('exports fake class', () => {
      expect(require('../../src/utils/airbrake').Airbrake.fake).to.eq(true);
    });
  });

  context('when missing airbrake variables', () => {
    context('id', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production';
        delete process.env.AIRBRAKE_PROJECT_ID;
        process.env.AIRBRAKE_PROJECT_KEY = 'bar';
      });

      it('exports fake class', () => {
        expect(require('../../src/utils/airbrake').Airbrake.fake).to.eq(true);
      });
    });

    context('key', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production';
        process.env.AIRBRAKE_PROJECT_ID = 'foo';
        delete process.env.AIRBRAKE_PROJECT_KEY;
      });

      it('exports fake class', () => {
        expect(require('../../src/utils/airbrake').Airbrake.fake).to.eq(true);
      });
    });

    context('both', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production';
        delete process.env.AIRBRAKE_PROJECT_ID;
        delete process.env.AIRBRAKE_PROJECT_KEY;
      });

      it('exports fake class', () => {
        expect(require('../../src/utils/airbrake').Airbrake.fake).to.eq(true);
      });
    });
  });

  context('with all information set', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.AIRBRAKE_PROJECT_ID = 'foo';
      process.env.AIRBRAKE_PROJECT_KEY = 'bar';

      delete require.cache[ require.resolve('../../src/utils/airbrake') ]
    });

    it('exports real class', () => {
      expect(require('../../src/utils/airbrake').Airbrake).to.be.instanceOf(RealClient);
    });
  });
});