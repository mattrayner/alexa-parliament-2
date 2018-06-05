"use strict";
exports.__esModule = true;
var AirbrakeClient = require("airbrake-js");
var FakeClient = /** @class */ (function () {
    function FakeClient() {
        this.fake = true;
    }
    FakeClient.prototype.notify = function () {
    };
    return FakeClient;
}());
exports.FakeClient = FakeClient;
var airbrake;
if (process.env.NODE_ENV != 'test' && process.env.AIRBRAKE_PROJECT_ID && process.env.AIRBRAKE_PROJECT_KEY) {
    airbrake = new AirbrakeClient({
        projectId: process.env.AIRBRAKE_PROJECT_ID,
        projectKey: process.env.AIRBRAKE_PROJECT_KEY
    });
}
else {
    airbrake = new FakeClient();
}
exports.Airbrake = airbrake;
