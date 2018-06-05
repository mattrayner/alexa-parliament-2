"use strict";
exports.__esModule = true;
var Winston = require("winston");
var level = 'debug';
if (process.env.NODE_ENV == 'test')
    level = 'error';
var transports = [
    new Winston.transports.Console({ timestamp: true })
];
var options = {
    level: level,
    transports: transports
};
exports.winston = new Winston.Logger(options);
