import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentGeneratorComponent } from './content-generator.component';

describe('ContentGeneratorComponent', () => {
  let component: ContentGeneratorComponent;
  let fixture: ComponentFixture<ContentGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentGeneratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
