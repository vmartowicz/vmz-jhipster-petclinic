import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IPet } from '../pet.model';

@Component({
  selector: 'jhi-pet-detail',
  templateUrl: './pet-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PetDetailComponent {
  pet = input<IPet | null>(null);

  previousState(): void {
    window.history.back();
  }
}
