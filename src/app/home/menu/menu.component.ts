import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { MenuService } from '@app/home/services/menu.service';
import { BaseComponent } from '@app/shared/components/base.component';
import { AppSection } from '@app/shared/models/menu-item.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends BaseComponent {

  appSections = AppSection;
  activeMenuItem$: Observable<AppSection>;
  menuItems: MenuItem[] = [
    { label: 'Bambini', class: 'bx-face', appSection: AppSection.Kids },
    { label: 'Appello', class: 'bx-calendar', appSection: AppSection.Presences },
    { label: 'Riepilogo presenze', class: 'bx-list-check', appSection: AppSection.Summary },
    { label: 'Resoconto fatture mensile', class: 'bx-money', appSection: AppSection.Invoices },
    { label: 'Impostazioni', class: 'bx-cog', appSection: AppSection.Settings },
    { label: 'Stampe', class: 'bxs-file-pdf', appSection: AppSection.Prints}
  ];

  constructor(
    private menuSvc: MenuService
  ) {
    super();
  }

  internalOnInit(): void {
    this.activeMenuItem$ = this.menuSvc.activeMenuItem$.asObservable();
  }

  internalOnDestroy(): void { }

  handleClick(menuItem: AppSection): void {
    this.menuSvc.handleMenuClick(menuItem);
  }

}

interface MenuItem {
  label: string;
  class: string;
  appSection: AppSection;
}
