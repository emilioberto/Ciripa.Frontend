import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

const Modules = [
  CommonModule
];

@NgModule({
  declarations: [

  ],
  imports: [
    ...Modules
  ],
  exports: [
    ...Modules
  ]
})
export class SharedModule { }
