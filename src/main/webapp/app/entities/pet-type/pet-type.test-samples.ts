import dayjs from 'dayjs/esm';

import { IPetType, NewPetType } from './pet-type.model';

export const sampleWithRequiredData: IPetType = {
  id: 29859,
  name: 'amid',
};

export const sampleWithPartialData: IPetType = {
  id: 27797,
  name: 'replicate',
};

export const sampleWithFullData: IPetType = {
  id: 22043,
  name: 'or blacken jealous',
  createdBy: 'phooey whisper',
  createdDate: dayjs('2020-06-26T23:53'),
  lastModifiedBy: 'requite among',
  lastModifiedDate: dayjs('2020-06-27T06:45'),
};

export const sampleWithNewData: NewPetType = {
  name: 'gah incidentally',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
