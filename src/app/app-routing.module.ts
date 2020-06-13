import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppStates } from '@app/core/services/navigation.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppStates.Home
  },
  {
    path: AppStates.Home,
    loadChildren: () => import('@app/home/home.module').then(m => m.HomeModule)
  },
  {
    path: AppStates.Login,
    loadChildren: () => import('@app/login/login.module').then(m => m.LoginModule)
  },
  {
    path: AppStates.NotFound,
    loadChildren: () => import('@app/not-found/not-found.module').then(m => m.NotFoundModule)
  },
  {
    path: '**',
    redirectTo: AppStates.NotFound
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
