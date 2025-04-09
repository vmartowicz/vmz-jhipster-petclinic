import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPetType, NewPetType } from '../pet-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPetType for edit and NewPetTypeFormGroupInput for create.
 */
type PetTypeFormGroupInput = IPetType | PartialWithRequiredKeyOf<NewPetType>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPetType | NewPetType> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type PetTypeFormRawValue = FormValueOf<IPetType>;

type NewPetTypeFormRawValue = FormValueOf<NewPetType>;

type PetTypeFormDefaults = Pick<NewPetType, 'id' | 'createdDate' | 'lastModifiedDate'>;

type PetTypeFormGroupContent = {
  id: FormControl<PetTypeFormRawValue['id'] | NewPetType['id']>;
  name: FormControl<PetTypeFormRawValue['name']>;
  createdBy: FormControl<PetTypeFormRawValue['createdBy']>;
  createdDate: FormControl<PetTypeFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<PetTypeFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<PetTypeFormRawValue['lastModifiedDate']>;
};

export type PetTypeFormGroup = FormGroup<PetTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PetTypeFormService {
  createPetTypeFormGroup(petType: PetTypeFormGroupInput = { id: null }): PetTypeFormGroup {
    const petTypeRawValue = this.convertPetTypeToPetTypeRawValue({
      ...this.getFormDefaults(),
      ...petType,
    });
    return new FormGroup<PetTypeFormGroupContent>({
      id: new FormControl(
        { value: petTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(petTypeRawValue.name, {
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      createdBy: new FormControl(petTypeRawValue.createdBy),
      createdDate: new FormControl(petTypeRawValue.createdDate),
      lastModifiedBy: new FormControl(petTypeRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(petTypeRawValue.lastModifiedDate),
    });
  }

  getPetType(form: PetTypeFormGroup): IPetType | NewPetType {
    return this.convertPetTypeRawValueToPetType(form.getRawValue() as PetTypeFormRawValue | NewPetTypeFormRawValue);
  }

  resetForm(form: PetTypeFormGroup, petType: PetTypeFormGroupInput): void {
    const petTypeRawValue = this.convertPetTypeToPetTypeRawValue({ ...this.getFormDefaults(), ...petType });
    form.reset(
      {
        ...petTypeRawValue,
        id: { value: petTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PetTypeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertPetTypeRawValueToPetType(rawPetType: PetTypeFormRawValue | NewPetTypeFormRawValue): IPetType | NewPetType {
    return {
      ...rawPetType,
      createdDate: dayjs(rawPetType.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawPetType.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPetTypeToPetTypeRawValue(
    petType: IPetType | (Partial<NewPetType> & PetTypeFormDefaults),
  ): PetTypeFormRawValue | PartialWithRequiredKeyOf<NewPetTypeFormRawValue> {
    return {
      ...petType,
      createdDate: petType.createdDate ? petType.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: petType.lastModifiedDate ? petType.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
