'use strict';

import * as AWS from 'aws-sdk';
import { ResponseFactory, SkillBuilders, RequestHandler, HandlerInput } from 'ask-sdk';
import { RequestEnvelope, ResponseEnvelope, Response } from 'ask-sdk-model';
import { Configuration } from "./configuration";
import { i18n } from "./utils/I18N";

export async function handler(event: RequestEnvelope, context: any, callback: any, configuration:Configuration=Configuration): Promise<ResponseEnvelope> {
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
              lastLaunched: 0,
              playedCount: 0
            };
            handlerInput.attributesManager.setPersistentAttributes(attributes);
          }

          let lastLaunchedEPOCH:number = attributes.lastLaunched;

          let message_tag:string = ".launch_request.welcome";

          if(lastLaunchedEPOCH > 0)
            message_tag = ".launch_request.return";

          let response:Response = ResponseFactory.init()
              .speak(i18n.S(request, message_tag, 'Parliament'))
              .reprompt(i18n.S(request, ".launch_request.reprompt"))
              .getResponse();

          return response;
        });
    }
  };

  const HelpRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput: HandlerInput) {
      const request = handlerInput.requestEnvelope.request;

      let response:Response = ResponseFactory.init()
        .speak(i18n.S(request, '.help_intent.text'))
        .reprompt(i18n.S(request, ".help_intent.reprompt"))
        .getResponse();

      return response;
    }
  };

  const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder.getResponse();
    },
  };

  const UnhandledIntent = {
    canHandle() {
      return true;
    },
    handle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;

      return handlerInput.responseBuilder
        .speak(i18n.S(request, '.unhandled_intent.text'))
        .reprompt(i18n.S(request, '.unhandled_intent.reprompt'))
        .getResponse();
    },
  };

  const factory = SkillBuilders.standard()
    .addRequestHandlers(
      LaunchRequestHandler,
      HelpRequestHandler,
      SessionEndedRequestHandler,
      UnhandledIntent
    )
    .withAutoCreateTable(true)
    .withTableName(configuration.dbTableName);

  if (configuration.useLocalDB) {
    const ddbClient = new AWS.DynamoDB({
      endpoint: 'http://localhost:8000'
    });

    factory.withDynamoDbClient(ddbClient);
  }

  let skill = factory.create();

  try {

    if (configuration.debug) {
      console.log("\n" + "******************* REQUEST  **********************");
      console.log(JSON.stringify(event, null, 2));
    }

    const responseEnvelope: ResponseEnvelope = await skill.invoke(event, context);

    if (configuration.debug) {
      console.log("\n" + "******************* RESPONSE  **********************");
      console.log(JSON.stringify(responseEnvelope, null, 2));
    }

    return callback(null, responseEnvelope);

  } catch (error) {
    if (configuration.debug) {
      console.log(JSON.stringify(error, null, 2));
    }
    return callback(error);
  }
}