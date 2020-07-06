import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Observable, of, zip } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { ToastsService } from '@app/core/services/toasts.service';
import { ContractsService } from '@app/home/services/contracts.service';
import { SettingsService } from '@app/home/services/settings.service';
import { NewContractDialogComponent } from '@app/home/settings/new-contract-dialog/new-contract-dialog.component';
import { BaseComponent } from '@app/shared/components/base.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { Contract } from '@app/shared/models/contract.model';
import { Settings } from '@app/shared/models/settings.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';
import { applyOnAllControls, nameof } from '@app/shared/utils/utils';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BaseComponent {

  formGroup: FormGroup;
  contracts: Contract[];
  settings: Settings;

  constructor(
    private settingsSvc: SettingsService,
    private fb: FormBuilder,
    private exceptionsSvc: ExceptionsService,
    private toastsSvc: ToastsService,
    private contractsSvc: ContractsService,
    public dialog: MatDialog
  ) {
    super();
  }

  internalOnInit(): void {
    this.buildForm();
    this.loadData();
  }

  internalOnDestroy(): void {
    this.loadData();
  }

  canDeactivate(): Observable<boolean> {
    if (this.formGroup.dirty) {
      const confirmModal = this.dialog.open(ConfirmDialogComponent, {
        data: `Ci sono dati non salvati. Uscire senza salvare?`
      });

      return confirmModal.afterClosed()
        .pipe(
          take(1),
          switchMap(res => of(!!res)),
        );
    }

    return of(true);
  }

  save(): void {
    const settings = this.formGroup.getRawValue() as Settings;

    this.settingsSvc.put(settings)
      .pipe(
        switchMap(() => this.settingsSvc.get()),
        handleLoading(this)
      )
      .subscribe(
        () => {
          applyOnAllControls(this.formGroup, x => x.markAsPristine());
          this.toastsSvc.dataSavedSuccess();
          this.loadData();
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  createContract(): void {
    const createContractDialog = this.dialog.open(NewContractDialogComponent, {
      data: this.settings
    });

    createContractDialog.afterClosed()
      .pipe(take(1))
      .subscribe(
        () => this.loadData(),
        err => this.exceptionsSvc.handle(err)
      );
  }

  private buildForm(): void {
    this.formGroup = this.fb.group({
      [nameof<Settings>('hourCost')]: [null, Validators.required],
      [nameof<Settings>('extraHourCost')]: [null, Validators.required],
      [nameof<Settings>('subscriptionAmount')]: [null, Validators.required]
    });
  }

  private loadData(): void {
    zip(
      this.settingsSvc.get(),
      this.contractsSvc.getList()
    )
      .pipe(handleLoading(this))
      .subscribe(
        ([settings, contracts]) => {
          this.formGroup.patchValue(settings);
          this.settings = settings;
          this.contracts = contracts;
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

}
