import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPresencesComponent } from './extra-presences.component';

describe('ExtraPresencesComponent', () => {
  let component: ExtraPresencesComponent;
  let fixture: ComponentFixture<ExtraPresencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraPresencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraPresencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
