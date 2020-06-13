import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([]),
    SharedModule
  ]
})
export class NotFoundModule { }
