import dayjs from 'dayjs/esm';

import { IOwner, NewOwner } from './owner.model';

export const sampleWithRequiredData: IOwner = {
  id: 3581,
  firstName: 'Gregoria',
  lastName: 'Erdman',
  address: 'obediently',
  city: 'Charlottesville',
  telephone: '1-830-890-2979 x7402',
};

export const sampleWithPartialData: IOwner = {
  id: 15531,
  firstName: 'Sydni',
  lastName: 'Stroman',
  address: 'dreamily',
  city: 'Davionworth',
  telephone: '(977) 307-3903',
  createdBy: 'oof',
  createdDate: dayjs('2020-06-27T04:48'),
  lastModifiedBy: 'snack',
};

export const sampleWithFullData: IOwner = {
  id: 26949,
  firstName: 'August',
  lastName: 'Barton',
  address: 'honestly when evenly',
  city: 'Pocatello',
  telephone: '1-422-319-2578 x483',
  createdBy: 'substantiate',
  createdDate: dayjs('2020-06-26T07:41'),
  lastModifiedBy: 'sonata forenenst fooey',
  lastModifiedDate: dayjs('2020-06-27T03:36'),
};

export const sampleWithNewData: NewOwner = {
  firstName: 'Mae',
  lastName: 'Shanahan',
  address: 'consequently youthfully',
  city: 'Fort Yasmine',
  telephone: '485-389-3348 x278',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
