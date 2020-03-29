import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { Observable } from 'rxjs';

import { Kid } from '@app/shared/models/kid.model';

@Injectable()
export class KidsService {

  private readonly apiUrl = `${environment.baseApiUrl}/kids`;

  constructor(
    private httpClient: HttpClient
  ) { }

  get(id: number): Observable<Kid> {
    return this.httpClient.get<Kid>(`${this.apiUrl}/${id}`);
  }

  getList(): Observable<Kid[]> {
    return this.httpClient.get<Kid[]>(this.apiUrl);
  }

  create(kid: Kid): Observable<number> {
    return this.httpClient.post<number>(this.apiUrl, kid);
  }

  update(id: number, kid: Kid): Observable<number> {
    return this.httpClient.put<number>(`${this.apiUrl}/${id}`, kid);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
