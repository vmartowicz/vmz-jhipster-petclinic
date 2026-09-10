import dayjs from 'dayjs/esm';

export interface IOwner {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  address?: string | null;
  city?: string | null;
  telephone?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewOwner = Omit<IOwner, 'id'> & { id: null };
