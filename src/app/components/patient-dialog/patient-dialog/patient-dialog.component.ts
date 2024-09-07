import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrl: './patient-dialog.component.css'
})
export class PatientDialogComponent {

  patientForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PatientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string, patient?: Patient }
  ) {
    this.patientForm = this.formBuilder.group({
      name: [data.patient?.name || '', Validators.required],
      email: [data.patient?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [data.patient?.phoneNumber || '', Validators.required],
      gender: [data.patient?.gender || '', Validators.required],
      dateOfBirth: [data.patient?.dateOfBirth || '', Validators.required]
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmitClick(): void {
    if (this.patientForm.valid) {
      const patient: Patient = {
        name: this.patientForm.get('name')!.value,
        email: this.patientForm.get('email')!.value,
        phoneNumber: this.patientForm.get('phoneNumber')!.value,
        gender: this.patientForm.get('gender')!.value,
        dateOfBirth: this.patientForm.get('dateOfBirth')!.value
      };
      if (this.data.patient) {
        patient.patientId = this.data.patient.patientId;
      }
      this.dialogRef.close(patient);
    }
  }

}
