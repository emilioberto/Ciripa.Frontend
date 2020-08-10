import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DxDataGridComponent } from 'devextreme-angular';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { ToastsService } from '@app/core/services/toasts.service';
import { SelectParentDialogComponent } from '@app/home/invoices/select-parent-dialog/select-parent-dialog.component';
import { InvoicesService } from '@app/home/services/invoices.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { Invoice } from '@app/shared/models/invoice.model';
import { Kid } from '@app/shared/models/kid.model';
import { PaymentMethod, PaymentMethodsDataSource } from '@app/shared/models/payment-method.enum';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent extends BaseComponent {
  @ViewChild(DxDataGridComponent) grid: DxDataGridComponent;

  selectedDate = new Date();
  invoices: Invoice[];
  requiredErrorMessage = 'Inserire orario';
  isDirty = false;
  calendarOptions = { maxZoomLevel: 'year', minZoomLevel: 'century' };
  paymentMethods = PaymentMethodsDataSource;

  constructor(
    private invoicesSvc: InvoicesService,
    private exceptionsSvc: ExceptionsService,
    private toastsSvc: ToastsService,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    super();
  }

  internalOnInit(): void {
    this.loadData();
  }

  internalOnDestroy(): void {}

  save(): void {
    this.grid.instance.saveEditData();
    const isValid = this.validateInvoices();
    if (!isValid) {
      this.toastsSvc.warning(
        'Non è possibile specificare solo entrata o solo uscita. Specificare entrata e uscita oppure nessun valore.'
      );
      return;
    }

    this.invoicesSvc
      .update(this.invoices)
      .pipe(handleLoading(this))
      .subscribe(
        () => {
          this.toastsSvc.dataSavedSuccess();
          this.loadData();
        },
        (err) => this.exceptionsSvc.handle(err)
      );
  }

  addRow(): void {
    const createContractDialog = this.dialog.open(SelectParentDialogComponent);

    createContractDialog.afterClosed()
      .pipe(take(1))
      .subscribe(
        (kid: Kid) => {
          if (!kid) {
            return;
          }
          const newRow: Invoice = {
            kidId: kid.id,
            kid,
            billingParent: (kid.parent1.billing || !kid.parent2.billing) ? kid.parent1 : kid.parent2,
            number: null,
            date: this.invoices[0].date,
            hours: 0,
            paymentDate: null,
            subscriptionAmount: null,
            subscriptionPaidDate: null
          };
          this.invoices.push(newRow);
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  canDeactivate(): Observable<boolean> {
    if (this.isDirty) {
      const confirmModal = this.dialog.open(ConfirmDialogComponent, {
        data: `Ci sono dati non salvati. Uscire senza salvare?`,
      });

      return confirmModal.afterClosed().pipe(
        take(1),
        switchMap((res) => of(!!res))
      );
    }

    return of(true);
  }

  onDateChanged(event: any): void {
    this.selectedDate = event?.value;
    this.loadData();
  }

  onPaymentDateChanged(e: any, id: number): void {
    this.invoices = this.invoices.map((x) => {
      if (x.id === id) {
        x.paymentDate = e.value < 0 ? null : new Date(e.value);
        this.isDirty = true;
      }
      return x;
    });
  }

  get fileName(): string {
    return `Resoconto fatture mese ${this.datePipe.transform(
      this.selectedDate,
      'MMMM yyyy'
    )}`;
  }

  print(): void {
    const doc = new jsPDF();
    const pdfName = `Resoconto fatture mensile  servizi extra ${this.datePipe.transform(
      this.selectedDate,
      'MMMM yyyy'
    )}`;
    doc.setFontSize(18);
    doc.text(pdfName, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const presencesHead = [
      [pdfName, null, null, null, null, null, null, null],
      [
        'Nome',
        'Cognome',
        'Metodo pagamento',
        'Data pagamento',
        'Numero fattura',
        'Iscrizione',
        'Data pagamento iscrizione',
        'Totale'
      ],
    ];

    const presencesBody = this.invoices.map((i) => {
      const parent = i.kid?.parent2?.billing ? i.kid.parent2 : i.kid.parent1;
      return [
        parent.firstName,
        parent.lastName,
        i.paymentMethod === null ? null : (i.paymentMethod === PaymentMethod.Cash) ? 'Contanti' : 'Bonifico',
        i.paymentDate ? this.datePipe.transform(i.paymentDate, 'shortDate') : null,
        i.number,
        i.invoiceAmount,
        i.subscriptionPaidDate ? this.datePipe.transform(i.subscriptionPaidDate, 'shortDate') : null,
        i.amount
      ];
    });

    doc.autoTable({
      head: presencesHead,
      body: presencesBody,
      startY: 30,
      showHead: 'firstPage',
    });

    doc.save(pdfName);
  }

  private loadData(): void {
    this.invoicesSvc
      .getList({ date: this.selectedDate })
      .pipe(handleLoading(this))
      .subscribe(
        (invoices) => {
          this.invoices = invoices;
          this.isDirty = false;
        },
        (err) => this.exceptionsSvc.handle(err)
      );
  }

  private validateInvoices(): boolean {
    return this.invoices.every((x) => {
      // const validMorning = (x.morningEntry && x.morningExit) || (!x.morningEntry && !x.morningExit);
      // const validEvening = (x.eveningEntry && x.eveningExit) || (!x.eveningEntry && !x.eveningExit);
      // return validMorning && validEvening;
      return true;
    });
  }
}
