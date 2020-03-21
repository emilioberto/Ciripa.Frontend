import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '@app/home/home.component';
import { KidDetailComponent } from '@app/home/kid-detail/kid-detail.component';
import { KidsComponent } from '@app/home/kids/kids.component';
import { PresencesComponent } from '@app/home/presences/presences.component';
import { SettingsComponent } from '@app/home/settings/settings.component';
import { SharedModule } from '@app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [

    ]
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    KidsComponent,
    KidDetailComponent,
    SettingsComponent,
    PresencesComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class HomeModule { }
