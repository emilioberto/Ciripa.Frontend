import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeStates } from '@app/core/services/navigation.service';
import { HomeComponent } from '@app/home/home.component';
import { KidDetailComponent } from '@app/home/kid-detail/kid-detail.component';
import { KidsComponent } from '@app/home/kids/kids.component';
import { MenuComponent } from '@app/home/menu/menu.component';
import { NavbarComponent } from '@app/home/navbar/navbar.component';
import { PresencesSummaryComponent } from '@app/home/presences-summary/presences-summary.component';
import { PresencesComponent } from '@app/home/presences/presences.component';
import { KidsService } from '@app/home/services/kids.service';
import { MenuService } from '@app/home/services/menu.service';
import { PresencesService } from '@app/home/services/presences.service';
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
      { path: HomeStates.KidDetail, component: KidDetailComponent },
      { path: HomeStates.Presences, component: PresencesComponent },
      { path: HomeStates.Summary, component: PresencesSummaryComponent },
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
    NavbarComponent,
    PresencesSummaryComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    DatePipe,
    KidsService,
    MenuService,
    PresencesService,
    SettingsService,
  ]
})
export class HomeModule { }
