import dayjs from 'dayjs/esm';
import { ISpecialty } from 'app/entities/specialty/specialty.model';

export interface IVet {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  specialties?: Pick<ISpecialty, 'id' | 'name'>[] | null;
}

export type NewVet = Omit<IVet, 'id'> & { id: null };
