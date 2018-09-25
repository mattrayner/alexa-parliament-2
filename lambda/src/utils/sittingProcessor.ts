'use strict';
export enum TranslationKey {
  Both = 'both',
  Commons = 'commons_only',
  Lords = 'lords_only',
  Neither = 'neither',
  NeitherWithData = 'neither_with_data'
}

export interface SittingData {
  lords: {
    sitting: boolean,
    description: string
  },
  commons: {
    sitting: boolean,
    description: string
  },
  translation_key: TranslationKey,
  translation_data: string
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
    lords: {
      sitting: true,
      description: ''
    },
    commons: {
      sitting: true,
      description: ''
    },
    translation_key: TranslationKey.Both,
    translation_data: ''
  };

  json.forEach((nonSittingObject) => {
    if(nonSittingObject.House == 'Lords') {
      object.lords.sitting = false;

      if(typeof nonSittingObject.Description == 'string')
        object.lords.description = nonSittingObject.Description
    }

    if(nonSittingObject.House == 'Commons') {
      object.commons.sitting = false;

      if(typeof nonSittingObject.Description == 'string')
        object.commons.description = nonSittingObject.Description
    }
  });

  if(object.lords.sitting && !object.commons.sitting)
    object.translation_key = TranslationKey.Lords;

  if(!object.lords.sitting && object.commons.sitting)
    object.translation_key = TranslationKey.Commons;

  if(!object.lords.sitting && !object.commons.sitting) {

    if(object.lords.description == object.commons.description && object.lords.description.trim() != '') {
      object.translation_data = object.lords.description;
      object.translation_key = TranslationKey.NeitherWithData;
    } else {
      object.translation_key = TranslationKey.Neither;
    }
  }

  return object;
}