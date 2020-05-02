import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { InvoicesService } from '@app/home/services/invoices.service';
import { PresencesService } from '@app/home/services/presences.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { ByDateFilter } from '@app/shared/models/by-date-filter.model';
import { Invoice } from '@app/shared/models/invoice.model';
import { PaymentMethod } from '@app/shared/models/payment-method.enum';
import { Presence } from '@app/shared/models/presence.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';

@Component({
  selector: 'app-prints',
  templateUrl: './prints.component.html',
  styleUrls: ['./prints.component.scss'],
  providers: [DatePipe]
})
export class PrintsComponent extends BaseComponent {

  selectedMonth = new Date();
  summarySelectedMonth = new Date();
  calendarOptions = { maxZoomLevel: 'year', minZoomLevel: 'century' };

  constructor(
    private presencesSvc: PresencesService,
    private exceptionsSvc: ExceptionsService,
    private invoicesSvc: InvoicesService,
    private datePipe: DatePipe
  ) {
    super();
  }

  internalOnInit(): void { }

  internalOnDestroy(): void { }

  printPresences(): void {
    const todayFilter: ByDateFilter = { date: new Date() };
    this.presencesSvc.getList(todayFilter)
      .pipe(
        handleLoading(this)
      )
      .subscribe(
        presences => {
          const doc = new jsPDF();

          const pdfName = `Appello ${this.datePipe.transform(new Date(), 'shortDate')}`;

          doc.setFontSize(18);
          doc.text(pdfName, 14, 22);
          doc.setFontSize(11);
          doc.setTextColor(100);

          const presencesHead = [
            [pdfName, null, null, null, null, null],
            ['Nome', 'Cognome', 'Entrata Mattina', 'Uscita mattina', 'Entrata pomeriggio', 'Uscita pomeriggio']
          ];

          const presencesBody = this.presencesTableMapper(presences);

          doc.autoTable({
            head: presencesHead,
            body: presencesBody,
            startY: 30,
            showHead: 'firstPage',
          });

          doc.save(pdfName);
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  printMonthlyPresences(): void {
    const todayFilter: ByDateFilter = { date: new Date() };
    this.presencesSvc.getList(todayFilter)
      .pipe(
        handleLoading(this)
      )
      .subscribe(
        presences => {
          const doc = new jsPDF();

          const pdfName = `Appello mensile`;
          const days = this.getDaysInMonth(this.selectedMonth);
          const presencesBody = this.presencesTableMapper(presences);

          days.forEach(day => {
            const presencesHead = [
              [`Appello ${this.datePipe.transform(day, 'shortDate')}`, null, null, null, null, null],
              ['Nome', 'Cognome', 'Entrata Mattina', 'Uscita mattina', 'Entrata pomeriggio', 'Uscita pomeriggio']
            ];

            doc.autoTable({
              head: presencesHead,
              body: presencesBody,
              startY: 0,
              pageBreak: 'always',
            });
          });

          doc.deletePage(1);
          doc.save(pdfName);
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  printMonthlySummary(): void {
    const todayFilter: ByDateFilter = { date: this.summarySelectedMonth };
    this.invoicesSvc.getList(todayFilter)
      .pipe(
        handleLoading(this)
      )
      .subscribe(
        invoices => {
          const doc = new jsPDF();

          const pdfName = `Riepilogo del mese ${this.datePipe.transform(this.summarySelectedMonth, 'MMMM')}`;

          const presencesHead = [
            [`Appello ${this.datePipe.transform(this.summarySelectedMonth, 'MMMM')}`, null, null, null, null, null, null, null],
            ['Nome', 'Cognome', 'Metodo pagamento', 'Data pagamento', 'Numero fattura', 'Ore totali', 'Costo previsto', 'Costo fatturato']
          ];
          const presencesBody = this.summaryTableMapper(invoices);

          doc.autoTable({
            head: presencesHead,
            body: presencesBody,
            startY: 30,
            showHead: 'firstPage',
          });

          doc.save(pdfName);
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  // Utility methods

  presencesTableMapper(presences: Presence[]): any {
    return presences.map(p => {
      return [p.kid?.firstName, p.kid?.lastName, null, null, null, null];
    });
  }

  summaryTableMapper(invoices: Invoice[]): any {
    return invoices.map(p => {
      let paymentMethodDescription = '';
      if (p.paymentMethod !== null && p.paymentMethod !== undefined) {
        paymentMethodDescription = p.paymentMethod === PaymentMethod.Cash ? 'Contanti' : 'Bonifico';
      }

      return [p.kid?.firstName, p.kid?.lastName, paymentMethodDescription, this.datePipe.transform(p.paymentDate, 'shortDate'), p.number, p.hours, p.amount, p.invoiceAmount];
    });
  }

  getDaysInMonth(date: Date): Date[] {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return (new Array(31)).fill('').map((v, i) => new Date(year, month - 1, i + 1)).filter(v => v.getMonth() === month - 1);
  }

}