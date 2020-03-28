import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormGroupComponent } from './components/form-group/form-group.component';
import { LoaderComponent } from './components/loader/loader.component';

const Modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
];

const Components = [
  LoaderComponent,
  FormGroupComponent
];

@NgModule({
  declarations: [
    ...Components,
  ],
  imports: [
    ...Modules
  ],
  exports: [
    ...Components,
    ...Modules
  ]
})
export class SharedModule { }
