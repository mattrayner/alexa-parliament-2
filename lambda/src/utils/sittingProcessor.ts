'use strict';
enum TranslationKey {
  Both = 'both',
  Commons = 'commons_only',
  Lords = 'lords_only',
  Neither = 'neither'
}

export interface SittingData {
  lords: boolean,
  commons: boolean,
  translation_key: TranslationKey
}

export interface NonSittingObject {
  Id: number,
  StartDate: string,
  EndDate: string,
  SummarisedDetails: string,
  StartTime: string,
  EndTime: string,
  Description: string,
  SortOrder: number,
  Category: string,
  Location: string,
  Type: string,
  House: string,
  CategoryCode: string
}

export function SittingProcessor(json: any): SittingData {
  let object: SittingData = {
    lords: true,
    commons: true,
    translation_key: TranslationKey.Both
  };

  json.forEach((nonSittingObject) => {
    if(nonSittingObject.House == 'Lords')
      object.lords = false;

    if(nonSittingObject.House == 'Commons')
      object.commons = false;
  });

  if(object.lords && !object.commons)
    object.translation_key = TranslationKey.Lords;

  if(!object.lords && object.commons)
    object.translation_key = TranslationKey.Commons;

  if(!object.lords && !object.commons)
    object.translation_key = TranslationKey.Neither;

  return object;
}