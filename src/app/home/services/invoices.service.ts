import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { Observable } from 'rxjs';

import { ByDateFilter } from '@app/shared/models/by-date-filter.model';
import { Invoice } from '@app/shared/models/invoice.model';
import { Presence } from '@app/shared/models/presence.model';

@Injectable()
export class InvoicesService {

  private readonly apiUrl = `${environment.baseApiUrl}/invoices`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getList(filter: ByDateFilter): Observable<Invoice[]> {
    return this.httpClient.post<Invoice[]>(`${this.apiUrl}/list`, filter);
  }

  update(invoices: Presence[]): Observable<Invoice[]> {
    return this.httpClient.put<Invoice[]>(this.apiUrl, invoices);
  }

}
