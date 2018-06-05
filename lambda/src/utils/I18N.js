'use strict';
exports.__esModule = true;
var strings_1 = require("./strings");
var logger_1 = require("./logger");
var I18N = /** @class */ (function () {
    function I18N(strings) {
        this.strings = strings;
    }
    I18N.prototype.S = function (request, key) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var result;
        try {
            result = this.strings[request.locale][key];
            if (result === undefined) {
                result = "No string defined for key : " + key;
            }
            // search for {x} and replaces with values
            var regex = /({\d*})/g;
            result = result.replace(regex, function (match, p1, offset, string) {
                var index = parseInt((match.substring(1, match.length)).substring(0, match.length - 2));
                return args[index];
            });
        }
        catch (e) {
            logger_1.winston.error(e);
            logger_1.winston.error("Can not find strings for locale " + request.locale + " and key " + key);
        }
        return result;
    };
    return I18N;
}());
exports.i18n = new I18N(strings_1.strings);
