'use strict';

import { Configuration } from "../../src/configuration";

class Shared {
  user_id(): string {
    return 'amzn1.ask.account.123';
  }

  test_configuration(): Configuration {
    let test_config: Configuration = new Configuration();
    test_config.debug = false;
    test_config.useLocalDB = true;

    return test_config;
  }
}

export const shared: Shared = new Shared();