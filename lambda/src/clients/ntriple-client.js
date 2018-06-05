'use strict';
exports.__esModule = true;
var N3 = require("n3");
var follow_redirects_1 = require("follow-redirects");
var logger_1 = require("../utils/logger");
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
})(RequestMethod || (RequestMethod = {}));
/**
 * This is a small wrapper client for the Parliament N-triple API.
 */
var NtripleClient = /** @class */ (function () {
    /**
     * Retrieve an instance of the Ntriple API client.
     * @param {string} endpoint the endpoint of the Ntriple APIs.
     */
    function NtripleClient(endpoint) {
        logger_1.winston.debug("Creating NtripleClient instance.");
        this.endpoint = endpoint;
    }
    /**
     * This will make a request to the Ntriple API using the endpoint
     * the NTriple Client was initialized with.
     * This will return a promise which fulfills to a N3 Store.
     * @return {Promise} promise for the request in flight.
     */
    NtripleClient.prototype.getTripleStore = function (path) {
        var _this = this;
        var options = this.__getRequestOptions(path);
        return new Promise(function (fulfill, reject) {
            _this.__handleNtripleAPIRequest(options, fulfill, reject);
        });
    };
    /**
     * This is a helper method that makes requests to the Ntriple API and handles the response
     * in a generic manner. It will also resolve promise methods.
     * @param requestOptions
     * @param fulfill
     * @param reject
     * @private
     */
    NtripleClient.prototype.__handleNtripleAPIRequest = function (requestOptions, fulfill, reject) {
        logger_1.winston.debug('getting:');
        logger_1.winston.debug("hostname: " + requestOptions.hostname + ", path: " + requestOptions.path);
        follow_redirects_1.https.get(requestOptions, function (response) {
            var data = '';
            logger_1.winston.debug("NTriple API responded with a status code of : " + response.statusCode);
            // Report back a 500 so it can be handled in the app
            if (("" + response.statusCode).match(/^5\d\d$/))
                fulfill({ statusCode: response.statusCode, store: null });
            response.on('data', function (chunk) {
                logger_1.winston.debug("Received data from: " + response.responseUrl);
                data += chunk;
            });
            response.on('end', function () {
                logger_1.winston.debug("Finished receiving data from: " + response.responseUrl);
                var parser = N3.Parser();
                var store = new N3.Store();
                var responseObject = {
                    statusCode: response.statusCode,
                    store: store
                };
                parser.parse(data, function (error, quad) {
                    if (quad) {
                        store.addQuad(quad);
                    }
                    else {
                        logger_1.winston.debug('Parsing completed; Triple store contains %d triples.', store.size);
                        responseObject.store = store;
                        fulfill(responseObject);
                    }
                });
            });
        }).on('error', function (e) {
            logger_1.winston.error(e);
            reject();
        });
    };
    /**
     * Private helper method for retrieving request options.
     * @param {string} path the path that you want to hit against the API provided by the skill event.
     * @return {{hostname: string, path: *, method: string, headers: {Authorization: string}}}
     * @private
     */
    NtripleClient.prototype.__getRequestOptions = function (path) {
        return {
            hostname: this.endpoint,
            path: path,
            method: RequestMethod.GET,
            headers: {
                'Alexa-Parliament': 'true',
                accept: 'application/n-triples'
            }
        };
    };
    return NtripleClient;
}());
exports.NtripleClient = NtripleClient;
