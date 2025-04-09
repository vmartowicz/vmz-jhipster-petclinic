import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOwner, NewOwner } from '../owner.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOwner for edit and NewOwnerFormGroupInput for create.
 */
type OwnerFormGroupInput = IOwner | PartialWithRequiredKeyOf<NewOwner>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IOwner | NewOwner> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type OwnerFormRawValue = FormValueOf<IOwner>;

type NewOwnerFormRawValue = FormValueOf<NewOwner>;

type OwnerFormDefaults = Pick<NewOwner, 'id' | 'createdDate' | 'lastModifiedDate'>;

type OwnerFormGroupContent = {
  id: FormControl<OwnerFormRawValue['id'] | NewOwner['id']>;
  firstName: FormControl<OwnerFormRawValue['firstName']>;
  lastName: FormControl<OwnerFormRawValue['lastName']>;
  address: FormControl<OwnerFormRawValue['address']>;
  city: FormControl<OwnerFormRawValue['city']>;
  telephone: FormControl<OwnerFormRawValue['telephone']>;
  createdBy: FormControl<OwnerFormRawValue['createdBy']>;
  createdDate: FormControl<OwnerFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<OwnerFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<OwnerFormRawValue['lastModifiedDate']>;
};

export type OwnerFormGroup = FormGroup<OwnerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OwnerFormService {
  createOwnerFormGroup(owner: OwnerFormGroupInput = { id: null }): OwnerFormGroup {
    const ownerRawValue = this.convertOwnerToOwnerRawValue({
      ...this.getFormDefaults(),
      ...owner,
    });
    return new FormGroup<OwnerFormGroupContent>({
      id: new FormControl(
        { value: ownerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(ownerRawValue.firstName, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      lastName: new FormControl(ownerRawValue.lastName, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      address: new FormControl(ownerRawValue.address, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      city: new FormControl(ownerRawValue.city, {
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      telephone: new FormControl(ownerRawValue.telephone, {
        validators: [Validators.required, Validators.maxLength(20)],
      }),
      createdBy: new FormControl(ownerRawValue.createdBy),
      createdDate: new FormControl(ownerRawValue.createdDate),
      lastModifiedBy: new FormControl(ownerRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(ownerRawValue.lastModifiedDate),
    });
  }

  getOwner(form: OwnerFormGroup): IOwner | NewOwner {
    return this.convertOwnerRawValueToOwner(form.getRawValue() as OwnerFormRawValue | NewOwnerFormRawValue);
  }

  resetForm(form: OwnerFormGroup, owner: OwnerFormGroupInput): void {
    const ownerRawValue = this.convertOwnerToOwnerRawValue({ ...this.getFormDefaults(), ...owner });
    form.reset(
      {
        ...ownerRawValue,
        id: { value: ownerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OwnerFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertOwnerRawValueToOwner(rawOwner: OwnerFormRawValue | NewOwnerFormRawValue): IOwner | NewOwner {
    return {
      ...rawOwner,
      createdDate: dayjs(rawOwner.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawOwner.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertOwnerToOwnerRawValue(
    owner: IOwner | (Partial<NewOwner> & OwnerFormDefaults),
  ): OwnerFormRawValue | PartialWithRequiredKeyOf<NewOwnerFormRawValue> {
    return {
      ...owner,
      createdDate: owner.createdDate ? owner.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: owner.lastModifiedDate ? owner.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
