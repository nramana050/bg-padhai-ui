import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormControlMessagesComponent } from './form-control-messages.component';

describe('FormControlMessagesComponent', () => {
  let component: FormControlMessagesComponent;
  let fixture: ComponentFixture<FormControlMessagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormControlMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormControlMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
