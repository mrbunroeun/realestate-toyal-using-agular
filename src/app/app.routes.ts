import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'house-design',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'inclusion-list',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'about',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'contact',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
