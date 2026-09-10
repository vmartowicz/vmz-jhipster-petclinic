import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVet, NewVet } from '../vet.model';

export type PartialUpdateVet = Partial<IVet> & Pick<IVet, 'id'>;

type RestOf<T extends IVet | NewVet> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestVet = RestOf<IVet>;

export type NewRestVet = RestOf<NewVet>;

export type PartialUpdateRestVet = RestOf<PartialUpdateVet>;

export type EntityResponseType = HttpResponse<IVet>;
export type EntityArrayResponseType = HttpResponse<IVet[]>;

@Injectable({ providedIn: 'root' })
export class VetService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vets');

  create(vet: NewVet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vet);
    return this.http.post<RestVet>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vet: IVet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vet);
    return this.http
      .put<RestVet>(`${this.resourceUrl}/${this.getVetIdentifier(vet)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vet: PartialUpdateVet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vet);
    return this.http
      .patch<RestVet>(`${this.resourceUrl}/${this.getVetIdentifier(vet)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVet>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVet[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
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

  protected convertDateFromClient<T extends IVet | NewVet | PartialUpdateVet>(vet: T): RestOf<T> {
    return {
      ...vet,
      createdDate: vet.createdDate?.toJSON() ?? null,
      lastModifiedDate: vet.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVet: RestVet): IVet {
    return {
      ...restVet,
      createdDate: restVet.createdDate ? dayjs(restVet.createdDate) : undefined,
      lastModifiedDate: restVet.lastModifiedDate ? dayjs(restVet.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVet>): HttpResponse<IVet> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVet[]>): HttpResponse<IVet[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
