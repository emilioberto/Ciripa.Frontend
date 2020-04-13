import { Component } from '@angular/core';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { ToastsService } from '@app/core/services/toasts.service';
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
  presences: Presence[];

  constructor(
    private presencesSvc: PresencesService,
    private exceptionsSvc: ExceptionsService,
    private toastsSvc: ToastsService
  ) {
    super();
  }

  internalOnInit(): void {
    this.loadData();
  }

  internalOnDestroy(): void { }

  save(): void {
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

  onDateChanged(event: any): void {
    this.date = event?.value;
    this.loadData();
  }

  // This code sucks but i wanna make it work atm...
  onMorningEntryChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.morningEntry = new Date(e.value);
      }
      return x;
    });
  }

  onMorningExitChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.morningExit = new Date(e.value);
      }
      return x;
    });
  }

  onEveningEntryChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.eveningEntry = new Date(e.value);
      }
      return x;
    });
  }

  onEveningExitChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.eveningExit = new Date(e.value);
      }
      return x;
    });
  }

  private loadData(): void {
    this.presencesSvc.getList({ date: this.date })
      .pipe(handleLoading(this))
      .subscribe(
        presences => this.presences = presences,
        err => this.exceptionsSvc.handle(err)
      );
  }
}
