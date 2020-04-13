import { Component } from '@angular/core';

import { ExceptionsService } from '@app/core/services/exceptions.service';
import { NavigationService } from '@app/core/services/navigation.service';
import { KidsService } from '@app/home/services/kids.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { Kid } from '@app/shared/models/kid.model';
import { handleLoading } from '@app/shared/utils/custom-rxjs-operators';

@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.scss']
})
export class KidsComponent extends BaseComponent {

  dataSource: Kid[];

  constructor(
    private kidsSvc: KidsService,
    private navigationSvc: NavigationService,
    private exceptionsSvc: ExceptionsService
  ) {
    super();
  }

  internalOnInit(): void {
    this.loadData();
  }

  internalOnDestroy(): void { }

  onSelection(event: any): void {
    if (!event?.selectedRowsData?.length) {
      return;
    }

    const id = (event.selectedRowsData[0] as Kid).id;
    this.navigationSvc.kidDetail(id);
  }

  add(): void {
    this.navigationSvc.kidDetail();
  }

  private loadData(): void {
    this.kidsSvc.getList()
      .pipe(handleLoading(this))
      .subscribe(
        kids => this.dataSource = kids,
        err => this.exceptionsSvc.handle(err)
      );
  }

}
