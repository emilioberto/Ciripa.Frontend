import { Component } from '@angular/core';

import DataSource from 'devextreme/data/data_source';

import { KidsService } from '@app/home/services/kids.service';
import { PresencesService } from '@app/home/services/presences.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { ByDateFilter } from '@app/shared/models/by-date-filter.model';
import { Kid } from '@app/shared/models/kid.model';
import { Presence } from '@app/shared/models/presence.model';
import { SelectBoxDataSourceItem } from '@app/shared/models/select-box-data-source-item.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';

@Component({
  selector: 'app-presences-summary',
  templateUrl: './presences-summary.component.html',
  styleUrls: ['./presences-summary.component.scss']
})
export class PresencesSummaryComponent extends BaseComponent {

  selectedDate = new Date();
  selectedKidId: number;
  fileName: string;

  calendarOptions = { maxZoomLevel: 'year', minZoomLevel: 'century' };
  kids: Kid[];
  kidsDataSource: DataSource;
  presences: Presence[];

  constructor(
    private kidsSvc: KidsService,
    private presencesSvc: PresencesService,
  ) {
    super();
  }

  internalOnInit(): void {
    this.loadKids();
  }

  internalOnDestroy(): void { }

  onDateChanged(event: any): void {
    this.selectedDate = event?.value;
    if (this.selectedKidId) {
      this.loadData();
    }
  }

  onKidChanged(event: any): void {
    this.selectedKidId = event.value;
    const selectedKid = this.kids.find(x => x.id === this.selectedKidId);
    this.fileName = `${selectedKid?.lastName} ${selectedKid?.firstName}`;
    if (this.selectedDate) {
      this.loadData();
    }
  }

  print(): void {

  }

  private loadKids(): void {
    this.kidsSvc.getList()
      .pipe(handleLoading(this))
      .subscribe(
        kids => {
          this.kids = kids;
          this.kidsDataSource = this.getKidsDataSource(kids);
        },
        err => { }
      );
  }

  private loadData(): void {
    const filter: ByDateFilter = { date: this.selectedDate };
    this.presencesSvc.getKidPresencesByMonth(this.selectedKidId, filter)
      .pipe(handleLoading(this))
      .subscribe(
        presences => this.presences = presences,
        err => {}
      );
  }

  private getKidsDataSource(kids: Kid[]): DataSource {
    const items = kids.map(x => {
      return {
        id: x.id,
        description: `${x?.firstName} ${x?.lastName}`
      } as SelectBoxDataSourceItem;
    });

    return new DataSource(items);
  }
}
