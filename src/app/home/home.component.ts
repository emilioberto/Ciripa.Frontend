import { Component } from '@angular/core';

import { BaseComponent } from '@app/shared/components/base.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent {

  constructor() {
    super();
  }

  internalOnInit(): void { }

  internalOnDestroy(): void { }

}
