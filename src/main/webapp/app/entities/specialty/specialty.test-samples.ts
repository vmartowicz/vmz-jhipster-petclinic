import dayjs from 'dayjs/esm';

import { ISpecialty, NewSpecialty } from './specialty.model';

export const sampleWithRequiredData: ISpecialty = {
  id: 29677,
  name: 'hence',
};

export const sampleWithPartialData: ISpecialty = {
  id: 26857,
  name: 'knowledgeably fairly',
  createdBy: 'since cake',
  createdDate: dayjs('2020-06-26T11:57'),
};

export const sampleWithFullData: ISpecialty = {
  id: 13590,
  name: 'except',
  createdBy: 'holster bah',
  createdDate: dayjs('2020-06-26T16:32'),
  lastModifiedBy: 'across afraid monthly',
  lastModifiedDate: dayjs('2020-06-26T15:25'),
};

export const sampleWithNewData: NewSpecialty = {
  name: 'eek while yet',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
