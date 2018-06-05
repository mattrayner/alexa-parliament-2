'use strict';

const englishStrings = {
  ".launch_request.welcome": "Welcome to Parliament. Say, 'what's on', to find out whats happening today at the Houses of Parliament. Say, who's my MP, to find out information about your MP. Or say, 'help', for more information.",
  ".launch_request.return": "Welcome back to Parliament. Try saying what's on, who's my MP, or help.",
  ".launch_request.reprompt": "Try saying, 'what's on', or, who's my MP.",

  ".help_intent.text": "Parliament for Alexa, can tell you what's on today at the Houses of Parliament, or tell you who your MP is. Try saying, 'what's on', to hear about the events at both houses. Alternatively, say, 'whats on at the commons', or, 'whats on in the lords', to hear about the events at a specific house. To find out who your MP is, try saying, who's my MP.",
  ".help_intent.reprompt": "Try saying, 'what's on', or, who's my MP.",

  ".find_my_mp_intent.request_permission": "Please enable Location permissions in the Amazon Alexa app.",
  ".find_my_mp_intent.location_failure": "There was a problem getting your postcode from Amazon. Please try again later.",
  ".find_my_mp_intent.no_address": "I was unable to get the address for this device. Check that you've set and address for this device within your Alexa app.",
  ".find_my_mp_intent.parliament_error": "I was unable to reach Parliament. Please try again later.",
  ".find_my_mp_intent.mp_error": "Hmm, there was a problem. Please try again later.",
  ".find_my_mp_intent.no_information": "I was unable to find any information for {0}.",
  ".find_my_mp_intent.no_mp_for_location": "I couldn't find an MP for {0}.",
  ".find_my_mp_intent.mp_for_location": "The MP for {0}, is {1}.",
  ".find_my_mp_intent.mp_for_location_and_incumbency": "The MP for {0}, is {1}. Your MP was elected on <say-as interpret-as=\"date\" format=\"dmy\">{2}</say-as>.",
  ".find_my_mp_intent.mp_for_location_and_party": "The MP for {0}, is {1}. Your MP is a member of the {3} party.",
  ".find_my_mp_intent.mp_for_location_party_and_incumbency": "The MP for {0}, is {1}. Your MP is a member of the {3} party, and was elected on <say-as interpret-as=\"date\" format=\"dmy\">{2}</say-as>.",

  ".unhandled_intent.text": "Unhandled stuff",
  ".unhandled_intent.reprompt": "Unhandled reprompt",

  "TEST": "test english",
  "TEST_PARAMS": "test with parameters {0} and {1}",
};

const frenchStrings = {
  ".launch_request.welcome": "~",
  ".launch_request.return": "~",
  ".launch_request.reprompt": "~",

  ".help_intent.text": "~",
  ".help_intent.reprompt": "~",

  ".find_my_mp_intent.request_permission": "~",
  ".find_my_mp_intent.location_failure": "~",
  ".find_my_mp_intent.no_address": "~",
  ".find_my_mp_intent.parliament_error": "~",
  ".find_my_mp_intent.mp_error": "~",
  ".find_my_mp_intent.no_information": "~",
  ".find_my_mp_intent.no_mp_for_location": "~",
  ".find_my_mp_intent.mp_for_location": "~",
  ".find_my_mp_intent.mp_for_location_and_incumbency": "~",
  ".find_my_mp_intent.mp_for_location_and_party": "~",
  ".find_my_mp_intent.mp_for_location_party_and_incumbency": "~",

  ".unhandled_intent.text": "~",
  ".unhandled_intent.reprompt": "~",

  "TEST": "test français",
  "TEST_PARAMS": "test avec paramètres {0} et {1}",
};

export const strings = {
  "en-GB": englishStrings,
  "en-US": englishStrings,
  "en-IN": englishStrings,
  "en-CA": englishStrings,
  "en-AU": englishStrings,
  "fr-FR": frenchStrings
};
