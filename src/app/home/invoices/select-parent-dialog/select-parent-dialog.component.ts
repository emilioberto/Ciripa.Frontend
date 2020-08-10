import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import DataSource from 'devextreme/data/data_source';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { ToastsService } from '@app/core/services/toasts.service';
import { KidsService } from '@app/home/services/kids.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { Kid } from '@app/shared/models/kid.model';
import { SelectBoxDataSourceItem } from '@app/shared/models/select-box-data-source-item.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';

@Component({
  selector: 'app-select-parent-dialog',
  templateUrl: './select-parent-dialog.component.html',
  styleUrls: ['./select-parent-dialog.component.scss']
})
export class SelectParentDialogComponent extends BaseComponent {

  kids: Kid[];
  parentsDataSource: DataSource;
  selectedId: number;

  constructor(
    public dialogRef: MatDialogRef<SelectParentDialogComponent, Kid>,
    private kidsSvc: KidsService,
    private toastsSvc: ToastsService,
    private exceptionsSvc: ExceptionsService
  ) {
    super();
  }

  internalOnInit(): void {
    this.loadData();
  }

  internalOnDestroy(): void { }

  confirm(): void {
    const selectedKid = this.kids.find(x => x.id === this.selectedId);
    this.dialogRef.close(selectedKid);
  }

  close(): void {
    this.dialogRef.close(null);
  }

  private loadData(): void {
    this.kidsSvc.getList()
      .pipe(handleLoading(this))
      .subscribe(
        kids => {
          this.kids = kids;
          this.parentsDataSource = this.getParentsDataSource(kids);
        },
        err => this.exceptionsSvc.handle(err)
      );
  }

  private getParentsDataSource(kids: Kid[]): DataSource {
    const items = kids.map((x) => {
      const billingParent = (x.parent1.billing || !x.parent2.billing) ? x.parent1 : x.parent2;
      return {
        id: x.id,
        description: `${billingParent.firstName} ${billingParent.lastName}`,
      } as SelectBoxDataSourceItem;
    });

    return new DataSource(items);
  }
}
