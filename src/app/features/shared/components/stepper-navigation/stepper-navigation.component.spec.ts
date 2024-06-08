import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StepperNavigationComponent } from './stepper-navigation.component';

describe('StepperNavigationComponent', () => {
  let component: StepperNavigationComponent;
  let fixture: ComponentFixture<StepperNavigationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
