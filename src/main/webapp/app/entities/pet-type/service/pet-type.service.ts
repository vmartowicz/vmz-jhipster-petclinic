import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IPetType, NewPetType } from '../pet-type.model';

export type PartialUpdatePetType = Partial<IPetType> & Pick<IPetType, 'id'>;

type RestOf<T extends IPetType | NewPetType> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestPetType = RestOf<IPetType>;

export type NewRestPetType = RestOf<NewPetType>;

export type PartialUpdateRestPetType = RestOf<PartialUpdatePetType>;

@Injectable()
export class PetTypesService {
  readonly petTypesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly petTypesResource = httpResource<RestPetType[]>(() => {
    const params = this.petTypesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of petType that have been fetched. It is updated when the petTypesResource emits a new value.
   * In case of error while fetching the petTypes, the signal is set to an empty array.
   */
  readonly petTypes = computed(() =>
    (this.petTypesResource.hasValue() ? this.petTypesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/pet-types');

  protected convertValueFromServer(restPetType: RestPetType): IPetType {
    return {
      ...restPetType,
      createdDate: restPetType.createdDate ? dayjs(restPetType.createdDate) : undefined,
      lastModifiedDate: restPetType.lastModifiedDate ? dayjs(restPetType.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class PetTypeService extends PetTypesService {
  protected readonly http = inject(HttpClient);

  create(petType: NewPetType): Observable<IPetType> {
    const copy = this.convertValueFromClient(petType);
    return this.http.post<RestPetType>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(petType: IPetType): Observable<IPetType> {
    const copy = this.convertValueFromClient(petType);
    return this.http
      .put<RestPetType>(`${this.resourceUrl}/${encodeURIComponent(this.getPetTypeIdentifier(petType))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(petType: PartialUpdatePetType): Observable<IPetType> {
    const copy = this.convertValueFromClient(petType);
    return this.http
      .patch<RestPetType>(`${this.resourceUrl}/${encodeURIComponent(this.getPetTypeIdentifier(petType))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IPetType> {
    return this.http
      .get<RestPetType>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IPetType[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPetType[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
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

  protected convertValueFromClient<T extends IPetType | NewPetType | PartialUpdatePetType>(petType: T): RestOf<T> {
    return {
      ...petType,
      createdDate: petType.createdDate?.toJSON() ?? null,
      lastModifiedDate: petType.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestPetType): IPetType {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestPetType[]): IPetType[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
