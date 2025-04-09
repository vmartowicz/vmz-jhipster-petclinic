import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPet, NewPet } from '../pet.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPet for edit and NewPetFormGroupInput for create.
 */
type PetFormGroupInput = IPet | PartialWithRequiredKeyOf<NewPet>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPet | NewPet> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type PetFormRawValue = FormValueOf<IPet>;

type NewPetFormRawValue = FormValueOf<NewPet>;

type PetFormDefaults = Pick<NewPet, 'id' | 'createdDate' | 'lastModifiedDate'>;

type PetFormGroupContent = {
  id: FormControl<PetFormRawValue['id'] | NewPet['id']>;
  name: FormControl<PetFormRawValue['name']>;
  birthDate: FormControl<PetFormRawValue['birthDate']>;
  createdBy: FormControl<PetFormRawValue['createdBy']>;
  createdDate: FormControl<PetFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<PetFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<PetFormRawValue['lastModifiedDate']>;
  type: FormControl<PetFormRawValue['type']>;
  owner: FormControl<PetFormRawValue['owner']>;
};

export type PetFormGroup = FormGroup<PetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PetFormService {
  createPetFormGroup(pet: PetFormGroupInput = { id: null }): PetFormGroup {
    const petRawValue = this.convertPetToPetRawValue({
      ...this.getFormDefaults(),
      ...pet,
    });
    return new FormGroup<PetFormGroupContent>({
      id: new FormControl(
        { value: petRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(petRawValue.name, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      birthDate: new FormControl(petRawValue.birthDate),
      createdBy: new FormControl(petRawValue.createdBy),
      createdDate: new FormControl(petRawValue.createdDate),
      lastModifiedBy: new FormControl(petRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(petRawValue.lastModifiedDate),
      type: new FormControl(petRawValue.type),
      owner: new FormControl(petRawValue.owner),
    });
  }

  getPet(form: PetFormGroup): IPet | NewPet {
    return this.convertPetRawValueToPet(form.getRawValue() as PetFormRawValue | NewPetFormRawValue);
  }

  resetForm(form: PetFormGroup, pet: PetFormGroupInput): void {
    const petRawValue = this.convertPetToPetRawValue({ ...this.getFormDefaults(), ...pet });
    form.reset(
      {
        ...petRawValue,
        id: { value: petRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PetFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertPetRawValueToPet(rawPet: PetFormRawValue | NewPetFormRawValue): IPet | NewPet {
    return {
      ...rawPet,
      createdDate: dayjs(rawPet.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawPet.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPetToPetRawValue(
    pet: IPet | (Partial<NewPet> & PetFormDefaults),
  ): PetFormRawValue | PartialWithRequiredKeyOf<NewPetFormRawValue> {
    return {
      ...pet,
      createdDate: pet.createdDate ? pet.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: pet.lastModifiedDate ? pet.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
