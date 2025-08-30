import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component')
        .then(c => c.MainLayoutComponent),
    children: [
      {
        path: 'appointments',
        loadChildren: () =>
          import('./features/appointment/routes').then(m => m.routes),
      },
      { path: '', redirectTo: 'appointments', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
