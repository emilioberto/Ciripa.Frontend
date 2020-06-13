import { Component } from '@angular/core';

import { BaseComponent } from '@app/shared/components/base.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends BaseComponent {

  today: Date;

  constructor() {
    super();
  }

  internalOnInit(): void {
    this.today = new Date();
  }

  internalOnDestroy(): void { }

}
