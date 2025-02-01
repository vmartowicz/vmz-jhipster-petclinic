import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOwner } from 'app/shared/model/owner.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { OwnerService } from './owner.service';
import { OwnerDeleteDialogComponent } from './owner-delete-dialog.component';

@Component({
  selector: 'jhi-owner',
  templateUrl: './owner.component.html',
})
export class OwnerComponent implements OnInit, OnDestroy {
  owners?: IOwner[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  searchFieldOptions = [
    { value: 'firstName', label: 'First name' },
    { value: 'lastName', label: 'Last name' },
    { value: 'address', label: 'Address' },
    { value: 'city', label: 'City' },
  ];

  criteria = {
    searchData: '',
    searchField: 'firstName',
  };

  activeSearchData?: string;
  activeSearchField?: string;

  constructor(
    protected ownerService: OwnerService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;
    const req = this.constructRequest(pageToLoad);

    this.ownerService.query(req).subscribe(
      (res: HttpResponse<IOwner[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
      () => this.onError()
    );
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.registerChangeInOwners();
  }

  protected handleNavigation(): void {
    combineLatest(this.activatedRoute.data, this.activatedRoute.queryParamMap, (data: Data, params: ParamMap) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    }).subscribe();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IOwner): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInOwners(): void {
    this.eventSubscriber = this.eventManager.subscribe('ownerListModification', () => this.loadPage());
  }

  delete(owner: IOwner): void {
    const modalRef = this.modalService.open(OwnerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.owner = owner;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  searchOwners(): void {
    this.activeSearchData = this.criteria.searchData;
    this.activeSearchField = this.criteria.searchField;
    this.page = 1;
    this.ngbPaginationPage = 1;
    this.loadPage();
  }

  protected onSuccess(data: IOwner[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/owner'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.owners = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  protected constructRequest(pageToLoad: number): any {
    const req = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    if (this.activeSearchData) {
      req[this.activeSearchField + '.contains'] = this.activeSearchData;
    }
    return req;
  }
}
