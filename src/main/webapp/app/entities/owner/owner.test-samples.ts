import dayjs from 'dayjs/esm';

import { IOwner, NewOwner } from './owner.model';

export const sampleWithRequiredData: IOwner = {
  id: 3581,
  firstName: 'Bertrand',
  lastName: 'Hoeger',
  address: 'couch',
  city: 'North Kacieside',
  telephone: '1-983-289-0297',
};

export const sampleWithPartialData: IOwner = {
  id: 15531,
  firstName: 'Ernest',
  lastName: 'Volkman',
  address: 'whack',
  city: 'Danbury',
  telephone: '1-661-395-9771',
  createdBy: 'drag',
  createdDate: dayjs('2020-06-26T11:09'),
  lastModifiedBy: 'absentmindedly',
};

export const sampleWithFullData: IOwner = {
  id: 26949,
  firstName: 'Janice',
  lastName: 'Brakus',
  address: 'readily',
  city: 'Haagborough',
  telephone: '920.647.6559',
  createdBy: 'barring what toe',
  createdDate: dayjs('2020-06-26T15:11'),
  lastModifiedBy: 'yuck but invite',
  lastModifiedDate: dayjs('2020-06-26T16:40'),
};

export const sampleWithNewData: NewOwner = {
  firstName: 'Dallin',
  lastName: "O'Kon",
  address: 'despite',
  city: 'Lake Camronstead',
  telephone: '1-277-592-9009 x1385',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
