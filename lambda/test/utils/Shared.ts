'use strict';

import { Configuration } from "../../src/configuration";

class Shared {
    user_id():string {
        return 'amzn1.ask.account.123';
    }

    test_configuration():Configuration {
        let test_config:Configuration = {
          debug: false,
          useLocalDB: true,
          dbTableName: Configuration.dbTableName,
          longformLaunchThreshold: Configuration.longformLaunchThreshold
        };

        return test_config;
    }
}

export const shared:Shared = new Shared();