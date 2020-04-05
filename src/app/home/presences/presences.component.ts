import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { PresencesService } from '@app/home/services/presences.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { Presence } from '@app/shared/models/presence.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';

@Component({
  selector: 'app-presences',
  templateUrl: './presences.component.html',
  styleUrls: ['./presences.component.scss']
})
export class PresencesComponent extends BaseComponent {

  date = new Date();
  presencesFormGroups: FormGroup[];
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private presencesSvc: PresencesService
  ) {
    super();
  }

  internalOnInit(): void {
    this.buildForm();
    this.loadData();
  }

  internalOnDestroy(): void { }

  save(): void {
    const presences = this.formGroup.getRawValue();
    this.presencesSvc.update(presences)
      .pipe(handleLoading(this))
      .subscribe(
        () => this.loadData(),
        err => console.error(err)
      );
  }

  onDateChanged(event: any): void {
    this.date = event?.value;
    this.loadData();
  }

  private buildForm(): void {
    this.formGroup = this.fb.group({
      presences: new FormArray([])
    });
  }

  private buildPresencesFormArray(presences: Presence[]): void {
    presences.forEach(p => {
      (this.formGroup.get('presences') as FormArray).push(
        this.fb.group({
          id: p?.id,
          date: p?.date,
          morningEntry: p?.morningEntry,
          morningExit: p?.morningExit,
          eveningEntry: p?.eveningEntry,
          eveningExit: p?.eveningExit,
          kidName: { value: `${p?.kid?.firstName} ${p?.kid?.lastName}`, disabled: true }
        })
      );
    });
  }

  private loadData(): void {
    this.presencesSvc.getList({ date: this.date })
      .pipe(handleLoading(this))
      .subscribe(
        presences => {
          this.buildForm();
          this.buildPresencesFormArray(presences);
          this.presencesFormGroups = (this.formGroup.get('presences') as FormArray).controls as FormGroup[];
        },
        err => console.error(err)
      );
  }
}
