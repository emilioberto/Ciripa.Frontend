import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from '@app/core/core.module';
import { HomeStates } from '@app/core/services/navigation.service';
import { HomeComponent } from '@app/home/home.component';
import { KidDetailComponent } from '@app/home/kid-detail/kid-detail.component';
import { KidsComponent } from '@app/home/kids/kids.component';
import { MenuComponent } from '@app/home/menu/menu.component';
import { NavbarComponent } from '@app/home/navbar/navbar.component';
import { PresencesComponent } from '@app/home/presences/presences.component';
import { KidsService } from '@app/home/services/kids.service';
import { SettingsService } from '@app/home/services/settings.service';
import { SettingsComponent } from '@app/home/settings/settings.component';
import { SharedModule } from '@app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: HomeStates.Kids, component: KidsComponent },
      { path: `${HomeStates.KidDetail}/:id`, component: KidDetailComponent },
      { path: HomeStates.Presences, component: PresencesComponent },
      { path: HomeStates.Settings, component: SettingsComponent },
    ]
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    KidsComponent,
    KidDetailComponent,
    SettingsComponent,
    PresencesComponent,
    MenuComponent,
    NavbarComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    KidsService,
    SettingsService
  ]
})
export class HomeModule { }
