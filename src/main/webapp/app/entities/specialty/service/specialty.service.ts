import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISpecialty, NewSpecialty } from '../specialty.model';

export type PartialUpdateSpecialty = Partial<ISpecialty> & Pick<ISpecialty, 'id'>;

type RestOf<T extends ISpecialty | NewSpecialty> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestSpecialty = RestOf<ISpecialty>;

export type NewRestSpecialty = RestOf<NewSpecialty>;

export type PartialUpdateRestSpecialty = RestOf<PartialUpdateSpecialty>;

export type EntityResponseType = HttpResponse<ISpecialty>;
export type EntityArrayResponseType = HttpResponse<ISpecialty[]>;

@Injectable({ providedIn: 'root' })
export class SpecialtyService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/specialties');

  create(specialty: NewSpecialty): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(specialty);
    return this.http
      .post<RestSpecialty>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(specialty: ISpecialty): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(specialty);
    return this.http
      .put<RestSpecialty>(`${this.resourceUrl}/${this.getSpecialtyIdentifier(specialty)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(specialty: PartialUpdateSpecialty): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(specialty);
    return this.http
      .patch<RestSpecialty>(`${this.resourceUrl}/${this.getSpecialtyIdentifier(specialty)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSpecialty>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSpecialty[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSpecialtyIdentifier(specialty: Pick<ISpecialty, 'id'>): number {
    return specialty.id;
  }

  compareSpecialty(o1: Pick<ISpecialty, 'id'> | null, o2: Pick<ISpecialty, 'id'> | null): boolean {
    return o1 && o2 ? this.getSpecialtyIdentifier(o1) === this.getSpecialtyIdentifier(o2) : o1 === o2;
  }

  addSpecialtyToCollectionIfMissing<Type extends Pick<ISpecialty, 'id'>>(
    specialtyCollection: Type[],
    ...specialtiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const specialties: Type[] = specialtiesToCheck.filter(isPresent);
    if (specialties.length > 0) {
      const specialtyCollectionIdentifiers = specialtyCollection.map(specialtyItem => this.getSpecialtyIdentifier(specialtyItem));
      const specialtiesToAdd = specialties.filter(specialtyItem => {
        const specialtyIdentifier = this.getSpecialtyIdentifier(specialtyItem);
        if (specialtyCollectionIdentifiers.includes(specialtyIdentifier)) {
          return false;
        }
        specialtyCollectionIdentifiers.push(specialtyIdentifier);
        return true;
      });
      return [...specialtiesToAdd, ...specialtyCollection];
    }
    return specialtyCollection;
  }

  protected convertDateFromClient<T extends ISpecialty | NewSpecialty | PartialUpdateSpecialty>(specialty: T): RestOf<T> {
    return {
      ...specialty,
      createdDate: specialty.createdDate?.toJSON() ?? null,
      lastModifiedDate: specialty.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSpecialty: RestSpecialty): ISpecialty {
    return {
      ...restSpecialty,
      createdDate: restSpecialty.createdDate ? dayjs(restSpecialty.createdDate) : undefined,
      lastModifiedDate: restSpecialty.lastModifiedDate ? dayjs(restSpecialty.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSpecialty>): HttpResponse<ISpecialty> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSpecialty[]>): HttpResponse<ISpecialty[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
