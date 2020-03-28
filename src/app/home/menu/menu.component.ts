import { Component } from '@angular/core';

import { NavigationService } from '@app/core/services/navigation.service';
import { BaseComponent } from '@app/shared/components/base.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends BaseComponent {

  constructor(
    private navigationSvc: NavigationService
  ) {
    super();
  }

  internalOnInit(): void { }

  internalOnDestroy(): void { }

  kids(): void {
    this.navigationSvc.kids();
  }

  presences(): void {
    this.navigationSvc.presences();
  }

  settings(): void {
    this.navigationSvc.settings();
  }

}
