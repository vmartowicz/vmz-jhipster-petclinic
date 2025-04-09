import dayjs from 'dayjs/esm';
import { IPet } from 'app/entities/pet/pet.model';

export interface IVisit {
  id: number;
  visitDate?: dayjs.Dayjs | null;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  pet?: Pick<IPet, 'id' | 'name'> | null;
}

export type NewVisit = Omit<IVisit, 'id'> & { id: null };
