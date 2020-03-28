import { Component, forwardRef, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseComponent } from '@app/shared/components/base.component';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormGroupComponent),
      multi: true
    }
  ]
})
export class FormGroupComponent extends BaseComponent implements ControlValueAccessor {

  @Input() formGroup: FormGroup;
  @Input() formControlName: string;

  errorMessages: string[];

  constructor() {
    super();
  }

  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  internalOnInit(): void {
    const control = this.formGroup.get(this.formControlName);

    control
      .statusChanges
      .subscribe(
        (status: FormControlStatus) => {
          if (status === 'INVALID') {
            this.errorMessages = this.getErrorMessage(control);
          } else {
            this.errorMessages = null;
          }
        }
      );

  }

  internalOnDestroy(): void { }

  private getErrorMessage(control: AbstractControl): string[] {
    const errors = control.errors;

    if (!errors) {
      return;
    }

    const errorMessages = [];

    if (errors.required) {
      errorMessages.push('Il campo è richiesto');
    }

    return errorMessages;
  }
}

type FormControlStatus = 'VALID' | 'INVALID';
