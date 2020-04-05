import { Component } from '@angular/core';

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
    private presencesSvc: PresencesService
  ) {
    super();
  }

  internalOnInit(): void {
    this.loadData();
  }

  internalOnDestroy(): void { }

  save(): void {
    // const presences = this.formGroup.getRawValue();
    // this.presencesSvc.update(presences)
    //   .pipe(handleLoading(this))
    //   .subscribe(
    //     () => this.loadData(),
    //     err => console.error(err)
    //   );
  }

  onDateChanged(event: any): void {
    this.date = event?.value;
    this.loadData();
  }

  // This code sucks but i wanna make it work atm...
  onMorningEntryChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.morningEntry = e.value;
      }
      return x;
    });
  }

  onMorningExitChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.morningExit = e.value;
      }
      return x;
    });
  }

  onEveningEntryChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.eveningEntry = e.value;
      }
      return x;
    });
  }

  onEveningExitChanged(e: any, id: number): void {
    this.presences = this.presences.map(x => {
      if (x.id === id) {
        x.eveningExit = e.value;
      }
      return x;
    });
  }

  private loadData(): void {
    this.presencesSvc.getList({ date: this.date })
      .pipe(handleLoading(this))
      .subscribe(
        presences => this.presences = presences.map(x => {
          x.morningEntry = new Date();
          return x;
        }),
        err => console.error(err)
      );
  }
}
