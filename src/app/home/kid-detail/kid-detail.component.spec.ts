import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KidDetailComponent } from './kid-detail.component';

describe('KidDetailComponent', () => {
  let component: KidDetailComponent;
  let fixture: ComponentFixture<KidDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KidDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KidDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
