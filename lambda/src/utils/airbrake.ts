import * as AirbrakeClient from 'airbrake-js'

class FakeAirbrake {
  notify(param) {}
}

let airbrake:AirbrakeClient|FakeAirbrake;

if( process.env.NODE_ENV != 'test' && process.env.AIRBRAKE_PROJECT_ID && process.env.AIRBRAKE_PROJECT_KEY ) {
  airbrake = new AirbrakeClient({projectId: process.env.AIRBRAKE_PROJECT_ID, projectKey: process.env.AIRBRAKE_PROJECT_KEY});
} else {
  airbrake = new FakeAirbrake
}

export const Airbrake = airbrake;