import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewContractDialogComponent } from './new-contract-dialog.component';

describe('NewContractDialogComponent', () => {
  let component: NewContractDialogComponent;
  let fixture: ComponentFixture<NewContractDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewContractDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewContractDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
