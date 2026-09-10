import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPetType, NewPetType } from '../pet-type.model';

export type PartialUpdatePetType = Partial<IPetType> & Pick<IPetType, 'id'>;

type RestOf<T extends IPetType | NewPetType> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestPetType = RestOf<IPetType>;

export type NewRestPetType = RestOf<NewPetType>;

export type PartialUpdateRestPetType = RestOf<PartialUpdatePetType>;

export type EntityResponseType = HttpResponse<IPetType>;
export type EntityArrayResponseType = HttpResponse<IPetType[]>;

@Injectable({ providedIn: 'root' })
export class PetTypeService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pet-types');

  create(petType: NewPetType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(petType);
    return this.http
      .post<RestPetType>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(petType: IPetType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(petType);
    return this.http
      .put<RestPetType>(`${this.resourceUrl}/${this.getPetTypeIdentifier(petType)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(petType: PartialUpdatePetType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(petType);
    return this.http
      .patch<RestPetType>(`${this.resourceUrl}/${this.getPetTypeIdentifier(petType)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPetType>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPetType[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPetTypeIdentifier(petType: Pick<IPetType, 'id'>): number {
    return petType.id;
  }

  comparePetType(o1: Pick<IPetType, 'id'> | null, o2: Pick<IPetType, 'id'> | null): boolean {
    return o1 && o2 ? this.getPetTypeIdentifier(o1) === this.getPetTypeIdentifier(o2) : o1 === o2;
  }

  addPetTypeToCollectionIfMissing<Type extends Pick<IPetType, 'id'>>(
    petTypeCollection: Type[],
    ...petTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const petTypes: Type[] = petTypesToCheck.filter(isPresent);
    if (petTypes.length > 0) {
      const petTypeCollectionIdentifiers = petTypeCollection.map(petTypeItem => this.getPetTypeIdentifier(petTypeItem));
      const petTypesToAdd = petTypes.filter(petTypeItem => {
        const petTypeIdentifier = this.getPetTypeIdentifier(petTypeItem);
        if (petTypeCollectionIdentifiers.includes(petTypeIdentifier)) {
          return false;
        }
        petTypeCollectionIdentifiers.push(petTypeIdentifier);
        return true;
      });
      return [...petTypesToAdd, ...petTypeCollection];
    }
    return petTypeCollection;
  }

  protected convertDateFromClient<T extends IPetType | NewPetType | PartialUpdatePetType>(petType: T): RestOf<T> {
    return {
      ...petType,
      createdDate: petType.createdDate?.toJSON() ?? null,
      lastModifiedDate: petType.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPetType: RestPetType): IPetType {
    return {
      ...restPetType,
      createdDate: restPetType.createdDate ? dayjs(restPetType.createdDate) : undefined,
      lastModifiedDate: restPetType.lastModifiedDate ? dayjs(restPetType.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPetType>): HttpResponse<IPetType> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPetType[]>): HttpResponse<IPetType[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
