import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVet, NewVet } from '../vet.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVet for edit and NewVetFormGroupInput for create.
 */
type VetFormGroupInput = IVet | PartialWithRequiredKeyOf<NewVet>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVet | NewVet> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type VetFormRawValue = FormValueOf<IVet>;

type NewVetFormRawValue = FormValueOf<NewVet>;

type VetFormDefaults = Pick<NewVet, 'id' | 'createdDate' | 'lastModifiedDate' | 'specialties'>;

type VetFormGroupContent = {
  id: FormControl<VetFormRawValue['id'] | NewVet['id']>;
  firstName: FormControl<VetFormRawValue['firstName']>;
  lastName: FormControl<VetFormRawValue['lastName']>;
  createdBy: FormControl<VetFormRawValue['createdBy']>;
  createdDate: FormControl<VetFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<VetFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<VetFormRawValue['lastModifiedDate']>;
  specialties: FormControl<VetFormRawValue['specialties']>;
};

export type VetFormGroup = FormGroup<VetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VetFormService {
  createVetFormGroup(vet: VetFormGroupInput = { id: null }): VetFormGroup {
    const vetRawValue = this.convertVetToVetRawValue({
      ...this.getFormDefaults(),
      ...vet,
    });
    return new FormGroup<VetFormGroupContent>({
      id: new FormControl(
        { value: vetRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(vetRawValue.firstName, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      lastName: new FormControl(vetRawValue.lastName, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      createdBy: new FormControl(vetRawValue.createdBy),
      createdDate: new FormControl(vetRawValue.createdDate),
      lastModifiedBy: new FormControl(vetRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(vetRawValue.lastModifiedDate),
      specialties: new FormControl(vetRawValue.specialties ?? []),
    });
  }

  getVet(form: VetFormGroup): IVet | NewVet {
    return this.convertVetRawValueToVet(form.getRawValue() as VetFormRawValue | NewVetFormRawValue);
  }

  resetForm(form: VetFormGroup, vet: VetFormGroupInput): void {
    const vetRawValue = this.convertVetToVetRawValue({ ...this.getFormDefaults(), ...vet });
    form.reset(
      {
        ...vetRawValue,
        id: { value: vetRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VetFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
      specialties: [],
    };
  }

  private convertVetRawValueToVet(rawVet: VetFormRawValue | NewVetFormRawValue): IVet | NewVet {
    return {
      ...rawVet,
      createdDate: dayjs(rawVet.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawVet.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertVetToVetRawValue(
    vet: IVet | (Partial<NewVet> & VetFormDefaults),
  ): VetFormRawValue | PartialWithRequiredKeyOf<NewVetFormRawValue> {
    return {
      ...vet,
      createdDate: vet.createdDate ? vet.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: vet.lastModifiedDate ? vet.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      specialties: vet.specialties ?? [],
    };
  }
}
