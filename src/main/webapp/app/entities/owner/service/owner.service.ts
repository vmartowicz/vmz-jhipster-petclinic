import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOwner, NewOwner } from '../owner.model';

export type PartialUpdateOwner = Partial<IOwner> & Pick<IOwner, 'id'>;

type RestOf<T extends IOwner | NewOwner> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestOwner = RestOf<IOwner>;

export type NewRestOwner = RestOf<NewOwner>;

export type PartialUpdateRestOwner = RestOf<PartialUpdateOwner>;

export type EntityResponseType = HttpResponse<IOwner>;
export type EntityArrayResponseType = HttpResponse<IOwner[]>;

@Injectable({ providedIn: 'root' })
export class OwnerService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/owners');

  create(owner: NewOwner): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(owner);
    return this.http.post<RestOwner>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(owner: IOwner): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(owner);
    return this.http
      .put<RestOwner>(`${this.resourceUrl}/${this.getOwnerIdentifier(owner)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(owner: PartialUpdateOwner): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(owner);
    return this.http
      .patch<RestOwner>(`${this.resourceUrl}/${this.getOwnerIdentifier(owner)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOwner>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOwner[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
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
    const owners: Type[] = ownersToCheck.filter(isPresent);
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

  protected convertDateFromClient<T extends IOwner | NewOwner | PartialUpdateOwner>(owner: T): RestOf<T> {
    return {
      ...owner,
      createdDate: owner.createdDate?.toJSON() ?? null,
      lastModifiedDate: owner.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restOwner: RestOwner): IOwner {
    return {
      ...restOwner,
      createdDate: restOwner.createdDate ? dayjs(restOwner.createdDate) : undefined,
      lastModifiedDate: restOwner.lastModifiedDate ? dayjs(restOwner.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOwner>): HttpResponse<IOwner> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOwner[]>): HttpResponse<IOwner[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
