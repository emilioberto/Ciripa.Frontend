import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DxDataGridComponent } from 'devextreme-angular';
import { Observable, of } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { ToastsService } from '@app/core/services/toasts.service';
import { PresencesService } from '@app/home/services/presences.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { Presence } from '@app/shared/models/presence.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';

@Component({
  selector: 'app-presences',
  templateUrl: './presences.component.html',
  styleUrls: ['./presences.component.scss']
})
export class PresencesComponent extends BaseComponent {

  @ViewChild(DxDataGridComponent) grid: DxDataGridComponent;

  date = new Date();
  presences: Presence[];
  requiredErrorMessage = 'Inserire orario';
  isDirty = false;

  constructor(
    private presencesSvc: PresencesService,
    private exceptionsSvc: ExceptionsService,
    private toastsSvc: ToastsService,
    public dialog: MatDialog
  ) {
    super();
  }

  internalOnInit(): void {
    this.loadData();
  }

  internalOnDestroy(): void { }

  save(): void {
    const isValid = this.validatePresences();
    if (!isValid) {
      this.toastsSvc.warning('Non è possibile specificare solo entrata o solo uscita. Specificare entrata e uscita oppure nessun valore.');
      return;
    }

    this.presencesSvc.update(this.presences)
      .pipe(handleLoading(this))
      .subscribe(
        () => {
          this.toastsSvc.dataSavedSuccess();
          this.loadData();
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  canDeactivate(): Observable<boolean> {
    if (this.isDirty) {
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

  onDateChanged(event: any): void {
    this.date = event?.value;
    this.loadData();
  }

  morningValidationCallback(event: any): boolean {
    const noMorningEntry = !event?.data?.morningEntry && event?.value;
    const noMorningExit = event?.data?.morningEntry && !event?.value;

    if (noMorningEntry || noMorningExit) {
      return false;
    }
    return true;
  }

  eveningValidationCallback(event: any): boolean {
    const noEveningEntry = !event?.data?.eveningEntry && event?.value;
    const noEveningExit = event?.data?.eveningEntry && !event?.value;

    if (noEveningEntry || noEveningExit) {
      return false;
    }
    return true;
  }

  // This code sucks but i wanna make it work atm...
  onMorningEntryChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.morningEntry = (e.value < 0) ? null : new Date(e.value);
        this.isDirty = true;
      }
      return x;
    });
  }

  onMorningExitChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.morningExit = (e.value < 0) ? null : new Date(e.value);
        this.isDirty = true;
      }
      return x;
    });
  }

  onEveningEntryChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.eveningEntry = (e.value < 0) ? null : new Date(e.value);
        this.isDirty = true;
      }
      return x;
    });
  }

  onEveningExitChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.eveningExit = (e.value < 0) ? null : new Date(e.value);
        this.isDirty = true;
      }
      return x;
    });
  }

  private loadData(): void {
    this.presencesSvc.getList({ date: this.date })
      .pipe(handleLoading(this))
      .subscribe(
        presences => {
          this.presences = presences;
          this.isDirty = false;
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  private validatePresences(): boolean {
    return this.presences.every(x => {
      const validMorning = (x.morningEntry && x.morningExit) || (!x.morningEntry && !x.morningExit);
      const validEvening = (x.eveningEntry && x.eveningExit) || (!x.eveningEntry && !x.eveningExit);
      return validMorning && validEvening;
    });
  }

}
