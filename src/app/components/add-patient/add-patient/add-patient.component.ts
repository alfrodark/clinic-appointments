import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient } from '../../../models/patient.model';
import { finalize, Observable } from 'rxjs';
import { PatientService } from '../../../services/patient/patient.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css'
})
export class AddPatientComponent implements OnInit {

  patientForm!: FormGroup | any;
  patientId!: string | any;
  patient!: Observable<Patient>;

  addPatientForm: FormGroup | any = null;
  imageUrl!: string | ArrayBuffer | any;
  uploadPercent!: number;

  constructor(private fb: FormBuilder,
    private patientService: PatientService,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.addPatientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      createdAt: ['', Validators.required],
      photoUrl: [''],
    });
  }

  ngOnInit(): void {

  }

  onSubmit(): void {
    if (this.addPatientForm.valid) {
      const newPatient = this.addPatientForm.value;
      this.patientService.addPatient({ ...newPatient })
        .then(() => {
          this.router.navigate(['/patients']);
        })
        .catch(error => {
          alert(error);
        });
    } else {
      // Display error messages to the user
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const filePath = `patient-photos/${this.patientService.patientId}/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe((percent: number| any) => {
      this.uploadPercent = percent;
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url: string) => {
          this.imageUrl = url;
          this.addPatientForm.patchValue({ photoUrl: url });
        });
      })
    ).subscribe();

  }

}
