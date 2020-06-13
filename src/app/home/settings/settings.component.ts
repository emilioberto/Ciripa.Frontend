import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Observable, of } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { ToastsService } from '@app/core/services/toasts.service';
import { SettingsService } from '@app/home/services/settings.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
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

  constructor(
    private settingsSvc: SettingsService,
    private fb: FormBuilder,
    private exceptionsSvc: ExceptionsService,
    private toastsSvc: ToastsService,
    public dialog: MatDialog
  ) {
    super();
  }

  internalOnInit(): void {
    this.buildForm();
    this.loadData();
  }

  internalOnDestroy(): void { }

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

  private buildForm(): void {
    this.formGroup = this.fb.group({
      [nameof<Settings>('hourCost')]: [null, Validators.required],
      [nameof<Settings>('extraHourCost')]: [null, Validators.required],
      [nameof<Settings>('subscriptionAmount')]: [null, Validators.required]
    });
  }

  private loadData(): void {
    this.settingsSvc.get()
      .pipe(handleLoading(this))
      .subscribe(
        settings => this.formGroup.patchValue(settings),
        err => this.exceptionsSvc.handle(err)
      );
  }

}
