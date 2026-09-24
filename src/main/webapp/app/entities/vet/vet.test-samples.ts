import dayjs from 'dayjs/esm';

import { IVet, NewVet } from './vet.model';

export const sampleWithRequiredData: IVet = {
  id: 2514,
  firstName: 'Nathan',
  lastName: 'Pouros',
};

export const sampleWithPartialData: IVet = {
  id: 21487,
  firstName: 'Alexa',
  lastName: 'Gibson-Klocko',
  createdBy: 'urgently pish',
  createdDate: dayjs('2020-06-26T23:50'),
};

export const sampleWithFullData: IVet = {
  id: 29795,
  firstName: 'Hubert',
  lastName: 'Reinger',
  createdBy: 'afore or usually',
  createdDate: dayjs('2020-06-26T13:17'),
  lastModifiedBy: 'elderly thrifty',
  lastModifiedDate: dayjs('2020-06-27T01:11'),
};

export const sampleWithNewData: NewVet = {
  firstName: 'Joana',
  lastName: 'McClure',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
