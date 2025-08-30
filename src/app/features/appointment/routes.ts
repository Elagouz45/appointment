// src/app/features/appointment/routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/appointment-list/appointment-list.component')
        .then(c => c.AppointmentListComponent),
  },
  {
    path: 'book',
    loadComponent: () =>
      import('./pages/booking-wizard/booking-wizard.component')
        .then(c => c.BookingWizardComponent),
  }
];
