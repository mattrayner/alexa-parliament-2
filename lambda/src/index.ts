'use strict';

import * as AWS from 'aws-sdk';
import { HandlerInput, RequestHandler, ResponseFactory, SkillBuilders } from 'ask-sdk';
import { RequestEnvelope, Response, ResponseEnvelope } from 'ask-sdk-model';
import { Configuration } from './configuration';
import { i18n } from './utils/I18N';
import { winston } from './utils/logger';
import { NtripleClient } from './clients/ntriple-client';
import { Airbrake } from './utils/airbrake';
import { MPInformation, PostcodeProcessor } from './utils/postcodeProcessor';
import { NonSittingObject, SittingData, SittingProcessor } from './utils/sittingProcessor';
import { JsonClient } from "./clients/json-client";
import { JsonResponseObject } from "./clients/shared";
import { ResponseBuilder } from "../dist/node_modules/ask-sdk-core/dist";

const PERMISSIONS: string[] = [ 'read::alexa:device:all:address:country_and_postal_code' ];
const NTRIPLE_ENDPOINT: string = 'beta.parliament.uk';
const CALENDAR_ENDPOINT: string = 'service.calendar.parliament.uk';

export async function handler(event: RequestEnvelope, context: any, callback: any, configuration: Configuration = new Configuration()): Promise<ResponseEnvelope> {
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
              lastLaunched: new Date().getTime(),
              playedCount: 0
            };
            handlerInput.attributesManager.setPersistentAttributes(attributes);
          }

          let lastLaunchedEPOCH: number = attributes.lastLaunched;

          let message_tag: string = '.launch_request.welcome';

          let long_form_launch_threshold = (new Date().getTime()) - configuration.longformLaunchThreshold;

          if (lastLaunchedEPOCH < long_form_launch_threshold)
            message_tag = '.launch_request.return';

          let response: Response = ResponseFactory.init()
            .speak(i18n.S(request, message_tag, 'Parliament'))
            .reprompt(i18n.S(request, '.launch_request.reprompt'))
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

      let response: Response = ResponseFactory.init()
        .speak(i18n.S(request, '.help_intent.text'))
        .reprompt(i18n.S(request, '.help_intent.reprompt'))
        .getResponse();

      return response;
    }
  };

  const FindMyMPIntent = {
    canHandle(handlerInput) {
      const { request } = handlerInput.requestEnvelope;

      return request.type === 'IntentRequest' && request.intent.name === 'FindMyMPIntent';
    },
    async handle(handlerInput) {
      const { requestEnvelope, serviceClientFactory, responseBuilder } = handlerInput;
      let response = responseBuilder.withShouldEndSession(true);

      const consentToken = requestEnvelope.context.System.user.permissions
        && requestEnvelope.context.System.user.permissions.consentToken;

      if (!consentToken) {
        return response
          .speak(i18n.S(requestEnvelope.request, '.find_my_mp_intent.request_permission'))
          .withAskForPermissionsConsentCard(PERMISSIONS)
          .getResponse();
      }
      try {
        const { deviceId } = requestEnvelope.context.System.device;
        const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
        const address = await deviceAddressServiceClient.getCountryAndPostalCode(deviceId);

        winston.debug(address);

        if (address.countryCode != 'GB' || address.postalCode == null) {
          return response
            .speak(i18n.S(requestEnvelope.request, '.find_my_mp_intent.no_address'))
            .getResponse();
        }

        winston.info('Address successfully retrieved, now requesting to Parliament.');

        const ntripleClient = new NtripleClient(NTRIPLE_ENDPOINT);

        let uri_postcode = address.postalCode.replace(' ', '%20');
        let ssml_postcode = address.postalCode;

        try {
          let ntripleResponse = await ntripleClient.getTripleStore(`/postcodes/${uri_postcode}`);

          switch (ntripleResponse.statusCode) {
            case 200:
              winston.info("Parliament response received");

              // Quick exit if we have no data for the given postcode.
              if (ntripleResponse.store.size === 0) {
                winston.debug('No triples in store for postcode');
                return response.speak(i18n.S(requestEnvelope.request, '.find_my_mp_intent.no_mp_for_location', ssml_postcode)).getResponse();
              }

              let object: MPInformation = PostcodeProcessor(ntripleResponse.store);

              winston.info('Triples processed into MPInformation');

              // Default our location to the postcode i.e. 'SW1A 0AA'
              let location = ssml_postcode;
              if (object.constituency) { // If a constituency is available, use that instead i.e. 'Cities of London and Westminster'
                location = object.constituency
              }

              if (!object.member) {
                return response.speak(i18n.S(requestEnvelope.request, '.find_my_mp_intent.no_mp_for_location', location)).getResponse();
              }

              if (!object.party) {
                if (object.incumbency) {
                  return response.speak(i18n.S(requestEnvelope.request, '.find_my_mp_intent.mp_for_location_and_incumbency', location, object.member, object.incumbency)).getResponse();
                } else {
                  return response.speak(i18n.S(requestEnvelope.request, '.find_my_mp_intent.mp_for_location', location, object.member)).getResponse();
                }
              }

              if (object.party && object.incumbency) {
                return response.speak(i18n.S(requestEnvelope.request, '.find_my_mp_intent.mp_for_location_party_and_incumbency', location, object.member, object.incumbency, object.party)).getResponse();
              }

              return response.speak(i18n.S(requestEnvelope.request, '.find_my_mp_intent.mp_for_location_and_party', location, object.member, null, object.party)).getResponse();
            case 404:
              winston.debug("Don't know about that postcode (404)");
              return response
                .speak(i18n.S(requestEnvelope.request, '.find_my_mp_intent.no_information', ssml_postcode))
                .getResponse();
            default:
              winston.error(`Other error - got status code ${ntripleResponse.statusCode}`);
              return response
                .speak(i18n.S(requestEnvelope.request, '.find_my_mp_intent.no_information', ssml_postcode))
                .getResponse();
          }
        } catch (error) {
          Airbrake.notify({
            error: error,
            context: { component: 'NtripleClient' },
            environment: { nodeEnv: process.env.NODE_ENV },
            param: { postcode: ssml_postcode },
            session: { requestId: requestEnvelope.request.requestId }
          });

          winston.error(error);

          return response
            .speak(i18n.S(requestEnvelope.request, '.parliament_error'))
            .getResponse();
        }
      } catch (error) {
        Airbrake.notify({
          error: error,
          context: { component: 'deviceAddressServiceClient' },
          environment: { nodeEnv: process.env.NODE_ENV },
          param: {},
          session: { requestId: requestEnvelope.request.requestId }
        });

        winston.error(error);

        if (error.name === 'ServiceError')
          return response.speak(i18n.S(requestEnvelope.request, '.find_my_mp_intent.location_failure')).getResponse();

        throw error;
      }
    }
  };

  const SittingRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'SittingIntent';
    },
    async handle(handlerInput: HandlerInput) {
      const request = handlerInput.requestEnvelope.request;
      let response: ResponseBuilder = ResponseFactory.init().withShouldEndSession(true)

      const jsonClient: JsonClient = new JsonClient(CALENDAR_ENDPOINT, false);
      const apiPath: string = '/calendar/events/nonsitting.json?date=today';

      try {
        let jsonResponse:JsonResponseObject = await jsonClient.getJSON(apiPath);

        switch (jsonResponse.statusCode) {
          case 200:
            let sittingObject: SittingData = SittingProcessor(jsonResponse.json);

            let message_tag = `.sitting_intent.${sittingObject.translation_key}`;

            return response.speak(i18n.S(request, message_tag))
              .getResponse();
          default:
            winston.error(`Other error - got status code ${jsonResponse.statusCode}`);
            return response
              .speak(i18n.S(request, '.parliament_error'))
              .getResponse();
        }
      } catch (error) {
        Airbrake.notify({
          error: error,
          context: { component: 'JsonClient' },
          environment: { nodeEnv: process.env.NODE_ENV },
          param: { path: apiPath },
          session: { requestId: request.requestId }
        });

        winston.error(error);

        let response: Response = ResponseFactory.init()
          .speak(i18n.S(request, '.parliament_error'))
          .getResponse();

        return response;
      }
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

      Airbrake.notify({
        error: 'UhandledIntent fired',
        context: {},
        environment: { nodeEnv: process.env.NODE_ENV },
        param: {},
        session: { requestId: request.requestId }
      });

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
      FindMyMPIntent,
      SittingRequestHandler,
      SessionEndedRequestHandler,
      UnhandledIntent
    )
    .withAutoCreateTable(false)
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
      winston.debug("\n" + "******************* REQUEST  **********************");
      winston.debug(JSON.stringify(event, null, 2));
    }

    const responseEnvelope: ResponseEnvelope = await skill.invoke(event, context);

    if (configuration.debug) {
      winston.debug("\n" + "******************* RESPONSE  **********************");
      winston.debug(JSON.stringify(responseEnvelope, null, 2));
    }

    return callback(null, responseEnvelope);
  } catch (error) {
    if (configuration.debug) {
      winston.error(JSON.stringify(error, null, 2));
    }

    return callback(error);
  }
}