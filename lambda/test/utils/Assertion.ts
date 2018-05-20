'use strict';

import {ResponseEnvelope, Response, ui} from 'ask-sdk-model'
import {expect} from 'chai';

export class Assertion {
  correctResponseStructure(response: ResponseEnvelope): void {
    expect(response).to.have.property("version");
    expect(response.version).to.be.equal("1.0");
    expect(response).to.have.property("response");
  }

  correctOutputSpeechStructure(response: ResponseEnvelope): void {
    expect(response).to.have.property("response");
    let r: Response = <Response>response.response;

    expect(r).to.have.property("outputSpeech");
    expect(r.outputSpeech).to.have.property("type");
    expect(r.outputSpeech.type).to.equal('SSML');
    expect(r.outputSpeech).to.have.property("ssml");

    let os = <ui.SsmlOutputSpeech>r.outputSpeech;
    expect(os.ssml).to.match(/^<speak>/); // startWith('<speak>');
    expect(os.ssml).to.match(/<\/speak>$/); //.endWith('</speak>');
  }

  correctOutputSpeechIncludesText(response: ResponseEnvelope, text: string): void {
    let os = <ui.SsmlOutputSpeech>response.response.outputSpeech;
    expect(os.ssml).to.contains(text);
  }

  correctOutputSpeechDoesNotIncludeText(response: ResponseEnvelope, text: string): void {
    let os = <ui.SsmlOutputSpeech>response.response.outputSpeech;
    expect(os.ssml).to.not.contains(text);
  }

  correctSessionStatus(response: ResponseEnvelope, shouldEndSession: boolean): void {
    let r: Response = <Response>response.response;
    expect(r).to.have.property("shouldEndSession");
    expect(r.shouldEndSession).to.equal(shouldEndSession);
  }

  includesStandardCard(response: ResponseEnvelope): void {
    let r: Response = <Response>response.response;
    expect(r).to.have.property("card");
    expect(r.card.type).to.equal('Standard');
    expect((<ui.StandardCard>r.card).text).to.not.be.equal('');
    expect((<ui.StandardCard>r.card).title).to.not.be.equal('');
  }

  correctRepromptSpeechStructure(response: ResponseEnvelope): void {
    expect(response).to.have.property("response");
    let r: Response = <Response>response.response;

    expect(r).to.have.property("reprompt");
    expect(r.reprompt).to.have.property("outputSpeech");
    expect(r.reprompt.outputSpeech).to.have.property("type");
    expect(r.reprompt.outputSpeech.type).to.equal('SSML');
    expect(r.reprompt.outputSpeech).to.have.property("ssml");
    let os = <ui.SsmlOutputSpeech>r.reprompt.outputSpeech;
    expect(os.ssml).to.match(/^<speak>/); // startWith('<speak>');
    expect(os.ssml).to.match(/<\/speak>$/); //.endWith('</speak>');
  }

  correctRepromptSpeechIncludesText(response: ResponseEnvelope, text: string): void {
    let os = <ui.SsmlOutputSpeech>response.response.reprompt.outputSpeech;
    expect(os.ssml).to.contains(text);
  }

  repromptSpeechNotIncluded(response: ResponseEnvelope): void {
    expect(response).to.have.property("response");
    let r: Response = <Response>response.response;
    expect(r).to.not.have.property("reprompt");
  }
}