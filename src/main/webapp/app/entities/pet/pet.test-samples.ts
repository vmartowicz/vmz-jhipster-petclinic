import dayjs from 'dayjs/esm';

import { IPet, NewPet } from './pet.model';

export const sampleWithRequiredData: IPet = {
  id: 19355,
  name: 'though scientific',
};

export const sampleWithPartialData: IPet = {
  id: 31021,
  name: 'embed yippee within',
  createdBy: 'phew',
  createdDate: dayjs('2020-06-27T05:40'),
  lastModifiedBy: 'after',
};

export const sampleWithFullData: IPet = {
  id: 10888,
  name: 'dead now',
  birthDate: dayjs('2020-06-26'),
  createdBy: 'remand boohoo bah',
  createdDate: dayjs('2020-06-26T09:24'),
  lastModifiedBy: 'longingly fedora pish',
  lastModifiedDate: dayjs('2020-06-26T07:51'),
};

export const sampleWithNewData: NewPet = {
  name: 'other so',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
