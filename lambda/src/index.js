'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var AWS = require("aws-sdk");
var ask_sdk_1 = require("ask-sdk");
var configuration_1 = require("./configuration");
var I18N_1 = require("./utils/I18N");
var logger_1 = require("./utils/logger");
var ntriple_client_1 = require("./clients/ntriple-client");
var airbrake_1 = require("./utils/airbrake");
var postcodeProcessor_1 = require("./utils/postcodeProcessor");
var PERMISSIONS = ['read::alexa:device:all:address:country_and_postal_code'];
var NTRIPLE_ENDPOINT = 'beta.parliament.uk';
function handler(event, context, callback, configuration) {
    if (configuration === void 0) { configuration = new configuration_1.Configuration(); }
    return __awaiter(this, void 0, void 0, function () {
        var LaunchRequestHandler, HelpRequestHandler, FindMyMPIntent, SessionEndedRequestHandler, UnhandledIntent, factory, ddbClient, skill, responseEnvelope, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    LaunchRequestHandler = {
                        canHandle: function (handlerInput) {
                            return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
                        },
                        handle: function (handlerInput) {
                            var request = handlerInput.requestEnvelope.request;
                            return handlerInput.attributesManager.getPersistentAttributes()
                                .then(function (attributes) {
                                // Check if user is invoking the skill the first time and initialize preset values
                                if (attributes === undefined || Object.keys(attributes).length === 0) {
                                    attributes = {
                                        lastLaunched: new Date().getTime(),
                                        playedCount: 0
                                    };
                                    handlerInput.attributesManager.setPersistentAttributes(attributes);
                                }
                                var lastLaunchedEPOCH = attributes.lastLaunched;
                                var message_tag = '.launch_request.welcome';
                                var long_form_launch_threshold = (new Date().getTime()) - configuration.longformLaunchThreshold;
                                if (lastLaunchedEPOCH < long_form_launch_threshold)
                                    message_tag = '.launch_request.return';
                                var response = ask_sdk_1.ResponseFactory.init()
                                    .speak(I18N_1.i18n.S(request, message_tag, 'Parliament'))
                                    .reprompt(I18N_1.i18n.S(request, '.launch_request.reprompt'))
                                    .getResponse();
                                return response;
                            });
                        }
                    };
                    HelpRequestHandler = {
                        canHandle: function (handlerInput) {
                            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                                && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
                        },
                        handle: function (handlerInput) {
                            var request = handlerInput.requestEnvelope.request;
                            var response = ask_sdk_1.ResponseFactory.init()
                                .speak(I18N_1.i18n.S(request, '.help_intent.text'))
                                .reprompt(I18N_1.i18n.S(request, '.help_intent.reprompt'))
                                .getResponse();
                            return response;
                        }
                    };
                    FindMyMPIntent = {
                        canHandle: function (handlerInput) {
                            var request = handlerInput.requestEnvelope.request;
                            return request.type === 'IntentRequest' && request.intent.name === 'FindMyMPIntent';
                        },
                        handle: function (handlerInput) {
                            return __awaiter(this, void 0, void 0, function () {
                                var requestEnvelope, serviceClientFactory, responseBuilder, response, consentToken, deviceId, deviceAddressServiceClient, address, ntripleClient, uri_postcode, ssml_postcode, ntripleResponse, object, location, error_2, error_3;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            requestEnvelope = handlerInput.requestEnvelope, serviceClientFactory = handlerInput.serviceClientFactory, responseBuilder = handlerInput.responseBuilder;
                                            response = responseBuilder.withShouldEndSession(true);
                                            consentToken = requestEnvelope.context.System.user.permissions
                                                && requestEnvelope.context.System.user.permissions.consentToken;
                                            if (!consentToken) {
                                                return [2 /*return*/, response
                                                        .speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.request_permission'))
                                                        .withAskForPermissionsConsentCard(PERMISSIONS)
                                                        .getResponse()];
                                            }
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 7, , 8]);
                                            deviceId = requestEnvelope.context.System.device.deviceId;
                                            deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
                                            return [4 /*yield*/, deviceAddressServiceClient.getCountryAndPostalCode(deviceId)];
                                        case 2:
                                            address = _a.sent();
                                            logger_1.winston.debug(address);
                                            if (address.countryCode != 'GB' || address.postalCode == null) {
                                                return [2 /*return*/, response
                                                        .speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.no_address'))
                                                        .getResponse()];
                                            }
                                            logger_1.winston.info('Address successfully retrieved, now requesting to Parliament.');
                                            ntripleClient = new ntriple_client_1.NtripleClient(NTRIPLE_ENDPOINT);
                                            uri_postcode = address.postalCode.replace(' ', '%20');
                                            ssml_postcode = address.postalCode;
                                            _a.label = 3;
                                        case 3:
                                            _a.trys.push([3, 5, , 6]);
                                            return [4 /*yield*/, ntripleClient.getTripleStore("/postcodes/" + uri_postcode)];
                                        case 4:
                                            ntripleResponse = _a.sent();
                                            switch (ntripleResponse.statusCode) {
                                                case 200:
                                                    logger_1.winston.info("Parliament response received");
                                                    // Quick exit if we have no data for the given postcode.
                                                    if (ntripleResponse.store.size === 0) {
                                                        logger_1.winston.debug('No triples in store for postcode');
                                                        return [2 /*return*/, response.speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.no_mp_for_location', ssml_postcode)).getResponse()];
                                                    }
                                                    object = postcodeProcessor_1.PostcodeProcessor(ntripleResponse.store);
                                                    logger_1.winston.info('Triples processed into MPInformation');
                                                    location = ssml_postcode;
                                                    if (object.constituency) { // If a constituency is available, use that instead i.e. 'Cities of London and Westminster'
                                                        location = object.constituency;
                                                    }
                                                    if (!object.member) {
                                                        return [2 /*return*/, response.speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.no_mp_for_location', location)).getResponse()];
                                                    }
                                                    if (!object.party) {
                                                        if (object.incumbency) {
                                                            return [2 /*return*/, response.speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.mp_for_location_and_incumbency', location, object.member, object.incumbency)).getResponse()];
                                                        }
                                                        else {
                                                            return [2 /*return*/, response.speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.mp_for_location', location, object.member)).getResponse()];
                                                        }
                                                    }
                                                    if (object.party && object.incumbency) {
                                                        return [2 /*return*/, response.speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.mp_for_location_party_and_incumbency', location, object.member, object.incumbency, object.party)).getResponse()];
                                                    }
                                                    return [2 /*return*/, response.speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.mp_for_location_and_party', location, object.member, null, object.party)).getResponse()];
                                                case 404:
                                                    logger_1.winston.debug("Don't know about that postcode (404)");
                                                    return [2 /*return*/, response
                                                            .speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.no_information', ssml_postcode))
                                                            .getResponse()];
                                                default:
                                                    logger_1.winston.error("Other error - got status code " + ntripleResponse.statusCode);
                                                    return [2 /*return*/, response
                                                            .speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.no_information', ssml_postcode))
                                                            .getResponse()];
                                            }
                                            return [3 /*break*/, 6];
                                        case 5:
                                            error_2 = _a.sent();
                                            airbrake_1.Airbrake.notify({
                                                error: error_2,
                                                context: { component: 'NtripleClient' },
                                                environment: { nodeEnv: process.env.NODE_ENV },
                                                param: { postcode: ssml_postcode },
                                                session: { requestId: requestEnvelope.request.requestId }
                                            });
                                            logger_1.winston.error(error_2);
                                            return [2 /*return*/, response
                                                    .speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.parliament_error'))
                                                    .getResponse()];
                                        case 6: return [3 /*break*/, 8];
                                        case 7:
                                            error_3 = _a.sent();
                                            airbrake_1.Airbrake.notify({
                                                error: error_3,
                                                context: { component: 'deviceAddressServiceClient' },
                                                environment: { nodeEnv: process.env.NODE_ENV },
                                                param: {},
                                                session: { requestId: requestEnvelope.request.requestId }
                                            });
                                            logger_1.winston.error(error_3);
                                            if (error_3.name === 'ServiceError')
                                                return [2 /*return*/, response.speak(I18N_1.i18n.S(requestEnvelope.request, '.find_my_mp_intent.location_failure')).getResponse()];
                                            throw error_3;
                                        case 8: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                    };
                    SessionEndedRequestHandler = {
                        canHandle: function (handlerInput) {
                            return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
                        },
                        handle: function (handlerInput) {
                            return handlerInput.responseBuilder.getResponse();
                        }
                    };
                    UnhandledIntent = {
                        canHandle: function () {
                            return true;
                        },
                        handle: function (handlerInput) {
                            var request = handlerInput.requestEnvelope.request;
                            airbrake_1.Airbrake.notify({
                                error: 'UhandledIntent fired',
                                context: {},
                                environment: { nodeEnv: process.env.NODE_ENV },
                                param: {},
                                session: { requestId: request.requestId }
                            });
                            return handlerInput.responseBuilder
                                .speak(I18N_1.i18n.S(request, '.unhandled_intent.text'))
                                .reprompt(I18N_1.i18n.S(request, '.unhandled_intent.reprompt'))
                                .getResponse();
                        }
                    };
                    factory = ask_sdk_1.SkillBuilders.standard()
                        .addRequestHandlers(LaunchRequestHandler, HelpRequestHandler, FindMyMPIntent, SessionEndedRequestHandler, UnhandledIntent)
                        .withAutoCreateTable(true)
                        .withTableName(configuration.dbTableName);
                    if (configuration.useLocalDB) {
                        ddbClient = new AWS.DynamoDB({
                            endpoint: 'http://localhost:8000'
                        });
                        factory.withDynamoDbClient(ddbClient);
                    }
                    skill = factory.create();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (configuration.debug) {
                        logger_1.winston.debug("\n" + "******************* REQUEST  **********************");
                        logger_1.winston.debug(JSON.stringify(event, null, 2));
                    }
                    return [4 /*yield*/, skill.invoke(event, context)];
                case 2:
                    responseEnvelope = _a.sent();
                    if (configuration.debug) {
                        logger_1.winston.debug("\n" + "******************* RESPONSE  **********************");
                        logger_1.winston.debug(JSON.stringify(responseEnvelope, null, 2));
                    }
                    return [2 /*return*/, callback(null, responseEnvelope)];
                case 3:
                    error_1 = _a.sent();
                    if (configuration.debug) {
                        logger_1.winston.error(JSON.stringify(error_1, null, 2));
                    }
                    return [2 /*return*/, callback(error_1)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.handler = handler;
