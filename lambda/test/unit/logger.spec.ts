import 'mocha';
import { expect } from 'chai';

describe('Logger', () => {
  let original_node_env;

  beforeEach(() => {
    original_node_env = process.env.NODE_ENV;
    delete require.cache[ require.resolve('../../src/utils/logger') ]
  });

  afterEach(() => {
    process.env.NODE_ENV = original_node_env;
  });

  context('when in test mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test'
    });

    it('sets logger level to error', () => {
      expect(require('../../src/utils/logger').winston.level).to.eq('error');
    });
  });

  context('when not in test mode', () => {
    it('sets logger level to error', () => {
      expect(require('../../src/utils/logger').winston.level).to.eq('error');
    });
  });
});