import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DxDataGridModule } from 'devextreme-angular';

import { FormGroupComponent } from '@app/shared/components/form-group/form-group.component';
import { HbfTemplateComponent } from '@app/shared/components/hbf-template/hbf-template.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';

const Modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
];

const Components = [
  LoaderComponent,
  FormGroupComponent,
  HbfTemplateComponent
];

const Devextreme = [
  DxDataGridModule
];

@NgModule({
  declarations: [
    ...Components,
  ],
  imports: [
    ...Modules,
    ...Devextreme
  ],
  exports: [
    ...Components,
    ...Modules,
    ...Devextreme
  ]
})
export class SharedModule { }
