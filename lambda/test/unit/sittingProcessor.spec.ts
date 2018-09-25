import 'mocha';
import { expect } from 'chai';
import { TranslationKey, SittingData, SittingProcessor } from "../../src/utils/sittingProcessor";

describe('SittingProcessor', () => {
  context('with both houses sitting', () => {
    it('should return SittingData with both houses set to true', () => {
      let expectedData: SittingData = { lords: { sitting: true, description: '' }, commons: {sitting: true, description: '' }, translation_key: TranslationKey.Both, translation_data: '' };

      expect(SittingProcessor(JSON.parse('[]'))).to.deep.eq(expectedData);
    })
  });

  context('with the commons in recess', () => {
    it('should return SittingData with commons set to false', () => {
      let expectedData: SittingData = { lords: { sitting: true, description: '' }, commons: { sitting: false, description: 'May' }, translation_key: TranslationKey.Lords, translation_data: '' };
      let fixtureData = require('../fixtures/apis/parliament/calendar/nonsitting/commons');

      expect(SittingProcessor(fixtureData)).to.deep.eq(expectedData);
    });
  });

  context('with the lords in recess', () => {
    it('should return SittingData with lords set to false', () => {
      let expectedData: SittingData = { lords: { sitting: false, description: '' }, commons: { sitting: true, description: '' }, translation_key: TranslationKey.Commons, translation_data: '' };
      let fixtureData = require('../fixtures/apis/parliament/calendar/nonsitting/lords');

      expect(SittingProcessor(fixtureData)).to.deep.eq(expectedData);
    });
  });

  context('both houses in recess', () => {
    it('should return SittingData with both houses set to false', () => {
      let expectedData: SittingData = { lords: { sitting: false, description: '' }, commons: { sitting: false, description: 'May' }, translation_key: TranslationKey.Neither, translation_data: '' };
      let fixtureData = require('../fixtures/apis/parliament/calendar/nonsitting/both');

      expect(SittingProcessor(fixtureData)).to.deep.eq(expectedData);
    });
  });

  context('with a non-string description value', () => {
    it('should return empty string descriptions', () => {
      let expectedData: SittingData = { lords: { sitting: false, description: '' }, commons: { sitting: false, description: '' }, translation_key: TranslationKey.Neither, translation_data: '' };
      let fixtureData = require('../fixtures/apis/parliament/calendar/nonsitting/both_with_non_srings');

      expect(SittingProcessor(fixtureData)).to.deep.eq(expectedData);
    });
  });
});
