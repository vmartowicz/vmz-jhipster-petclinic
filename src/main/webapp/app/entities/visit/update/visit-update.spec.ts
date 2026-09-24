import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IPet } from 'app/entities/pet/pet.model';
import { PetService } from 'app/entities/pet/service/pet.service';
import { VisitService } from '../service/visit.service';
import { IVisit } from '../visit.model';

import { VisitFormService } from './visit-form.service';
import { VisitUpdate } from './visit-update';

describe('Visit Management Update Component', () => {
  let comp: VisitUpdate;
  let fixture: ComponentFixture<VisitUpdate>;
  let activatedRoute: ActivatedRoute;
  let visitFormService: VisitFormService;
  let visitService: VisitService;
  let petService: PetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(VisitUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    visitFormService = TestBed.inject(VisitFormService);
    visitService = TestBed.inject(VisitService);
    petService = TestBed.inject(PetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Pet query and add missing value', () => {
      const visit: IVisit = { id: 12148 };
      const pet: IPet = { id: 23154 };
      visit.pet = pet;

      const petCollection: IPet[] = [{ id: 23154 }];
      vi.spyOn(petService, 'query').mockReturnValue(of(new HttpResponse({ body: petCollection })));
      const additionalPets = [pet];
      const expectedCollection: IPet[] = [...additionalPets, ...petCollection];
      vi.spyOn(petService, 'addPetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ visit });
      comp.ngOnInit();

      expect(petService.query).toHaveBeenCalled();
      expect(petService.addPetToCollectionIfMissing).toHaveBeenCalledWith(
        petCollection,
        ...additionalPets.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.petsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const visit: IVisit = { id: 12148 };
      const pet: IPet = { id: 23154 };
      visit.pet = pet;

      activatedRoute.data = of({ visit });
      comp.ngOnInit();

      expect(comp.petsSharedCollection()).toContainEqual(pet);
      expect(comp.visit).toEqual(visit);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IVisit>();
      const visit = { id: 31581 };
      vi.spyOn(visitFormService, 'getVisit').mockReturnValue(visit);
      vi.spyOn(visitService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(visit);
      saveSubject.complete();

      // THEN
      expect(visitFormService.getVisit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(visitService.update).toHaveBeenCalledWith(expect.objectContaining(visit));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IVisit>();
      const visit = { id: 31581 };
      vi.spyOn(visitFormService, 'getVisit').mockReturnValue({ id: null });
      vi.spyOn(visitService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(visit);
      saveSubject.complete();

      // THEN
      expect(visitFormService.getVisit).toHaveBeenCalled();
      expect(visitService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IVisit>();
      const visit = { id: 31581 };
      vi.spyOn(visitService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(visitService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePet', () => {
      it('should forward to petService', () => {
        const entity = { id: 23154 };
        const entity2 = { id: 28893 };
        vi.spyOn(petService, 'comparePet');
        comp.comparePet(entity, entity2);
        expect(petService.comparePet).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
