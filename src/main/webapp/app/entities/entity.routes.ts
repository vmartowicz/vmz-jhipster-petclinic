import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user-management',
    title: 'userManagement.home.title',
    loadChildren: () => import('./admin/user-management/user-management.routes'),
  },
  {
    path: 'authority',
    title: 'jhpetclinicApp.adminAuthority.home.title',
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'pet-type',
    title: 'jhpetclinicApp.petType.home.title',
    loadChildren: () => import('./pet-type/pet-type.routes'),
  },
  {
    path: 'specialty',
    title: 'jhpetclinicApp.specialty.home.title',
    loadChildren: () => import('./specialty/specialty.routes'),
  },
  {
    path: 'vet',
    title: 'jhpetclinicApp.vet.home.title',
    loadChildren: () => import('./vet/vet.routes'),
  },
  {
    path: 'owner',
    title: 'jhpetclinicApp.owner.home.title',
    loadChildren: () => import('./owner/owner.routes'),
  },
  {
    path: 'pet',
    title: 'jhpetclinicApp.pet.home.title',
    loadChildren: () => import('./pet/pet.routes'),
  },
  {
    path: 'visit',
    title: 'jhpetclinicApp.visit.home.title',
    loadChildren: () => import('./visit/visit.routes'),
  },
  // jhipster-needle-add-entity-route - JHipster will add entity modules routes here
];

export default routes;
