import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { Observable, of, zip } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { NavigationService } from '@app/core/services/navigation.service';
import { ToastsService } from '@app/core/services/toasts.service';
import { KidsService } from '@app/home/services/kids.service';
import { SettingsService } from '@app/home/services/settings.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ContractType, ContractTypesDataSource } from '@app/shared/models/contract-type.enum';
import { Kid } from '@app/shared/models/kid.model';
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

  contractTypesDataSource = ContractTypesDataSource;
  paymentMethodsDataSource = PaymentMethodsDataSource;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private kidsSvc: KidsService,
    private settingsSvc: SettingsService,
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
            this.loadSettings();
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
        filter(x => x),
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
            this.navigationSvc.kids();
            this.toastsSvc.dataSavedSuccess();
          }
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  private loadData(): void {
    zip(this.kidsSvc.get(this.kidId), this.settingsSvc.get())
      .pipe(handleLoading(this))
      .subscribe(
        ([kid, settings]) => {
          this.formGroup.patchValue(kid);
          this.settings = settings;
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  private loadSettings(): void {
    this.settingsSvc.get()
      .pipe(handleLoading(this))
      .subscribe(
        settings => {
          this.settings = settings;
          this.formGroup.patchValue({ [nameof<Kid>('subscriptionAmount')]: settings.subscriptionAmount });
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  private buildForm(): void {
    this.formGroup = this.fb.group({
      [nameof<Kid>('firstName')]: ['', Validators.required],
      [nameof<Kid>('lastName')]: ['', Validators.required],
      [nameof<Kid>('fiscalCode')]: '',
      [nameof<Kid>('birthdate')]: null,
      [nameof<Kid>('from')]: [new Date(), Validators.required],
      [nameof<Kid>('to')]: null,
      [nameof<Kid>('notes')]: '',
      [nameof<Kid>('contractType')]: ['', Validators.required],
      [nameof<Kid>('contractValue')]: 0,
      [nameof<Kid>('subscriptionPaid')]: false,
      [nameof<Kid>('subscriptionAmount')]: 0,
      [nameof<Kid>('parentFirstName')]: ['', Validators.required],
      [nameof<Kid>('parentLastName')]: ['', Validators.required],
      [nameof<Kid>('parentFiscalCode')]: '',
      [nameof<Kid>('address')]: '',
      [nameof<Kid>('city')]: '',
      [nameof<Kid>('cap')]: '',
      [nameof<Kid>('province')]: '',
      [nameof<Kid>('paymentMethod')]: ['', Validators.required],
    });

    this.subscription.add(
      this.formGroup.valueChanges
        .subscribe((kid: Kid) => {
          this.showContractValue = kid.contractType === ContractType.Contract;
          if (kid.contractType === ContractType.Hours) {
            this.formGroup.patchValue({ [nameof<Kid>('contractValue')]: 0 }, { emitEvent: false });
            applyOnAllControls(this.formGroup, x => x.markAsPristine());
          }
        })
    );
  }
}
