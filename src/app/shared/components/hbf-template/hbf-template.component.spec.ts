import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HbfTemplateComponent } from './hbf-template.component';

describe('HbfTemplateComponent', () => {
  let component: HbfTemplateComponent;
  let fixture: ComponentFixture<HbfTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HbfTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HbfTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
