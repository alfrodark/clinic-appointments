import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorImageUploadComponent } from './doctor-image-upload.component';

describe('DoctorImageUploadComponent', () => {
  let component: DoctorImageUploadComponent;
  let fixture: ComponentFixture<DoctorImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorImageUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
