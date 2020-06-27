import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

import DataSource from 'devextreme/data/data_source';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { ContractsService } from '@app/home/services/contracts.service';
import { ExtraPresencesService } from '@app/home/services/extra-presences.service';
import { KidsService } from '@app/home/services/kids.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { ByDateFilter } from '@app/shared/models/by-date-filter.model';
import { SpecialContract } from '@app/shared/models/contract.model';
import { Kid } from '@app/shared/models/kid.model';
import { PresencesSummary } from '@app/shared/models/presences-summary.model';
import { SelectBoxDataSourceItem } from '@app/shared/models/select-box-data-source-item.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';

@Component({
  selector: 'app-extra-presences-summary',
  templateUrl: './extra-presences-summary.component.html',
  styleUrls: ['./extra-presences-summary.component.scss']
})
export class ExtraPresencesSummaryComponent extends BaseComponent {

  selectedDate = new Date();
  selectedKidId: number;
  fileName: string;
  selectedKid: Kid;

  calendarOptions = { maxZoomLevel: 'year', minZoomLevel: 'century' };
  kids: Kid[];
  kidsDataSource: DataSource;
  presenceSummary: PresencesSummary;
  specialContracts: SpecialContract[];

  constructor(
    private kidsSvc: KidsService,
    private extraPresencesSvc: ExtraPresencesService,
    private datePipe: DatePipe,
    private exceptionsSvc: ExceptionsService,
    private contractsSvc: ContractsService
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
      .pipe(
        map(x => x.filter(y => y.extraServicesEnabled)),
        handleLoading(this)
      )
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
    zip(
      this.extraPresencesSvc.getKidPresencesByMonth(this.selectedKidId, filter),
      this.contractsSvc.getSpecialContractsList()
      )
      .pipe(handleLoading(this))
      .subscribe(
        ([presencesSummary, specialContracts]) => {
          this.presenceSummary = presencesSummary;
          this.specialContracts = specialContracts;
        },
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
