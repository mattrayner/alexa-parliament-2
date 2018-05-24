'use strict';

let EnglishStrings = {
  ".launch_request.welcome" : "Welcome to {0}",
  ".launch_request.return"  : "Welcome back to {0}",
  ".launch_request.reprompt": "Reprompt",

  ".help_intent.text"     : "Help text",
  ".help_intent.reprompt" : "Help reprompt",

  ".unhandled_intent.text": "Unhandled stuff",
  ".unhandled_intent.reprompt": "Unhandled reprompt",

  "TEST"        : "test english",
  "TEST_PARAMS" : "test with parameters {0} and {1}",
};

let FrenchStrings = {
  "TEST"        : "test français",
  "TEST_PARAMS" : "test avec paramètres {0} et {1}",
};

export const strings = {
  "en-GB": EnglishStrings,
  "en-US": EnglishStrings,
  "en-IN": EnglishStrings,
  "en-CA": EnglishStrings,
  "en-AU": EnglishStrings,
  "fr-FR": FrenchStrings
};
