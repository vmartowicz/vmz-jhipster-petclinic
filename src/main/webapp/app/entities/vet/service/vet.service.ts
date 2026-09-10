import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IVet, NewVet } from '../vet.model';

export type PartialUpdateVet = Partial<IVet> & Pick<IVet, 'id'>;

type RestOf<T extends IVet | NewVet> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestVet = RestOf<IVet>;

export type NewRestVet = RestOf<NewVet>;

export type PartialUpdateRestVet = RestOf<PartialUpdateVet>;

@Injectable()
export class VetsService {
  readonly vetsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly vetsResource = httpResource<RestVet[]>(() => {
    const params = this.vetsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of vet that have been fetched. It is updated when the vetsResource emits a new value.
   * In case of error while fetching the vets, the signal is set to an empty array.
   */
  readonly vets = computed(() =>
    (this.vetsResource.hasValue() ? this.vetsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/vets');

  protected convertValueFromServer(restVet: RestVet): IVet {
    return {
      ...restVet,
      createdDate: restVet.createdDate ? dayjs(restVet.createdDate) : undefined,
      lastModifiedDate: restVet.lastModifiedDate ? dayjs(restVet.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class VetService extends VetsService {
  protected readonly http = inject(HttpClient);

  create(vet: NewVet): Observable<IVet> {
    const copy = this.convertValueFromClient(vet);
    return this.http.post<RestVet>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vet: IVet): Observable<IVet> {
    const copy = this.convertValueFromClient(vet);
    return this.http
      .put<RestVet>(`${this.resourceUrl}/${encodeURIComponent(this.getVetIdentifier(vet))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vet: PartialUpdateVet): Observable<IVet> {
    const copy = this.convertValueFromClient(vet);
    return this.http
      .patch<RestVet>(`${this.resourceUrl}/${encodeURIComponent(this.getVetIdentifier(vet))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IVet> {
    return this.http.get<RestVet>(`${this.resourceUrl}/${encodeURIComponent(id)}`).pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IVet[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVet[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getVetIdentifier(vet: Pick<IVet, 'id'>): number {
    return vet.id;
  }

  compareVet(o1: Pick<IVet, 'id'> | null, o2: Pick<IVet, 'id'> | null): boolean {
    return o1 && o2 ? this.getVetIdentifier(o1) === this.getVetIdentifier(o2) : o1 === o2;
  }

  addVetToCollectionIfMissing<Type extends Pick<IVet, 'id'>>(vetCollection: Type[], ...vetsToCheck: (Type | null | undefined)[]): Type[] {
    const vets: Type[] = vetsToCheck.filter(isPresent);
    if (vets.length > 0) {
      const vetCollectionIdentifiers = vetCollection.map(vetItem => this.getVetIdentifier(vetItem));
      const vetsToAdd = vets.filter(vetItem => {
        const vetIdentifier = this.getVetIdentifier(vetItem);
        if (vetCollectionIdentifiers.includes(vetIdentifier)) {
          return false;
        }
        vetCollectionIdentifiers.push(vetIdentifier);
        return true;
      });
      return [...vetsToAdd, ...vetCollection];
    }
    return vetCollection;
  }

  protected convertValueFromClient<T extends IVet | NewVet | PartialUpdateVet>(vet: T): RestOf<T> {
    return {
      ...vet,
      createdDate: vet.createdDate?.toJSON() ?? null,
      lastModifiedDate: vet.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestVet): IVet {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestVet[]): IVet[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
