import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresencesSummaryComponent } from './presences-summary.component';

describe('PresencesSummaryComponent', () => {
  let component: PresencesSummaryComponent;
  let fixture: ComponentFixture<PresencesSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresencesSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresencesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
