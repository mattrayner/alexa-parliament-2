'use strict';

import * as N3 from 'n3'
import { https } from 'follow-redirects'
import { winston } from '../utils/logger'

enum RequestMethod {
  GET='GET'
}

interface RequestOptions {
  hostname: string,
  path: string,
  method: RequestMethod,
  headers: object
}

interface ResponseObject {
  statusCode: number,
  store: N3.Store,
}

/**
 * This is a small wrapper client for the Parliament N-triple API.
 */
export class NtripleClient {
  endpoint:string;

  /**
   * Retrieve an instance of the Ntriple API client.
   * @param {string} endpoint the endpoint of the Ntriple APIs.
   */
  constructor(endpoint:string) {
    winston.debug("Creating NtripleClient instance.");
    this.endpoint = endpoint;
  }

  /**
   * This will make a request to the Ntriple API using the endpoint
   * the NTriple Client was initialized with.
   * This will return a promise which fulfills to a N3 Store.
   * @return {Promise} promise for the request in flight.
   */
  getTripleStore(path:string):Promise<ResponseObject> {
    const options:RequestOptions = this.__getRequestOptions(path);

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
  __handleNtripleAPIRequest(requestOptions:RequestOptions, fulfill:(responseObject:ResponseObject) => any, reject:() => any) {
    winston.debug('getting:');
    winston.debug(requestOptions);

    https.get(requestOptions, (response) => {
      let data:string = '';

      winston.debug(`NTriple API responded with a status code of : ${response.statusCode}`);

      // Report back a 500 so it can be handled in the app
      if ((`${response.statusCode}`).match(/^5\d\d$/))
        fulfill({ statusCode: response.statusCode, store: null });

      response.on('data', (chunk) => {
        winston.debug(`Received data from: ${response.responseUrl}`);

        data += chunk;
      });

      response.on('end', () => {
        winston.debug(`Finished receiving data from: ${response.responseUrl}`);

        let parser:N3.Parser = N3.Parser();
        let store:N3.Store = new N3.Store();

        let responseObject:ResponseObject = {
          statusCode: response.statusCode,
          store: store
        };

        parser.parse(data, (error, quad) =>{
          if(quad) {
            store.addQuad(quad);
          } else {
            winston.debug('Parsing completed; Triple store contains %d triples.', store.size);

            responseObject.store = store;

            fulfill(responseObject);
          }
        });
      })
    }).on('error', (e) => {
      winston.error(e);
      reject();
    });
  }

  /**
   * Private helper method for retrieving request options.
   * @param {string} path the path that you want to hit against the API provided by the skill event.
   * @return {{hostname: string, path: *, method: string, headers: {Authorization: string}}}
   * @private
   */
  __getRequestOptions(path:string):RequestOptions {
    return {
      hostname: this.endpoint,
      path: path,
      method: RequestMethod.GET,
      headers: {
        'Alexa-Parliament': 'true',
        accept: 'application/n-triples'
      }
    };
  }
}
