import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { NavigationService } from '@app/core/services/navigation.service';
import { AppSection } from '@app/shared/models/menu-item.enum';
import { assertNever } from '@app/shared/utils/utils';

@Injectable()
export class MenuService {
  activeMenuItem$ = new BehaviorSubject<AppSection>(null);

  constructor(private navigationSvc: NavigationService) {}

  handleMenuClick(menuItem: AppSection): void {
    this.activeMenuItem$.next(menuItem);
    switch (menuItem) {
      case AppSection.Kids:
        this.navigationSvc.kids();
        break;
      case AppSection.Presences:
        this.navigationSvc.presences();
        break;
      case AppSection.ExtraPresences:
        this.navigationSvc.extraPresences();
        break;
      case AppSection.PresencesSummary:
        this.navigationSvc.presencesSummary();
        break;
      case AppSection.ExtraPresencesSummary:
        this.navigationSvc.extraPresencesSummary();
        break;
      case AppSection.Settings:
        this.navigationSvc.settings();
        break;
      case AppSection.Invoices:
        this.navigationSvc.invoices();
        break;
      case AppSection.YearInvoicesTotal:
        this.navigationSvc.yearInvoices();
        break;
      case AppSection.Prints:
        this.navigationSvc.prints();
        break;
      default:
        assertNever(menuItem);
    }
  }
}
