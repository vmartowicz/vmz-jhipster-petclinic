import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnifiedDiffComponent } from 'ngx-diff';

import SharedModule from 'app/shared/shared.module';
import { EntityAuditService } from './entity-audit.service';
import { EntityAuditEvent } from './entity-audit-event.model';

@Component({
  standalone: true,
  selector: 'jhi-entity-audit-modal',
  templateUrl: './entity-audit-modal.component.html',
  imports: [SharedModule, UnifiedDiffComponent],
  styles: [
    `
      @import 'ngx-diff/styles/default-theme';

      ins {
        color: black;
        background-color: var(--ngx-diff-inserted-background-color);
      }

      del {
        color: black;
        background-color: var(--ngx-diff-deleted-background-color);
      }
    `,
  ],
})
export default class EntityAuditModalComponent {
  action?: string;
  left?: string;
  right?: string;

  constructor(
    private service: EntityAuditService,
    public activeModal: NgbActiveModal,
  ) {}

  openChange(audit: EntityAuditEvent): void {
    this.service.getPrevVersion(audit.entityType, audit.entityId, audit.commitVersion!).subscribe((res: HttpResponse<EntityAuditEvent>) => {
      const data: EntityAuditEvent = res.body!;
      const previousVersion = JSON.stringify(JSON.parse(data.entityValue ?? '{}'), null, 2);
      const currentVersion = JSON.stringify(audit.entityValue, null, 2);

      this.action = audit.action;
      this.left = previousVersion;
      this.right = currentVersion;
    });
  }
}
