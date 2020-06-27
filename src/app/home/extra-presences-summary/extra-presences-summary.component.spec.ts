import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPresencesSummaryComponent } from './extra-presences-summary.component';

describe('ExtraPresencesSummaryComponent', () => {
  let component: ExtraPresencesSummaryComponent;
  let fixture: ComponentFixture<ExtraPresencesSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraPresencesSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraPresencesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
