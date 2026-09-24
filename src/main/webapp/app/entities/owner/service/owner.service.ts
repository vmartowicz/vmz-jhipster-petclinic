import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { IOwner, NewOwner } from '../owner.model';

export type PartialUpdateOwner = Partial<IOwner> & Pick<IOwner, 'id'>;

type RestOf<T extends IOwner | NewOwner> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestOwner = RestOf<IOwner>;

export type NewRestOwner = RestOf<NewOwner>;

export type PartialUpdateRestOwner = RestOf<PartialUpdateOwner>;

@Service()
export class OwnersService {
  readonly ownersParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly ownersResource = httpResource<RestOwner[]>(() => {
    const params = this.ownersParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of owner that have been fetched. It is updated when the ownersResource emits a new value.
   * In case of error while fetching the owners, the signal is set to an empty array.
   */
  readonly owners = computed(() =>
    (this.ownersResource.hasValue() ? this.ownersResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly resourceUrl = `${serverApiUrl}api/owners`;

  protected convertValueFromServer(restOwner: RestOwner): IOwner {
    return {
      ...restOwner,
      createdDate: restOwner.createdDate ? dayjs(restOwner.createdDate) : undefined,
      lastModifiedDate: restOwner.lastModifiedDate ? dayjs(restOwner.lastModifiedDate) : undefined,
    };
  }
}

@Service()
export class OwnerService extends OwnersService {
  protected readonly http = inject(HttpClient);

  create(owner: NewOwner): Observable<IOwner> {
    const copy = this.convertValueFromClient(owner);
    return this.http.post<RestOwner>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(owner: IOwner): Observable<IOwner> {
    const copy = this.convertValueFromClient(owner);
    return this.http
      .put<RestOwner>(`${this.resourceUrl}/${encodeURIComponent(this.getOwnerIdentifier(owner))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(owner: PartialUpdateOwner): Observable<IOwner> {
    const copy = this.convertValueFromClient(owner);
    return this.http
      .patch<RestOwner>(`${this.resourceUrl}/${encodeURIComponent(this.getOwnerIdentifier(owner))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IOwner> {
    return this.http.get<RestOwner>(`${this.resourceUrl}/${encodeURIComponent(id)}`).pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IOwner[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOwner[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getOwnerIdentifier(owner: Pick<IOwner, 'id'>): number {
    return owner.id;
  }

  compareOwner(o1: Pick<IOwner, 'id'> | null, o2: Pick<IOwner, 'id'> | null): boolean {
    return o1 && o2 ? this.getOwnerIdentifier(o1) === this.getOwnerIdentifier(o2) : o1 === o2;
  }

  addOwnerToCollectionIfMissing<Type extends Pick<IOwner, 'id'>>(
    ownerCollection: Type[],
    ...ownersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const owners: Type[] = ownersToCheck.filter(ownerItem => ownerItem !== null && ownerItem !== undefined);
    if (owners.length > 0) {
      const ownerCollectionIdentifiers = ownerCollection.map(ownerItem => this.getOwnerIdentifier(ownerItem));
      const ownersToAdd = owners.filter(ownerItem => {
        const ownerIdentifier = this.getOwnerIdentifier(ownerItem);
        if (ownerCollectionIdentifiers.includes(ownerIdentifier)) {
          return false;
        }
        ownerCollectionIdentifiers.push(ownerIdentifier);
        return true;
      });
      return [...ownersToAdd, ...ownerCollection];
    }
    return ownerCollection;
  }

  protected convertValueFromClient<T extends IOwner | NewOwner | PartialUpdateOwner>(owner: T): RestOf<T> {
    return {
      ...owner,
      createdDate: owner.createdDate?.toJSON() ?? null,
      lastModifiedDate: owner.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestOwner): IOwner {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestOwner[]): IOwner[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
