import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import config from 'devextreme/core/config';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { CoreModule } from '@app/core/core.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        CoreModule,
        RouterModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    config({ defaultCurrency: 'EUR' });
  }
}
