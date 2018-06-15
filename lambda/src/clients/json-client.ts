'use strict';

import { http, https } from 'follow-redirects'
import { winston } from '../utils/logger'
import { JsonResponseObject, RequestMethod, RequestOptions } from './shared';

/**
 * This is a small wrapper client for the Parliament N-triple API.
 */
export class JsonClient {
  endpoint: string;
  https: boolean;

  /**
   * Retrieve an instance of the JSON API client.
   * @param {string} endpoint the endpoint of the Ntriple APIs.
   * @param {boolean} https Should requests be made via HTTPS?
   */
  constructor(endpoint: string, https: boolean = true) {
    winston.debug("Creating JsonClient instance.");
    this.endpoint = endpoint;
    this.https = https;
  }

  /**
   * This will make a request to the JSON API using the endpoint
   * the JSON Client was initialized with.
   * This will return a promise which fulfills to a JSON object.
   * @param {string} path
   * @return {Promise} promise for the request in flight.
   */
  getJSON(path: string): Promise<JsonResponseObject> {
    const options: RequestOptions = this.__getRequestOptions(path);

    return new Promise((fulfill, reject) => {
      this.__handleNtripleAPIRequest(options, fulfill, reject);
    });
  }

  /**
   * This is a helper method that makes requests to the Ntriple API and handles the response
   * in a generic manner. It will also resolve promise methods.
   * @param requestOptions
   * @param fulfill
   * @param reject
   * @private
   */
  __handleNtripleAPIRequest(requestOptions: RequestOptions, fulfill: (responseObject: JsonResponseObject) => any, reject: () => any) {
    winston.debug('getting:');
    winston.debug(`hostname: ${requestOptions.hostname}, path: ${requestOptions.path}`);

    let connection: (http | https) = this.https ? https : http;
    connection.get(requestOptions, (response) => {
      let data: string = '';

      winston.debug(`JSON API responded with a status code of : ${response.statusCode}`);

      // Report back a 500 so it can be handled in the app
      if ((`${response.statusCode}`).match(/^5\d\d$/))
        fulfill({ statusCode: response.statusCode, json: null });

      response.on('data', (chunk) => {
        winston.debug(`Received data from: ${response.responseUrl}`);

        data += chunk;
      });

      response.on('end', () => {
        winston.debug(`Finished receiving data from: ${response.responseUrl}`);

        let responseObject: JsonResponseObject = {
          statusCode: response.statusCode,
          json: JSON.parse(data)
        };

        fulfill(responseObject);
      })
    }).on('error', (e) => {
      winston.error(e);
      reject();
    });
  }

  /**
   * Private helper method for retrieving request options.
   * @param {string} path the path that you want to hit against the API provided by the skill event.
   * @return {RequestOptions}
   * @private
   */
  __getRequestOptions(path: string): RequestOptions {
    return {
      hostname: this.endpoint,
      path: path,
      method: RequestMethod.GET,
      headers: {
        'Alexa-Parliament': 'true',
        accept: 'application/json'
      }
    };
  }
}
