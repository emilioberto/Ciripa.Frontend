import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeStates } from '@app/core/services/navigation.service';
import { CanDeactivateGuard } from '@app/home/can-deactivate.guard';
import { HomeComponent } from '@app/home/home.component';
import { InvoicesComponent } from '@app/home/invoices/invoices.component';
import { KidDetailComponent } from '@app/home/kid-detail/kid-detail.component';
import { KidsComponent } from '@app/home/kids/kids.component';
import { MenuComponent } from '@app/home/menu/menu.component';
import { NavbarComponent } from '@app/home/navbar/navbar.component';
import { PresencesSummaryComponent } from '@app/home/presences-summary/presences-summary.component';
import { PresencesComponent } from '@app/home/presences/presences.component';
import { PrintsComponent } from '@app/home/prints/prints.component';
import { ContractsService } from '@app/home/services/contracts.service';
import { InvoicesService } from '@app/home/services/invoices.service';
import { KidsService } from '@app/home/services/kids.service';
import { MenuService } from '@app/home/services/menu.service';
import { PresencesService } from '@app/home/services/presences.service';
import { SettingsService } from '@app/home/services/settings.service';
import { SettingsComponent } from '@app/home/settings/settings.component';
import { SharedModule } from '@app/shared/shared.module';
import { NewContractDialogComponent } from './settings/new-contract-dialog/new-contract-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: HomeStates.Kids, component: KidsComponent },
      { path: `${HomeStates.KidDetail}/:id`, component: KidDetailComponent, canDeactivate: [CanDeactivateGuard] },
      { path: HomeStates.Invoices, component: InvoicesComponent, canDeactivate: [CanDeactivateGuard] },
      { path: HomeStates.KidDetail, component: KidDetailComponent, canDeactivate: [CanDeactivateGuard] },
      { path: HomeStates.Presences, component: PresencesComponent, canDeactivate: [CanDeactivateGuard] },
      { path: HomeStates.Prints, component: PrintsComponent },
      { path: HomeStates.Summary, component: PresencesSummaryComponent },
      { path: HomeStates.Settings, component: SettingsComponent, canDeactivate: [CanDeactivateGuard] },
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
    PresencesSummaryComponent,
    InvoicesComponent,
    PrintsComponent,
    NewContractDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    DatePipe,
    KidsService,
    ContractsService,
    InvoicesService,
    MenuService,
    PresencesService,
    SettingsService,
    CanDeactivateGuard
  ]
})
export class HomeModule { }
