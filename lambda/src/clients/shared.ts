import * as N3 from 'n3'

export enum RequestMethod {
  GET = 'GET'
}

export interface RequestOptions {
  hostname: string,
  path: string,
  method: RequestMethod,
  headers: object
}

export interface JsonResponseObject {
  statusCode: number,
  json: JSON,
}

export interface NtripleResponseObject {
  statusCode: number,
  store: N3.Store,
}