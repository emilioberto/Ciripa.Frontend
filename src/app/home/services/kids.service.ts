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

}
