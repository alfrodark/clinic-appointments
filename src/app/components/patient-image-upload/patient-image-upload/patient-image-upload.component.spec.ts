import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientImageUploadComponent } from './patient-image-upload.component';

describe('PatientImageUploadComponent', () => {
  let component: PatientImageUploadComponent;
  let fixture: ComponentFixture<PatientImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientImageUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
