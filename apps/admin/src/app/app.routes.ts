import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'businesses',
    loadComponent: () => import('./businesses/business-list.component').then(m => m.BusinessListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'businesses/new',
    loadComponent: () => import('./businesses/business-form.component').then(m => m.BusinessFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'businesses/:id',
    loadComponent: () => import('./businesses/business-detail.component').then(m => m.BusinessDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'businesses/:id/edit',
    loadComponent: () => import('./businesses/business-form.component').then(m => m.BusinessFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'businesses/:id/menus',
    loadComponent: () => import('./menus/menu-list.component').then(m => m.MenuListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'businesses/:id/menus/new',
    loadComponent: () => import('./menus/menu-form.component').then(m => m.MenuFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'businesses/:id/menus/:menuId/edit',
    loadComponent: () => import('./menus/menu-form.component').then(m => m.MenuFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'businesses/:id/locations',
    loadComponent: () => import('./locations/location-list.component').then(m => m.LocationListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'businesses/:id/locations/new',
    loadComponent: () => import('./locations/location-form.component').then(m => m.LocationFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'businesses/:id/locations/:locationId/edit',
    loadComponent: () => import('./locations/location-form.component').then(m => m.LocationFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
