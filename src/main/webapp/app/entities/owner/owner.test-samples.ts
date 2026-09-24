import dayjs from 'dayjs/esm';

import { IOwner, NewOwner } from './owner.model';

export const sampleWithRequiredData: IOwner = {
  id: 3581,
  firstName: 'Helen',
  lastName: 'Erdman',
  address: 'obediently',
  city: 'Charlottesville',
  telephone: '1-830-890-2979 x7402',
};

export const sampleWithPartialData: IOwner = {
  id: 15531,
  firstName: 'Taurean',
  lastName: 'Stroman',
  address: 'dreamily',
  city: 'Darrylworth',
  telephone: '977-307-3903 x1212',
  createdBy: 'officially worth',
  createdDate: dayjs('2020-06-27T06:27'),
  lastModifiedBy: 'haversack',
};

export const sampleWithFullData: IOwner = {
  id: 26949,
  firstName: 'Austyn',
  lastName: 'Barton',
  address: 'honestly when evenly',
  city: 'Pocatello',
  telephone: '(422) 319-2578 x4832',
  createdBy: 'rightfully sonata forenenst',
  createdDate: dayjs('2020-06-27T00:22'),
  lastModifiedBy: 'dislocate thoughtfully',
  lastModifiedDate: dayjs('2020-06-26T14:54'),
};

export const sampleWithNewData: NewOwner = {
  firstName: 'Marjorie',
  lastName: 'Shanahan',
  address: 'consequently youthfully',
  city: 'Fort Wendy',
  telephone: '(485) 389-3348',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
