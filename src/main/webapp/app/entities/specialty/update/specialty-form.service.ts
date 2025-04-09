import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISpecialty, NewSpecialty } from '../specialty.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISpecialty for edit and NewSpecialtyFormGroupInput for create.
 */
type SpecialtyFormGroupInput = ISpecialty | PartialWithRequiredKeyOf<NewSpecialty>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISpecialty | NewSpecialty> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type SpecialtyFormRawValue = FormValueOf<ISpecialty>;

type NewSpecialtyFormRawValue = FormValueOf<NewSpecialty>;

type SpecialtyFormDefaults = Pick<NewSpecialty, 'id' | 'createdDate' | 'lastModifiedDate' | 'vets'>;

type SpecialtyFormGroupContent = {
  id: FormControl<SpecialtyFormRawValue['id'] | NewSpecialty['id']>;
  name: FormControl<SpecialtyFormRawValue['name']>;
  createdBy: FormControl<SpecialtyFormRawValue['createdBy']>;
  createdDate: FormControl<SpecialtyFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<SpecialtyFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<SpecialtyFormRawValue['lastModifiedDate']>;
  vets: FormControl<SpecialtyFormRawValue['vets']>;
};

export type SpecialtyFormGroup = FormGroup<SpecialtyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SpecialtyFormService {
  createSpecialtyFormGroup(specialty: SpecialtyFormGroupInput = { id: null }): SpecialtyFormGroup {
    const specialtyRawValue = this.convertSpecialtyToSpecialtyRawValue({
      ...this.getFormDefaults(),
      ...specialty,
    });
    return new FormGroup<SpecialtyFormGroupContent>({
      id: new FormControl(
        { value: specialtyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(specialtyRawValue.name, {
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      createdBy: new FormControl(specialtyRawValue.createdBy),
      createdDate: new FormControl(specialtyRawValue.createdDate),
      lastModifiedBy: new FormControl(specialtyRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(specialtyRawValue.lastModifiedDate),
      vets: new FormControl(specialtyRawValue.vets ?? []),
    });
  }

  getSpecialty(form: SpecialtyFormGroup): ISpecialty | NewSpecialty {
    return this.convertSpecialtyRawValueToSpecialty(form.getRawValue() as SpecialtyFormRawValue | NewSpecialtyFormRawValue);
  }

  resetForm(form: SpecialtyFormGroup, specialty: SpecialtyFormGroupInput): void {
    const specialtyRawValue = this.convertSpecialtyToSpecialtyRawValue({ ...this.getFormDefaults(), ...specialty });
    form.reset(
      {
        ...specialtyRawValue,
        id: { value: specialtyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SpecialtyFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
      vets: [],
    };
  }

  private convertSpecialtyRawValueToSpecialty(rawSpecialty: SpecialtyFormRawValue | NewSpecialtyFormRawValue): ISpecialty | NewSpecialty {
    return {
      ...rawSpecialty,
      createdDate: dayjs(rawSpecialty.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawSpecialty.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertSpecialtyToSpecialtyRawValue(
    specialty: ISpecialty | (Partial<NewSpecialty> & SpecialtyFormDefaults),
  ): SpecialtyFormRawValue | PartialWithRequiredKeyOf<NewSpecialtyFormRawValue> {
    return {
      ...specialty,
      createdDate: specialty.createdDate ? specialty.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: specialty.lastModifiedDate ? specialty.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      vets: specialty.vets ?? [],
    };
  }
}
