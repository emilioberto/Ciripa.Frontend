import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap } from 'rxjs/operators';

import { SettingsService } from '@app/home/services/settings.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { Settings } from '@app/shared/models/settings.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';
import { nameof } from '@app/shared/utils/utils';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BaseComponent {

  formGroup: FormGroup;

  constructor(
    private settingsSvc: SettingsService,
    private fb: FormBuilder
  ) {
    super();
  }

  internalOnInit(): void {
    this.buildForm();
    this.loadData();
  }

  internalOnDestroy(): void { }

  save(): void {
    const settings = this.formGroup.getRawValue() as Settings;

    this.settingsSvc.put(settings)
      .pipe(
        switchMap(() => this.settingsSvc.get()),
        handleLoading(this)
      )
      .subscribe(
        () => this.formGroup.patchValue(settings),
        err => { }
      );
  }

  private buildForm(): void {
    this.formGroup = this.fb.group({
      [nameof<Settings>('hourCost')]: [null, Validators.required],
      [nameof<Settings>('extraHourCost')]: [null, Validators.required],
      [nameof<Settings>('contractAmount')]: [null, Validators.required]
    });
  }

  private loadData(): void {
    this.settingsSvc.get()
      .pipe(handleLoading(this))
      .subscribe(
        settings => this.formGroup.patchValue(settings),
        err => { }
      );
  }

}
