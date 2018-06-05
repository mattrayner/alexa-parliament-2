import * as AirbrakeClient from 'airbrake-js'
export interface FakeAirbrake {
  fake: boolean
  notify: () => void
}

export class FakeClient implements FakeAirbrake {
  fake = true;

  notify () {
  }
}

let airbrake: AirbrakeClient | FakeAirbrake;

if (process.env.NODE_ENV != 'test' && process.env.AIRBRAKE_PROJECT_ID && process.env.AIRBRAKE_PROJECT_KEY) {
  airbrake = new AirbrakeClient({
    projectId: process.env.AIRBRAKE_PROJECT_ID,
    projectKey: process.env.AIRBRAKE_PROJECT_KEY
  });
} else {
  airbrake = new FakeClient();
}

export const Airbrake = airbrake;
