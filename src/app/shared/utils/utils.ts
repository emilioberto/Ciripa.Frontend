import { FormControl, FormGroup } from '@angular/forms';

export function nameof<T>(key: Extract<keyof T, string>): string  {
  return key;
}

export function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}

export function validateForm(): void {

}

export function validateFormGroup(formGroup: FormGroup): void {
  applyOnAllControls(formGroup, c => c.markAsDirty());
  applyOnAllControls(formGroup, c => c.markAsTouched());
  applyOnAllControls(formGroup, c => c.updateValueAndValidity());
}

export function applyOnAllControls(formGroup: FormGroup, action: (control: FormControl | FormGroup) => void): void {
  Object.values(formGroup.controls).forEach((control: FormControl | FormGroup) => {
    action(control);

    const childFormGroup = control as FormGroup;
    if (childFormGroup && childFormGroup.controls) {
      this.applyOnAllControls(childFormGroup, action);
    }
  });
}
