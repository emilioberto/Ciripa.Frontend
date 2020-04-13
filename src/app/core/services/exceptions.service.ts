import { Injectable } from '@angular/core';

import { ActiveToast } from 'ngx-toastr';

import { ToastsService } from '@app/core/services/toasts.service';

@Injectable()
export class ExceptionsService {

  constructor(private toastsSvc: ToastsService) { }

  handle(err: any): ActiveToast<any> {
    return this.toastsSvc.error(this.getErrorDescription(err));
  }

  private getErrorDescription(err: any): string {
    if (err?.status !== null && err?.status !== undefined) {
      switch (err.status) {
        case 0:
          return 'Errore di rete';
        case 400:
          return 'Dati non validi';
        case 404:
          return 'Dati non trovati';
        case 402:
          return 'Non autorizzato';
        case 500:
        default:
          return 'Qualcosa è andato storto';
      }
    }

    return 'Qualcosa è andato storto';
  }
}
