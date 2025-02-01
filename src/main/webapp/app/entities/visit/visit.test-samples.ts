import dayjs from 'dayjs/esm';

import { IVisit, NewVisit } from './visit.model';

export const sampleWithRequiredData: IVisit = {
  id: 29630,
  description: 'qua ditch blindly',
};

export const sampleWithPartialData: IVisit = {
  id: 11422,
  description: 'husband aboard',
  createdDate: dayjs('2020-06-26T15:54'),
  lastModifiedBy: 'unless cluttered',
  lastModifiedDate: dayjs('2020-06-27T05:35'),
};

export const sampleWithFullData: IVisit = {
  id: 19427,
  visitDate: dayjs('2020-06-27'),
  description: 'ouch yippee',
  createdBy: 'icy whoa aboard',
  createdDate: dayjs('2020-06-27T04:07'),
  lastModifiedBy: 'miserly alongside',
  lastModifiedDate: dayjs('2020-06-26T17:24'),
};

export const sampleWithNewData: NewVisit = {
  description: 'mythology worth though',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
