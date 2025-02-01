import dayjs from 'dayjs/esm';

export interface IPetType {
  id: number;
  name?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewPetType = Omit<IPetType, 'id'> & { id: null };
