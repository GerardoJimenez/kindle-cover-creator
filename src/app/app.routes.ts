import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/create/create.page').then((m) => m.CreatePage),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/create/create.page').then((m) => m.CreatePage),
  },
  {
    path: 'creations',
    loadComponent: () =>
      import('./pages/creations/creations.page').then((m) => m.CreationsPage),
  },
];
