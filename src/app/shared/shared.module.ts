import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { DxDataGridModule, DxDateBoxModule, DxSelectBoxModule } from 'devextreme-angular';

import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { FormGroupComponent } from '@app/shared/components/form-group/form-group.component';
import { HbfTemplateComponent } from '@app/shared/components/hbf-template/hbf-template.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';

const Modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatDialogModule
];

const Components = [
  LoaderComponent,
  FormGroupComponent,
  HbfTemplateComponent,
  ConfirmDialogComponent
];

const Devextreme = [
  DxDataGridModule,
  DxDateBoxModule,
  DxSelectBoxModule
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
