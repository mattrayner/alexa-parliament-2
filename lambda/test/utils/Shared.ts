'use strict';

import { Configuration } from "../../src/configuration";

class Shared {
    user_id():string {
        return 'amzn1.ask.account.123';
    }

    test_configuration():Configuration {
      return { debug: false, useLocalDB: true, dbTableName: Configuration.dbTableName}
    }
}

export const shared:Shared = new Shared();