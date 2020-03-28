import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { Observable } from 'rxjs';

import { Settings } from '@app/shared/models/settings.model';

@Injectable()
export class SettingsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  get(): Observable<Settings> {
    return this.httpClient.get<Settings>(`${environment.baseApiUrl}/settings`);
  }

  put(settings: Settings): Observable<number> {
    return this.httpClient.put<number>(`${environment.baseApiUrl}/settings`, settings);
  }

}
