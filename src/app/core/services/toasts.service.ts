import { Injectable } from '@angular/core';

import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable()
export class ToastsService {

  constructor(private toastr: ToastrService) { }

  success(message: string, title?: string, config?: Partial<IndividualConfig>): ActiveToast<any> {
    return this.toastr.success(message, title, config);
  }

  warning(message: string, title?: string, config?: Partial<IndividualConfig>): ActiveToast<any> {
    return this.toastr.warning(message, title, config);
  }

  error(message: string, title?: string, config?: Partial<IndividualConfig>): ActiveToast<any> {
    return this.toastr.error(message, title, config);
  }

  info(message: string, title?: string, config?: Partial<IndividualConfig>): ActiveToast<any> {
    return this.toastr.info(message, title, config);
  }

  // Custom

  dataSavedSuccess(): ActiveToast<any> {
    return this.toastr.success('Dati salvati correttamente');
  }

  invalidForm(): ActiveToast<any> {
    return this.toastr.warning('Dati mancanti e/o non validi');
  }

}
