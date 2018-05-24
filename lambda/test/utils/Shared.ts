'use strict';

class Shared {
    user_id():string {
        return 'amzn1.ask.account.123';
    }
}

export const shared:Shared = new Shared();