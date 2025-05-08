import dayjs from 'dayjs/esm';
import { IVet } from 'app/entities/vet/vet.model';

export interface ISpecialty {
  id: number;
  name?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  vets?: Pick<IVet, 'id'>[] | null;
}

export type NewSpecialty = Omit<ISpecialty, 'id'> & { id: null };
