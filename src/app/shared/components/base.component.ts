import { OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

export abstract class BaseComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  isLoading = false;

  constructor() { }

  ngOnInit(): void {
    this.internalOnInit();
  }

  ngOnDestroy(): void {
    this.internalOnDestroy();
    this.subscription.unsubscribe();
  }

  abstract internalOnInit(): void;
  abstract internalOnDestroy(): void;

  canDeactivate(): Observable<boolean> | boolean {
    return true;
  }
}
