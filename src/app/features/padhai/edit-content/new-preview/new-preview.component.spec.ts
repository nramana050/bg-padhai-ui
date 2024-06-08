import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPreviewComponent } from './new-preview.component';

describe('NewPreviewComponent', () => {
  let component: NewPreviewComponent;
  let fixture: ComponentFixture<NewPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
