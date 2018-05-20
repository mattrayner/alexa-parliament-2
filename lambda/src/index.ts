'use strict';

import * as AWS from 'aws-sdk';
import { ResponseFactory, SkillBuilders, RequestHandler, HandlerInput } from 'ask-sdk';
import { RequestEnvelope, ResponseEnvelope, Response } from 'ask-sdk-model';
import { Configuration } from "./configuration";
import { i18n } from "./utils/I18N";

export async function handler(event: RequestEnvelope, context: any, callback: any): Promise<ResponseEnvelope> {

  const LaunchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput: HandlerInput) {
      const request = handlerInput.requestEnvelope.request;

      return handlerInput.attributesManager.getPersistentAttributes()
        .then((attributes) => {
          // Check if user is invoking the skill the first time and initialize preset values
          if (attributes === undefined || Object.keys(attributes).length === 0) {
            attributes = {
              lastPlayed: 0,
              playedCount: 0
            };
            handlerInput.attributesManager.setPersistentAttributes(attributes);
          }

          let lastPlayedEPOCH:number = attributes.lastPlayed;

          let message_tag:string = "WELCOME_MSG";

          if(lastPlayedEPOCH > 0)
            message_tag = "WELCOME_MSG_RETURN";

          return ResponseFactory.init()
            .speak(i18n.S(request, message_tag, 'Parliament'))
            .reprompt(i18n.S(request, "WELCOME_MSG_REPROMPT"))
            .withShouldEndSession(true)
            .getResponse();
        });
    }
  };

  const factory = SkillBuilders.standard()
    .addRequestHandlers(LaunchRequestHandler)
    .withAutoCreateTable(true)
    .withTableName(Configuration.dbTableName);

  if (Configuration.useLocalDB) {
    const ddbClient = new AWS.DynamoDB({
      endpoint: 'http://localhost:8000'
    });

    factory.withDynamoDbClient(ddbClient);
  }

  let skill = factory.create();

  try {

    if (Configuration.debug) {
      console.log("\n" + "******************* REQUEST  **********************");
      console.log(JSON.stringify(event, null, 2));
    }

    const responseEnvelope: ResponseEnvelope = await skill.invoke(event, context);

    if (Configuration.debug) {
      console.log("\n" + "******************* RESPONSE  **********************");
      console.log(JSON.stringify(responseEnvelope, null, 2));
    }

    return callback(null, responseEnvelope);

  } catch (error) {
    if (Configuration.debug) {
      console.log(JSON.stringify(error, null, 2));
    }
    return callback(error);
  }
}