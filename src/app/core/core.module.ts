import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { LOCALE_ID, NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { formatMessage, loadMessages, locale } from 'devextreme/localization';
import itMessages from 'devextreme/localization/messages/it.json';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { NavigationService } from '@app/core/services/navigation.service';
import { ToastsService } from '@app/core/services/toasts.service';

registerLocaleData(localeIt, 'it');

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [
    ExceptionsService,
    NavigationService,
    ToastsService,
    {provide: LOCALE_ID, useValue: 'it' }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. You should only import Core modules in the AppModule only.');
    }

    loadMessages(itMessages);
    locale('it');
  }
}
