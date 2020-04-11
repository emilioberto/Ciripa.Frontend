import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

import DataSource from 'devextreme/data/data_source';

import { KidsService } from '@app/home/services/kids.service';
import { PresencesService } from '@app/home/services/presences.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { ByDateFilter } from '@app/shared/models/by-date-filter.model';
import { Kid } from '@app/shared/models/kid.model';
import { PresenceListItem } from '@app/shared/models/presence-list-item.model';
import { PresencesSummary } from '@app/shared/models/presences-summary.model';
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
  presenceSummary: PresencesSummary;

  constructor(
    private kidsSvc: KidsService,
    private presencesSvc: PresencesService,
    private datePipe: DatePipe,
  ) {
    super();

    this.calculateMonthHoursTotal = this.calculateMonthHoursTotal.bind(this);
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
    if (this.selectedDate) {
      this.loadData();
    }
  }

  calculateMonthHoursTotal(options: any): void {
    if (options.name === 'monthHoursTotal') {
      options.totalValue = this.presenceSummary.totalHours;
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
    const selectedKid = this.kids.find(x => x.id === this.selectedKidId);
    this.fileName = `${this.datePipe.transform(this.selectedDate, 'MMMM yyyy')}_${selectedKid?.lastName}_${selectedKid?.firstName}_`;

    const filter: ByDateFilter = { date: this.selectedDate };
    this.presencesSvc.getKidPresencesByMonth(this.selectedKidId, filter)
      .pipe(handleLoading(this))
      .subscribe(
        presencesSummary => this.presenceSummary = presencesSummary,
        err => { }
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
