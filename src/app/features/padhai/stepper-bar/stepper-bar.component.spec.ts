import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperBarComponent } from './stepper-bar.component';

describe('StepperBarComponent', () => {
  let component: StepperBarComponent;
  let fixture: ComponentFixture<StepperBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
