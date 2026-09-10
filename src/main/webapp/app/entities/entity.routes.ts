import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'jhpetclinicApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'pet-type',
    data: { pageTitle: 'jhpetclinicApp.petType.home.title' },
    loadChildren: () => import('./pet-type/pet-type.routes'),
  },
  {
    path: 'specialty',
    data: { pageTitle: 'jhpetclinicApp.specialty.home.title' },
    loadChildren: () => import('./specialty/specialty.routes'),
  },
  {
    path: 'vet',
    data: { pageTitle: 'jhpetclinicApp.vet.home.title' },
    loadChildren: () => import('./vet/vet.routes'),
  },
  {
    path: 'owner',
    data: { pageTitle: 'jhpetclinicApp.owner.home.title' },
    loadChildren: () => import('./owner/owner.routes'),
  },
  {
    path: 'pet',
    data: { pageTitle: 'jhpetclinicApp.pet.home.title' },
    loadChildren: () => import('./pet/pet.routes'),
  },
  {
    path: 'visit',
    data: { pageTitle: 'jhpetclinicApp.visit.home.title' },
    loadChildren: () => import('./visit/visit.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
