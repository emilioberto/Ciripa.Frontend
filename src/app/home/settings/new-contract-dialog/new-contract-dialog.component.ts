import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { ToastsService } from '@app/core/services/toasts.service';
import { ContractsService } from '@app/home/services/contracts.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { Contract } from '@app/shared/models/contract.model';
import { Settings } from '@app/shared/models/settings.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';
import { nameof, validateFormGroup } from '@app/shared/utils/utils';

@Component({
  selector: 'app-new-contract-dialog',
  templateUrl: './new-contract-dialog.component.html',
  styleUrls: ['./new-contract-dialog.component.scss']
})
export class NewContractDialogComponent extends BaseComponent {

  formGroup: FormGroup;
  defaultStartTime: Date = new Date(new Date().setHours(7, 0, 0, 0));
  defaultEndTime: Date = new Date(new Date().setHours(19, 0, 0, 0));

  constructor(
    public dialogRef: MatDialogRef<NewContractDialogComponent>,
    private fb: FormBuilder,
    private contractsSvc: ContractsService,
    private toastsSvc: ToastsService,
    private exceptionsSvc: ExceptionsService,
    @Inject(MAT_DIALOG_DATA) public settings: Settings
  ) {
    super();
  }

  internalOnInit(): void {
    this.buildForm();
  }

  internalOnDestroy(): void { }

  confirm(): void {
    validateFormGroup(this.formGroup);
    if (this.formGroup.invalid) {
      this.toastsSvc.invalidForm();
      return;
    }

    const contract = this.formGroup.getRawValue() as Contract;

    this.contractsSvc.create(contract)
      .pipe(handleLoading(this))
      .subscribe(
        () => {
          this.toastsSvc.dataSavedSuccess();
          this.dialogRef.close(true);
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  close(): void {
    this.dialogRef.close(false);
  }

  private buildForm(): void {
    this.formGroup = this.fb.group({
      [nameof<Contract>('description')]: ['', Validators.required],
      [nameof<Contract>('monthlyContract')]: false,
      [nameof<Contract>('dailyHours')]: [0, Validators.required],
      [nameof<Contract>('monthlyHours')]: [0, Validators.required],
      [nameof<Contract>('hourCost')]: [this.settings.hourCost, Validators.required],
      [nameof<Contract>('extraHourCost')]: [this.settings.extraHourCost, Validators.required],
      [nameof<Contract>('startTime')]: [this.defaultStartTime, Validators.required],
      [nameof<Contract>('endTime')]: [this.defaultEndTime, Validators.required],
      [nameof<Contract>('minContractValue')]: [0, Validators.required],
    });
  }
}
