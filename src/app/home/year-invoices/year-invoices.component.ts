import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DxDataGridComponent } from 'devextreme-angular';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { InvoicesService } from '@app/home/services/invoices.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { PaymentMethodsDataSource } from '@app/shared/models/payment-method.enum';
import { YearInvoicesTotal } from '@app/shared/models/year-total-invoice.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';

@Component({
  selector: 'app-year-invoices',
  templateUrl: './year-invoices.component.html',
  styleUrls: ['./year-invoices.component.scss']
})
export class YearInvoicesComponent extends BaseComponent {
  @ViewChild(DxDataGridComponent) grid: DxDataGridComponent;

  selectedDate = new Date();
  invoices: YearInvoicesTotal[];
  isDirty = false;
  calendarOptions = { maxZoomLevel: 'decade', minZoomLevel: 'century' };

  constructor(
    private invoicesSvc: InvoicesService,
    private exceptionsSvc: ExceptionsService,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    super();
  }

  internalOnInit(): void {
    this.loadData();
  }

  internalOnDestroy(): void {}

  onDateChanged(event: any): void {
    this.selectedDate = event?.value;
    this.loadData();
  }

  get fileName(): string {
    return `Resoconto fatture annuale ${this.datePipe.transform(
      this.selectedDate,
      'yyyy'
    )}`;
  }

  private loadData(): void {
    this.invoicesSvc
      .getYearList({ date: this.selectedDate })
      .pipe(handleLoading(this))
      .subscribe(
        (invoices) => {
          this.invoices = invoices;
        },
        (err) => this.exceptionsSvc.handle(err)
      );
  }

}
