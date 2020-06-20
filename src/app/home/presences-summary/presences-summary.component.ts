import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

import DataSource from 'devextreme/data/data_source';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { KidsService } from '@app/home/services/kids.service';
import { PresencesService } from '@app/home/services/presences.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { ByDateFilter } from '@app/shared/models/by-date-filter.model';
import { Kid } from '@app/shared/models/kid.model';
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
  selectedKid: Kid;

  calendarOptions = { maxZoomLevel: 'year', minZoomLevel: 'century' };
  kids: Kid[];
  kidsDataSource: DataSource;
  presenceSummary: PresencesSummary;

  constructor(
    private kidsSvc: KidsService,
    private presencesSvc: PresencesService,
    private datePipe: DatePipe,
    private exceptionsSvc: ExceptionsService
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
    if (this.selectedDate && this.selectedKidId) {
      this.loadData();
    } else {
      this.presenceSummary = null;
    }
  }

  calculateMonthHoursTotal(options: any): void {
    if (options.name === 'monthHoursTotal') {
      options.totalValue = this.presenceSummary.totalHours;
      return;
    }
    if (options.name === 'extraHoursTotal') {
      options.totalValue = this.presenceSummary.totalExtraContractHours;
      return;
    }
    if (options.name === 'extraServiceTimeHoursTotal') {
      options.totalValue = this.presenceSummary.totalExtraServiceTimeHours;
      return;
    }
  }

  print(): void { }

  private loadKids(): void {
    this.kidsSvc.getList()
      .pipe(handleLoading(this))
      .subscribe(
        kids => {
          this.kids = kids;
          this.kidsDataSource = this.getKidsDataSource(kids);
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  private loadData(): void {
    this.selectedKid = this.kids.find(x => x.id === this.selectedKidId);
    this.fileName = `${this.datePipe.transform(this.selectedDate, 'MMMM yyyy')}_${this.selectedKid?.lastName}_${this.selectedKid?.firstName}_`;

    const filter: ByDateFilter = { date: this.selectedDate };
    this.presencesSvc.getKidPresencesByMonth(this.selectedKidId, filter)
      .pipe(handleLoading(this))
      .subscribe(
        presencesSummary => this.presenceSummary = presencesSummary,
        err => this.exceptionsSvc.handle(err)
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
