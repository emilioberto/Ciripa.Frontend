import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { Observable } from 'rxjs';

import { Contract } from '@app/shared/models/contract.model';

@Injectable()
export class ContractsService {

  private readonly apiUrl = `${environment.baseApiUrl}/contracts`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getList(): Observable<Contract[]> {
    return this.httpClient.get<Contract[]>(this.apiUrl);
  }

  create(contract: Contract): Observable<number> {
    return this.httpClient.post<number>(this.apiUrl, contract);
  }

  update(id: number, contract: Contract): Observable<number> {
    return this.httpClient.put<number>(`${this.apiUrl}/${id}`, contract);
  }
}
