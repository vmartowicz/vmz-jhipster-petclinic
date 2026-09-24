import { HttpResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { UnifiedDiffComponent } from 'ngx-diff';

import { TranslateDirective } from 'app/shared/language';

import { EntityAuditEvent } from './entity-audit-event.model';
import { EntityAuditService } from './entity-audit.service';

@Component({
  standalone: true,
  selector: 'jhi-entity-audit-modal',
  templateUrl: './entity-audit-modal.component.html',
  imports: [UnifiedDiffComponent, TranslateDirective, TranslatePipe],
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
  public activeModal = inject(NgbActiveModal);
  action?: string;
  left?: string;
  right?: string;

  private service = inject(EntityAuditService);

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
