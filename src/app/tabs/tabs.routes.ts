import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/create',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'create',
        loadComponent: () =>
          import('../pages/create/create.page').then((m) => m.CreatePage),
      },
      {
        path: 'creations',
        loadComponent: () =>
          import('../pages/creations/creations.page').then(
            (m) => m.CreationsPage
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full',
      },
    ],
  },
];