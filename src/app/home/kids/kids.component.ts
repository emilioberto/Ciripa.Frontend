import { Component } from '@angular/core';

import { BaseComponent } from '@app/shared/components/base.component';

@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.scss']
})
export class KidsComponent extends BaseComponent {

  constructor() {
    super();
  }

  internalOnInit(): void {

  }

  internalOnDestroy(): void { }

}
