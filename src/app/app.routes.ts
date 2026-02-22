import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'user',
    loadComponent: () => import('./features/user/user').then((m) => m.User),
  },
  {
    path: '**', // ← catches any unknown route
    redirectTo: '', // ← sends to home
  },
];
