import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVisit, NewVisit } from '../visit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVisit for edit and NewVisitFormGroupInput for create.
 */
type VisitFormGroupInput = IVisit | PartialWithRequiredKeyOf<NewVisit>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVisit | NewVisit> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type VisitFormRawValue = FormValueOf<IVisit>;

type NewVisitFormRawValue = FormValueOf<NewVisit>;

type VisitFormDefaults = Pick<NewVisit, 'id' | 'createdDate' | 'lastModifiedDate'>;

type VisitFormGroupContent = {
  id: FormControl<VisitFormRawValue['id'] | NewVisit['id']>;
  visitDate: FormControl<VisitFormRawValue['visitDate']>;
  description: FormControl<VisitFormRawValue['description']>;
  createdBy: FormControl<VisitFormRawValue['createdBy']>;
  createdDate: FormControl<VisitFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<VisitFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<VisitFormRawValue['lastModifiedDate']>;
  pet: FormControl<VisitFormRawValue['pet']>;
};

export type VisitFormGroup = FormGroup<VisitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VisitFormService {
  createVisitFormGroup(visit: VisitFormGroupInput = { id: null }): VisitFormGroup {
    const visitRawValue = this.convertVisitToVisitRawValue({
      ...this.getFormDefaults(),
      ...visit,
    });
    return new FormGroup<VisitFormGroupContent>({
      id: new FormControl(
        { value: visitRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      visitDate: new FormControl(visitRawValue.visitDate),
      description: new FormControl(visitRawValue.description, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      createdBy: new FormControl(visitRawValue.createdBy),
      createdDate: new FormControl(visitRawValue.createdDate),
      lastModifiedBy: new FormControl(visitRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(visitRawValue.lastModifiedDate),
      pet: new FormControl(visitRawValue.pet),
    });
  }

  getVisit(form: VisitFormGroup): IVisit | NewVisit {
    return this.convertVisitRawValueToVisit(form.getRawValue() as VisitFormRawValue | NewVisitFormRawValue);
  }

  resetForm(form: VisitFormGroup, visit: VisitFormGroupInput): void {
    const visitRawValue = this.convertVisitToVisitRawValue({ ...this.getFormDefaults(), ...visit });
    form.reset(
      {
        ...visitRawValue,
        id: { value: visitRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VisitFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertVisitRawValueToVisit(rawVisit: VisitFormRawValue | NewVisitFormRawValue): IVisit | NewVisit {
    return {
      ...rawVisit,
      createdDate: dayjs(rawVisit.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawVisit.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertVisitToVisitRawValue(
    visit: IVisit | (Partial<NewVisit> & VisitFormDefaults),
  ): VisitFormRawValue | PartialWithRequiredKeyOf<NewVisitFormRawValue> {
    return {
      ...visit,
      createdDate: visit.createdDate ? visit.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: visit.lastModifiedDate ? visit.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
