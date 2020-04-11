import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { Observable } from 'rxjs';

import { ByDateFilter } from '@app/shared/models/by-date-filter.model';
import { Presence } from '@app/shared/models/presence.model';
import { PresencesSummary } from '@app/shared/models/presences-summary.model';

@Injectable()
export class PresencesService {

  private readonly apiUrl = `${environment.baseApiUrl}/presences`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getList(filter: ByDateFilter): Observable<Presence[]> {
    return this.httpClient.post<Presence[]>(`${this.apiUrl}/list`, filter);
  }

  getKidPresencesByMonth(kidId: number, filter: ByDateFilter): Observable<PresencesSummary> {
    return this.httpClient.post<PresencesSummary>(`${this.apiUrl}/list/kid/${kidId}`, filter);
  }

  update(presences: Presence[]): Observable<Presence[]> {
    return this.httpClient.put<Presence[]>(this.apiUrl, presences);
  }

}
