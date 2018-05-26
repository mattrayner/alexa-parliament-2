'use strict';

export const Configuration = {
  // when true, the skill logs additional detail, including the full request received from Alexa
  debug: true,

  useLocalDB: true,

  dbTableName: 'parliament',

  longformLaunchThreshold : 1000 /*ms*/ * 60 * 60 * 48 // 48 hours
};