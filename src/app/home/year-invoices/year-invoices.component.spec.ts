import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearInvoicesComponent } from './year-invoices.component';

describe('YearInvoicesComponent', () => {
  let component: YearInvoicesComponent;
  let fixture: ComponentFixture<YearInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
