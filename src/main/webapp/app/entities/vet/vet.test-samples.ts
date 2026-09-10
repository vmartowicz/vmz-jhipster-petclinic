import dayjs from 'dayjs/esm';

import { IVet, NewVet } from './vet.model';

export const sampleWithRequiredData: IVet = {
  id: 2514,
  firstName: 'Zena',
  lastName: 'Reichert',
};

export const sampleWithPartialData: IVet = {
  id: 21487,
  firstName: 'Dudley',
  lastName: 'Bartell',
  createdBy: 'skeleton',
  createdDate: dayjs('2020-06-26T21:00'),
};

export const sampleWithFullData: IVet = {
  id: 29795,
  firstName: 'Willy',
  lastName: 'Koch',
  createdBy: 'sans',
  createdDate: dayjs('2020-06-26T21:52'),
  lastModifiedBy: 'worriedly',
  lastModifiedDate: dayjs('2020-06-26T19:50'),
};

export const sampleWithNewData: NewVet = {
  firstName: 'Jada',
  lastName: 'Koss',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
