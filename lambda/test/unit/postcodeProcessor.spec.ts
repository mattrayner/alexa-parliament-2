import 'mocha';
import { expect } from 'chai';
import * as N3 from 'n3';
import { MPInformation, PostcodeProcessor } from '../../src/utils/postcodeProcessor';

describe('PostcodeProcessor', () => {
  let store:N3.Store;
  beforeEach(() => {
    store = new N3.Store();
  });

  afterEach(() => {
    store = null;
  });

  context('with complete data', () => {
    beforeEach(() => {
      store.addQuad('https://id.parliament.uk/ew2nBXJ7', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/ConstituencyGroup');
      store.addQuad('https://id.parliament.uk/ew2nBXJ7', 'https://id.parliament.uk/schema/constituencyGroupHasHouseSeat', 'https://id.parliament.uk/Qt0BigGT');
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/HouseSeat');
      store.addQuad('https://id.parliament.uk/ew2nBXJ7', 'https://id.parliament.uk/schema/constituencyGroupName', "Cities of London and Westminster");
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'https://id.parliament.uk/schema/houseSeatHasConstituencyGroup', 'https://id.parliament.uk/ew2nBXJ7');
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'https://id.parliament.uk/schema/houseSeatHasHouse', 'https://id.parliament.uk/1AFu55Hs');
      store.addQuad('https://id.parliament.uk/1AFu55Hs', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/House');
      store.addQuad('https://id.parliament.uk/1AFu55Hs', 'https://id.parliament.uk/schema/houseName', "House of Commons");
      store.addQuad('https://id.parliament.uk/8FsuRjTr', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/SeatIncumbency');
      store.addQuad('https://id.parliament.uk/8FsuRjTr', 'https://id.parliament.uk/schema/parliamentaryIncumbencyStartDate', "2017-06-08+00:00");
      store.addQuad('https://id.parliament.uk/8FsuRjTr', 'https://id.parliament.uk/schema/seatIncumbencyHasHouseSeat', 'https://id.parliament.uk/Qt0BigGT');
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/Person');
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/personGivenName', "Mark");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/personFamilyName', "Field");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'http://example.com/F31CBD81AD8343898B49DC65743F0BDF', "Mark Field");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/memberHasParliamentaryIncumbency', 'https://id.parliament.uk/8FsuRjTr');
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/partyMemberHasPartyMembership', 'https://id.parliament.uk/kGfh5eyr');
      store.addQuad('https://id.parliament.uk/kGfh5eyr', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/PartyMembership');
      store.addQuad('https://id.parliament.uk/kGfh5eyr', 'https://id.parliament.uk/schema/partyMembershipHasParty', 'https://id.parliament.uk/DIifZMjq');
      store.addQuad('https://id.parliament.uk/kGfh5eyr', 'https://id.parliament.uk/schema/partyMembershipStartDate', "2017-06-08+00:00");
      store.addQuad('https://id.parliament.uk/DIifZMjq', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/Party');
      store.addQuad('https://id.parliament.uk/DIifZMjq', 'https://id.parliament.uk/schema/partyName', "Conservative");
    });

    it('it creates a complete object', () => {
      let expectedData:MPInformation = {
        "constituency": "Cities of London and Westminster",
        "image": {
          "mcu": null,
          "portrait": null
        },
        "incumbency": "08-06-2017",
        "member": "Mark Field",
        "party": "Conservative"
      };

      let memberObject = PostcodeProcessor(store);
      expect(memberObject).to.deep.eq(expectedData);
    });
  });

  context('without a constituency', () => {
    beforeEach(() => {
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/HouseSeat');
      store.addQuad('https://id.parliament.uk/ew2nBXJ7', 'https://id.parliament.uk/schema/constituencyGroupName', "Cities of London and Westminster");
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'https://id.parliament.uk/schema/houseSeatHasConstituencyGroup', 'https://id.parliament.uk/ew2nBXJ7');
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'https://id.parliament.uk/schema/houseSeatHasHouse', 'https://id.parliament.uk/1AFu55Hs');
      store.addQuad('https://id.parliament.uk/1AFu55Hs', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/House');
      store.addQuad('https://id.parliament.uk/1AFu55Hs', 'https://id.parliament.uk/schema/houseName', "House of Commons");
      store.addQuad('https://id.parliament.uk/8FsuRjTr', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/SeatIncumbency');
      store.addQuad('https://id.parliament.uk/8FsuRjTr', 'https://id.parliament.uk/schema/parliamentaryIncumbencyStartDate', "2017-06-08+00:00");
      store.addQuad('https://id.parliament.uk/8FsuRjTr', 'https://id.parliament.uk/schema/seatIncumbencyHasHouseSeat', 'https://id.parliament.uk/Qt0BigGT');
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/Person');
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/personGivenName', "Mark");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/personFamilyName', "Field");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'http://example.com/F31CBD81AD8343898B49DC65743F0BDF', "Mark Field");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/memberHasParliamentaryIncumbency', 'https://id.parliament.uk/8FsuRjTr');
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/partyMemberHasPartyMembership', 'https://id.parliament.uk/kGfh5eyr');
      store.addQuad('https://id.parliament.uk/kGfh5eyr', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/PartyMembership');
      store.addQuad('https://id.parliament.uk/kGfh5eyr', 'https://id.parliament.uk/schema/partyMembershipHasParty', 'https://id.parliament.uk/DIifZMjq');
      store.addQuad('https://id.parliament.uk/kGfh5eyr', 'https://id.parliament.uk/schema/partyMembershipStartDate', "2017-06-08+00:00");
      store.addQuad('https://id.parliament.uk/DIifZMjq', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/Party');
      store.addQuad('https://id.parliament.uk/DIifZMjq', 'https://id.parliament.uk/schema/partyName', "Conservative");
    });

    it('it creates a partial object', () => {
      let expectedData:MPInformation = {
        "constituency": null,
        "image": {
          "mcu": null,
          "portrait": null
        },
        "incumbency": "08-06-2017",
        "member": "Mark Field",
        "party": "Conservative"
      };

      let memberObject = PostcodeProcessor(store);
      expect(memberObject).to.deep.eq(expectedData);
    });
  });

  context('without an incumbency', () => {
    beforeEach(() => {
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/HouseSeat');
      store.addQuad('https://id.parliament.uk/ew2nBXJ7', 'https://id.parliament.uk/schema/constituencyGroupName', "Cities of London and Westminster");
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'https://id.parliament.uk/schema/houseSeatHasConstituencyGroup', 'https://id.parliament.uk/ew2nBXJ7');
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'https://id.parliament.uk/schema/houseSeatHasHouse', 'https://id.parliament.uk/1AFu55Hs');
      store.addQuad('https://id.parliament.uk/1AFu55Hs', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/House');
      store.addQuad('https://id.parliament.uk/1AFu55Hs', 'https://id.parliament.uk/schema/houseName', "House of Commons");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/Person');
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/personGivenName', "Mark");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/personFamilyName', "Field");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'http://example.com/F31CBD81AD8343898B49DC65743F0BDF', "Mark Field");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/memberHasParliamentaryIncumbency', 'https://id.parliament.uk/8FsuRjTr');
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/partyMemberHasPartyMembership', 'https://id.parliament.uk/kGfh5eyr');
      store.addQuad('https://id.parliament.uk/kGfh5eyr', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/PartyMembership');
      store.addQuad('https://id.parliament.uk/kGfh5eyr', 'https://id.parliament.uk/schema/partyMembershipHasParty', 'https://id.parliament.uk/DIifZMjq');
      store.addQuad('https://id.parliament.uk/kGfh5eyr', 'https://id.parliament.uk/schema/partyMembershipStartDate', "2017-06-08+00:00");
      store.addQuad('https://id.parliament.uk/DIifZMjq', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/Party');
      store.addQuad('https://id.parliament.uk/DIifZMjq', 'https://id.parliament.uk/schema/partyName', "Conservative");
    });

    it('it creates a partial object', () => {
      let expectedData:MPInformation = {
        "constituency": null,
        "image": {
          "mcu": null,
          "portrait": null
        },
        "incumbency": null,
        "member": "Mark Field",
        "party": "Conservative"
      };

      let memberObject = PostcodeProcessor(store);
      expect(memberObject).to.deep.eq(expectedData);
    });
  });

  context('without a party', () => {
    beforeEach(() => {
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/HouseSeat');
      store.addQuad('https://id.parliament.uk/ew2nBXJ7', 'https://id.parliament.uk/schema/constituencyGroupName', "Cities of London and Westminster");
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'https://id.parliament.uk/schema/houseSeatHasConstituencyGroup', 'https://id.parliament.uk/ew2nBXJ7');
      store.addQuad('https://id.parliament.uk/Qt0BigGT', 'https://id.parliament.uk/schema/houseSeatHasHouse', 'https://id.parliament.uk/1AFu55Hs');
      store.addQuad('https://id.parliament.uk/1AFu55Hs', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/House');
      store.addQuad('https://id.parliament.uk/1AFu55Hs', 'https://id.parliament.uk/schema/houseName', "House of Commons");
      store.addQuad('https://id.parliament.uk/8FsuRjTr', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/SeatIncumbency');
      store.addQuad('https://id.parliament.uk/8FsuRjTr', 'https://id.parliament.uk/schema/parliamentaryIncumbencyStartDate', "2017-06-08+00:00");
      store.addQuad('https://id.parliament.uk/8FsuRjTr', 'https://id.parliament.uk/schema/seatIncumbencyHasHouseSeat', 'https://id.parliament.uk/Qt0BigGT');
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/Person');
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/personGivenName', "Mark");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/personFamilyName', "Field");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'http://example.com/F31CBD81AD8343898B49DC65743F0BDF', "Mark Field");
      store.addQuad('https://id.parliament.uk/rk95p4uH', 'https://id.parliament.uk/schema/memberHasParliamentaryIncumbency', 'https://id.parliament.uk/8FsuRjTr');
    });

    it('it creates a partial object', () => {
      let expectedData:MPInformation = {
        "constituency": null,
        "image": {
          "mcu": null,
          "portrait": null
        },
        "incumbency": "08-06-2017",
        "member": "Mark Field",
        "party": null
      };

      let memberObject = PostcodeProcessor(store);
      expect(memberObject).to.deep.eq(expectedData);
    });
  });

  context('without a member', () => {
    it('it creates a partial object', () => {
      let expectedData:MPInformation = {
        "constituency": null,
        "image": {
          "mcu": null,
          "portrait": null
        },
        "incumbency": null,
        "member": null,
        "party": null
      };

      let memberObject = PostcodeProcessor(store);
      expect(memberObject).to.deep.eq(expectedData);
    });
  });
});