import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export enum AppStates {
  Home = 'home',
  Login = 'login',
  NotFound = 'not-found'
}

export enum HomeStates {
  Kids = 'kids',
  KidDetail = 'kid-detail',
  Invoices = 'invoices',
  Presences = 'presences',
  Summary = 'summary',
  Settings = 'settings',
}

@Injectable()
export class NavigationService {

  constructor(
    private router: Router
  ) { }

  home(): Promise<boolean> {
    return this.router.navigate([AppStates.Home]);
  }

  login(): Promise<boolean> {
    return this.router.navigate([AppStates.Login]);
  }

  notFound(): Promise<boolean> {
    return this.router.navigate([AppStates.NotFound]);
  }

  kids(): Promise<boolean> {
    return this.router.navigate([AppStates.Home, HomeStates.Kids]);
  }

  kidDetail(id?: number): Promise<boolean> {
    return id
      ? this.router.navigate([AppStates.Home, HomeStates.KidDetail, id])
      : this.router.navigate([AppStates.Home, HomeStates.KidDetail]);
  }

  invoices(): Promise<boolean> {
    return this.router.navigate([AppStates.Home, HomeStates.Invoices]);
  }

  presences(): Promise<boolean> {
    return this.router.navigate([AppStates.Home, HomeStates.Presences]);
  }

  summary(): Promise<boolean> {
    return this.router.navigate([AppStates.Home, HomeStates.Summary]);
  }

  settings(): Promise<boolean> {
    return this.router.navigate([AppStates.Home, HomeStates.Settings]);
  }

}
