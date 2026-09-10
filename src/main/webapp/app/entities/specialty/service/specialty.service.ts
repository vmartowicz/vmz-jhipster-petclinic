import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ISpecialty, NewSpecialty } from '../specialty.model';

export type PartialUpdateSpecialty = Partial<ISpecialty> & Pick<ISpecialty, 'id'>;

type RestOf<T extends ISpecialty | NewSpecialty> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestSpecialty = RestOf<ISpecialty>;

export type NewRestSpecialty = RestOf<NewSpecialty>;

export type PartialUpdateRestSpecialty = RestOf<PartialUpdateSpecialty>;

@Injectable()
export class SpecialtiesService {
  readonly specialtiesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly specialtiesResource = httpResource<RestSpecialty[]>(() => {
    const params = this.specialtiesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of specialty that have been fetched. It is updated when the specialtiesResource emits a new value.
   * In case of error while fetching the specialties, the signal is set to an empty array.
   */
  readonly specialties = computed(() =>
    (this.specialtiesResource.hasValue() ? this.specialtiesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/specialties');

  protected convertValueFromServer(restSpecialty: RestSpecialty): ISpecialty {
    return {
      ...restSpecialty,
      createdDate: restSpecialty.createdDate ? dayjs(restSpecialty.createdDate) : undefined,
      lastModifiedDate: restSpecialty.lastModifiedDate ? dayjs(restSpecialty.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class SpecialtyService extends SpecialtiesService {
  protected readonly http = inject(HttpClient);

  create(specialty: NewSpecialty): Observable<ISpecialty> {
    const copy = this.convertValueFromClient(specialty);
    return this.http.post<RestSpecialty>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(specialty: ISpecialty): Observable<ISpecialty> {
    const copy = this.convertValueFromClient(specialty);
    return this.http
      .put<RestSpecialty>(`${this.resourceUrl}/${encodeURIComponent(this.getSpecialtyIdentifier(specialty))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(specialty: PartialUpdateSpecialty): Observable<ISpecialty> {
    const copy = this.convertValueFromClient(specialty);
    return this.http
      .patch<RestSpecialty>(`${this.resourceUrl}/${encodeURIComponent(this.getSpecialtyIdentifier(specialty))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<ISpecialty> {
    return this.http
      .get<RestSpecialty>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<ISpecialty[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSpecialty[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
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

  protected convertValueFromClient<T extends ISpecialty | NewSpecialty | PartialUpdateSpecialty>(specialty: T): RestOf<T> {
    return {
      ...specialty,
      createdDate: specialty.createdDate?.toJSON() ?? null,
      lastModifiedDate: specialty.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestSpecialty): ISpecialty {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestSpecialty[]): ISpecialty[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
