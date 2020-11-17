import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCounterComponent } from './manage-counter.component';

describe('ManageCounterComponent', () => {
  let component: ManageCounterComponent;
  let fixture: ComponentFixture<ManageCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
