'use strict';

import 'mocha';
import { expect } from 'chai';
import { strings } from "../../src/utils/strings";

describe('strings', () => {
  it('contains all the expected locales', () => {
    expect(Object.keys(strings)).to.deep.eq([ 'en-GB', 'en-US', 'en-IN', 'en-CA', 'en-AU', 'fr-FR' ])
  });

  it('shares all the same keys across all of the locales', () => {
    let keys: string[] = Object.keys(strings);
    let expectedStringKeys: string[] = Object.keys(strings[ keys[ 0 ] ]);

    for (let key of Object.keys(strings)) {
      let localeSpecificStringKeys = Object.keys(strings[ key ]);

      expect(localeSpecificStringKeys).to.deep.eq(expectedStringKeys, `Expected ${key} to have the same translations as ${keys[ 0 ]}`);
    }
  });
});