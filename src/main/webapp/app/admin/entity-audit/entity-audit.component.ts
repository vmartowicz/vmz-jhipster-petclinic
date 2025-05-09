import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs';

import SharedModule from 'app/shared/shared.module';
import { AlertService } from 'app/core/util/alert.service';
import { EntityAuditService } from './entity-audit.service';
import { EntityAuditEntityChoice, EntityAuditEvent } from './entity-audit-event.model';
import EntityAuditModalComponent from './entity-audit-modal.component';

@Component({
  standalone: true,
  selector: 'jhi-entity-audit',
  templateUrl: './entity-audit.component.html',
  imports: [SharedModule, FormsModule, EntityAuditModalComponent],
  styles: [
    `
      .code {
        background: #dcdada;
        padding: 10px;
      }
    `,
  ],
})
export default class EntityAuditComponent implements OnInit {
  entities = signal<EntityAuditEntityChoice[]>([]);
  selectedEntity = signal<string | undefined>(undefined);
  limits = [25, 50, 100, 200];
  selectedLimit = signal(this.limits[0]);
  loading = signal(false);
  filterEntityId = signal('');

  audits = computed(() => {
    const filterEntityId = this.filterEntityId();
    const orderProp = this.orderProp();
    const ascending = this.ascending();
    return this._audits()
      .filter(audit => !filterEntityId || audit.entityId.toString() === filterEntityId)
      .sort((a, b) => {
        const aOrderProp = a[orderProp];
        const bOrderProp = b[orderProp];
        if (aOrderProp === bOrderProp) {
          return 0;
        }
        if (aOrderProp === undefined || aOrderProp < bOrderProp) {
          return ascending ? -1 : 1;
        }
        return ascending ? 1 : -1;
      });
  });

  private _audits = signal<EntityAuditEvent[]>([]);
  private orderProp = signal<keyof EntityAuditEvent>('modifiedDate');
  private ascending = signal(false);

  private modalService = inject(NgbModal);
  private service = inject(EntityAuditService);
  private alertService = inject(AlertService);

  ngOnInit(): void {
    this.service.getAllAudited().subscribe(entities => {
      this.entities.set(entities);
    });
  }

  loadChanges(): void {
    const selectedEntity = this.selectedEntity();
    if (!selectedEntity) {
      return;
    }
    this.loading.set(true);
    this.service
      .findByEntity(selectedEntity, this.selectedLimit())
      .pipe(tap(() => this.loading.set(false)))
      .subscribe(res => {
        const data = res.body ?? [];
        this._audits.set(
          data.map((it: EntityAuditEvent) => {
            it.entityValue = JSON.parse(it.entityValue ?? '{}');
            return it;
          }),
        );
      });
  }

  openChange(audit: EntityAuditEvent): void {
    if (!audit.commitVersion || audit.commitVersion < 2) {
      this.alertService.addAlert({
        type: 'warning',
        translationKey: 'entityAudit.result.firstAuditEntry',
      });
    } else {
      const modalRef = this.modalService.open(EntityAuditModalComponent, { size: 'lg' });
      modalRef.componentInstance.openChange(audit);
    }
  }

  orderBy(orderProp: keyof EntityAuditEvent): void {
    this.ascending.update(ascending => (this.orderProp() === orderProp ? !ascending : true));
    this.orderProp.set(orderProp);
  }
}
