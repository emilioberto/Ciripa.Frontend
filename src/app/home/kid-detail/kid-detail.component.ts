import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { Observable, of, zip } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { NavigationService } from '@app/core/services/navigation.service';
import { ToastsService } from '@app/core/services/toasts.service';
import { ContractsService } from '@app/home/services/contracts.service';
import { KidsService } from '@app/home/services/kids.service';
import { SettingsService } from '@app/home/services/settings.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { Contract } from '@app/shared/models/contract.model';
import { Kid } from '@app/shared/models/kid.model';
import { Parent } from '@app/shared/models/parent.model';
import { PaymentMethodsDataSource } from '@app/shared/models/payment-method.enum';
import { Settings } from '@app/shared/models/settings.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';
import { applyOnAllControls, nameof, validateFormGroup } from '@app/shared/utils/utils';

@Component({
  selector: 'app-kid-detail',
  templateUrl: './kid-detail.component.html',
  styleUrls: ['./kid-detail.component.scss']
})
export class KidDetailComponent extends BaseComponent {

  formGroup: FormGroup;
  kidId: number;
  settings: Settings;
  showContractValue = false;

  contracts: Contract[];
  paymentMethodsDataSource = PaymentMethodsDataSource;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private kidsSvc: KidsService,
    private settingsSvc: SettingsService,
    private contractsSvc: ContractsService,
    private navigationSvc: NavigationService,
    private exceptionsSvc: ExceptionsService,
    private toastsSvc: ToastsService,
    public dialog: MatDialog
  ) {
    super();
  }

  internalOnInit(): void {
    this.buildForm();
    this.route.params
      .subscribe(
        params => {
          if (params?.id) {
            this.kidId = params.id;
            this.loadData();
          } else {
            this.loadSettingsAndContracts();
          }
        }
      );
  }

  internalOnDestroy(): void { }

  canDeactivate(): Observable<boolean> {
    if (this.formGroup.dirty) {
      const confirmModal = this.dialog.open(ConfirmDialogComponent, {
        data: `Ci sono dati non salvati. Uscire senza salvare?`
      });

      return confirmModal.afterClosed()
        .pipe(
          filter(x => x),
          take(1),
          switchMap(res => of(!!res)),
        );
    }

    return of(true);
  }

  save(): void {
    validateFormGroup(this.formGroup);
    if (this.formGroup.invalid) {
      this.toastsSvc.invalidForm();
      return;
    }

    const upsertKid = this.formGroup.getRawValue() as Kid;

    const obs$ = this.kidId
      ? this.kidsSvc.update(this.kidId, upsertKid)
      : this.kidsSvc.create(upsertKid);

    obs$
      .pipe(handleLoading(this))
      .subscribe(
        kidId => {
          applyOnAllControls(this.formGroup, x => x.markAsPristine());
          this.navigationSvc.kidDetail(kidId);
          this.toastsSvc.dataSavedSuccess();
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  delete(): void {
    const confirmModal = this.dialog.open(ConfirmDialogComponent, {
      data: `Sei sicuro di voler cancellare l'elemento selezionato?`
    });

    confirmModal.afterClosed()
      .pipe(
        take(1),
        switchMap(res => {
          if (res) {
            return this.kidsSvc.delete(this.kidId).pipe(handleLoading(this));
          }
          return of(0);
        }),
      )
      .subscribe(
        result => {
          if (result > 0) {
            applyOnAllControls(this.formGroup, x => x.markAsPristine());
            this.navigationSvc.kids();
            this.toastsSvc.dataSavedSuccess();
          }
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  get parent1FormGroup(): FormGroup {
    return this.formGroup.controls[nameof<Kid>('parent1')] as FormGroup;
  }

  get parent2FormGroup(): FormGroup {
    return this.formGroup.controls[nameof<Kid>('parent2')] as FormGroup;
  }

  private loadData(): void {
    zip(
      this.kidsSvc.get(this.kidId),
      this.settingsSvc.get(),
      this.contractsSvc.getList()
    )
      .pipe(handleLoading(this))
      .subscribe(
        ([kid, settings, contracts]) => {
          this.formGroup.patchValue(kid);
          this.settings = settings;
          this.contracts = contracts;
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  private loadSettingsAndContracts(): void {
    zip(
      this.settingsSvc.get(),
      this.contractsSvc.getList()
    )
      .pipe(handleLoading(this))
      .subscribe(
        ([settings, contracts]) => {
          this.settings = settings;
          this.contracts = contracts;
          this.formGroup.patchValue({ [nameof<Kid>('subscriptionAmount')]: settings.subscriptionAmount });
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  private buildForm(): void {
    this.formGroup = this.fb.group({
      [nameof<Kid>('id')]: { value: 0, disabled: true },
      [nameof<Kid>('firstName')]: ['', Validators.required],
      [nameof<Kid>('lastName')]: ['', Validators.required],
      [nameof<Kid>('fiscalCode')]: '',
      [nameof<Kid>('birthdate')]: null,
      [nameof<Kid>('from')]: [new Date(), Validators.required],
      [nameof<Kid>('to')]: null,
      [nameof<Kid>('notes')]: '',
      [nameof<Kid>('contractId')]: ['', Validators.required],
      [nameof<Kid>('subscriptionPaidDate')]: null,
      [nameof<Kid>('subscriptionAmount')]: 0,
      [nameof<Kid>('extraServicesEnabled')]: false,
      [nameof<Kid>('parent1')]: this.buildParentFormGroup(true),
      [nameof<Kid>('parent2')]: this.buildParentFormGroup(),
      [nameof<Kid>('paymentMethod')]: ['', Validators.required],
    });
  }

  private buildParentFormGroup(required: boolean = false): FormGroup {
    return this.fb.group({
      [nameof<Parent>('firstName')]: ['', required ? Validators.required : null],
      [nameof<Parent>('lastName')]: ['', required ? Validators.required : null],
      [nameof<Parent>('fiscalCode')]: ['', required ? Validators.required : null],
      [nameof<Parent>('phone')]: ['', required ? Validators.required : null],
      [nameof<Parent>('email')]: ['', required ? Validators.required : null],
      [nameof<Parent>('address')]: ['', required ? Validators.required : null],
      [nameof<Parent>('city')]: ['', required ? Validators.required : null],
      [nameof<Parent>('cap')]: ['', required ? Validators.required : null],
      [nameof<Parent>('province')]: ['', required ? Validators.required : null],
      [nameof<Parent>('billing')]: false
    });
  }
}
