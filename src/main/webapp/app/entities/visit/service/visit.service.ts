import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IVisit, NewVisit } from '../visit.model';

export type PartialUpdateVisit = Partial<IVisit> & Pick<IVisit, 'id'>;

type RestOf<T extends IVisit | NewVisit> = Omit<T, 'visitDate' | 'createdDate' | 'lastModifiedDate'> & {
  visitDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestVisit = RestOf<IVisit>;

export type NewRestVisit = RestOf<NewVisit>;

export type PartialUpdateRestVisit = RestOf<PartialUpdateVisit>;

@Injectable()
export class VisitsService {
  readonly visitsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly visitsResource = httpResource<RestVisit[]>(() => {
    const params = this.visitsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of visit that have been fetched. It is updated when the visitsResource emits a new value.
   * In case of error while fetching the visits, the signal is set to an empty array.
   */
  readonly visits = computed(() =>
    (this.visitsResource.hasValue() ? this.visitsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/visits');

  protected convertValueFromServer(restVisit: RestVisit): IVisit {
    return {
      ...restVisit,
      visitDate: restVisit.visitDate ? dayjs(restVisit.visitDate) : undefined,
      createdDate: restVisit.createdDate ? dayjs(restVisit.createdDate) : undefined,
      lastModifiedDate: restVisit.lastModifiedDate ? dayjs(restVisit.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class VisitService extends VisitsService {
  protected readonly http = inject(HttpClient);

  create(visit: NewVisit): Observable<IVisit> {
    const copy = this.convertValueFromClient(visit);
    return this.http.post<RestVisit>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(visit: IVisit): Observable<IVisit> {
    const copy = this.convertValueFromClient(visit);
    return this.http
      .put<RestVisit>(`${this.resourceUrl}/${encodeURIComponent(this.getVisitIdentifier(visit))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(visit: PartialUpdateVisit): Observable<IVisit> {
    const copy = this.convertValueFromClient(visit);
    return this.http
      .patch<RestVisit>(`${this.resourceUrl}/${encodeURIComponent(this.getVisitIdentifier(visit))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IVisit> {
    return this.http.get<RestVisit>(`${this.resourceUrl}/${encodeURIComponent(id)}`).pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IVisit[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVisit[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getVisitIdentifier(visit: Pick<IVisit, 'id'>): number {
    return visit.id;
  }

  compareVisit(o1: Pick<IVisit, 'id'> | null, o2: Pick<IVisit, 'id'> | null): boolean {
    return o1 && o2 ? this.getVisitIdentifier(o1) === this.getVisitIdentifier(o2) : o1 === o2;
  }

  addVisitToCollectionIfMissing<Type extends Pick<IVisit, 'id'>>(
    visitCollection: Type[],
    ...visitsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const visits: Type[] = visitsToCheck.filter(isPresent);
    if (visits.length > 0) {
      const visitCollectionIdentifiers = visitCollection.map(visitItem => this.getVisitIdentifier(visitItem));
      const visitsToAdd = visits.filter(visitItem => {
        const visitIdentifier = this.getVisitIdentifier(visitItem);
        if (visitCollectionIdentifiers.includes(visitIdentifier)) {
          return false;
        }
        visitCollectionIdentifiers.push(visitIdentifier);
        return true;
      });
      return [...visitsToAdd, ...visitCollection];
    }
    return visitCollection;
  }

  protected convertValueFromClient<T extends IVisit | NewVisit | PartialUpdateVisit>(visit: T): RestOf<T> {
    return {
      ...visit,
      visitDate: visit.visitDate?.format(DATE_FORMAT) ?? null,
      createdDate: visit.createdDate?.toJSON() ?? null,
      lastModifiedDate: visit.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestVisit): IVisit {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestVisit[]): IVisit[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
