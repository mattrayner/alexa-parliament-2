'use strict';
exports.__esModule = true;
var Configuration = /** @class */ (function () {
    function Configuration() {
        // when true, the skill logs additional detail, including the full request received from Alexa
        this.debug = true;
        this.useLocalDB = false;
        this.dbTableName = 'parliament';
        this.longformLaunchThreshold = 1000 /* ms */ * 60 * 60 * 48;
        /* 48 hours */
    }
    return Configuration;
}());
exports.Configuration = Configuration;
