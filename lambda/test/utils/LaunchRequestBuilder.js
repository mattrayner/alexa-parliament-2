"use strict";
exports.__esModule = true;
/**
 * Builder used to construct a new LaunchRequest
 * @class
 */
var LaunchRequestBuilder = /** @class */ (function () {
    function LaunchRequestBuilder() {
        this['type'] = 'LaunchRequest';
    }
    /**
     * Sets the requestId
     * @param {string} requestId
     */
    LaunchRequestBuilder.prototype.withRequestId = function (requestId) {
        this['requestId'] = requestId;
        return this;
    };
    /**
     * Sets the timestamp
     * @param {string} timestamp
     */
    LaunchRequestBuilder.prototype.withTimestamp = function (timestamp) {
        this['timestamp'] = timestamp;
        return this;
    };
    /**
     * Sets the locale
     * @param {string} locale
     */
    LaunchRequestBuilder.prototype.withLocale = function (locale) {
        this['locale'] = locale;
        return this;
    };
    LaunchRequestBuilder.prototype.build = function () {
        var result = {};
        if (this['type'] != null) {
            result['type'] = this['type'];
        }
        if (this['requestId'] != null) {
            result['requestId'] = this['requestId'];
        }
        if (this['timestamp'] != null) {
            result['timestamp'] = this['timestamp'];
        }
        if (this['locale'] != null) {
            result['locale'] = this['locale'];
        }
        return result;
    };
    return LaunchRequestBuilder;
}());
exports.LaunchRequestBuilder = LaunchRequestBuilder;
