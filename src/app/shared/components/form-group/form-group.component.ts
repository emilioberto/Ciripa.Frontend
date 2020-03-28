import { Component, forwardRef, Input } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  disabled = false;
  value: any;

  constructor() {
    super();
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

  // Control value accessor methods
  onChange(newVal: any): void { }
  onTouched(_?: any): void { }
  writeValue(obj: any): void { this.value = obj; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }

}

type FormControlStatus = 'VALID' | 'INVALID';
