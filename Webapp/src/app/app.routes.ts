import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/about/about.component').then(
        (m) => m.AboutComponent
      ),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./components/gallery/gallery.component').then(
        (m) => m.GalleryComponent
      ),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./components/services/services.component').then(
        (m) => m.ServicesComponent
      ),
  },
  {
    path: 'apply',
    loadComponent: () =>
      import('./components/apply/apply.component').then(
        (m) => m.ApplyComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart/cart.component').then((m) => m.CartComponent),
  },
  // {
  //   path: 'profile/:name',
  //   loadComponent: () =>
  //     import('./components/profile/profile.component').then(
  //       (m) => m.ProfileComponent
  //     ),
  // },
  {
    path: '**',
    redirectTo: '',
  },
];
