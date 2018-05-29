'use strict';

export interface Configuration {
  debug: boolean
  useLocalDB: boolean,
  dbTableName: string,
  longformLaunchThreshold: number
}

export class Configuration implements Configuration {
  // when true, the skill logs additional detail, including the full request received from Alexa
  debug = true;
  useLocalDB = true;
  dbTableName =  'parliament';
  longformLaunchThreshold = 1000 /* ms */ * 60 * 60 * 48; /* 48 hours */
}