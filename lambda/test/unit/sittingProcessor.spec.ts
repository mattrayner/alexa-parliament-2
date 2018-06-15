import 'mocha';
import { expect } from 'chai';
import { SittingData, SittingProcessor } from "../../src/utils/sittingProcessor";

describe('SittingProcessor', () => {
  context('with both houses sitting', () => {
    it('should return SittingData with both houses set to true', () => {
      let expectedData: SittingData = { lords: true, commons: true };

      expect(SittingProcessor(JSON.parse('[]'))).to.deep.eq(expectedData);
    })
  });

  context('with the commons in recess', () => {
    it('should return SittingData with commons set to false', () => {
      let expectedData: SittingData = { lords: true, commons: false };
      let fixtureData = require('../fixtures/apis/parliament/calendar/nonsitting/commons');

      expect(SittingProcessor(fixtureData)).to.deep.eq(expectedData);
    });
  });

  context('with the lords in recess', () => {
    it('should return SittingData with lords set to false', () => {
      let expectedData: SittingData = { lords: false, commons: true };
      let fixtureData = require('../fixtures/apis/parliament/calendar/nonsitting/lords');

      expect(SittingProcessor(fixtureData)).to.deep.eq(expectedData);
    });
  });

  context('both houses in recess', () => {
    it('should return SittingData with both houses set to false', () => {
      let expectedData: SittingData = { lords: false, commons: false };
      let fixtureData = require('../fixtures/apis/parliament/calendar/nonsitting/both');

      expect(SittingProcessor(fixtureData)).to.deep.eq(expectedData);
    });
  });
});
