import { Component } from '@angular/core';

import { BaseComponent } from '@app/shared/components/base.component';

@Component({
  selector: 'app-hbf-template',
  templateUrl: './hbf-template.component.html',
  styleUrls: ['./hbf-template.component.scss']
})
export class HbfTemplateComponent extends BaseComponent {

  constructor() {
    super();
  }

  internalOnInit(): void { }
  internalOnDestroy(): void { }
}
