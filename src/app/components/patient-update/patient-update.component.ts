import { Component } from '@angular/core';
import { PatientService } from '../../services/patient/patient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient } from '../../models/patient.model';
import { finalize, Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { PhotoUploadService } from '../../services/photo-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-update',
  templateUrl: './patient-update.component.html',
  styleUrl: './patient-update.component.css'
})
export class PatientUpdateComponent {

  updatePatientForm: FormGroup | any = null;
  patientId!: string | any;
  patient!: Observable<Patient> | any;
  selectedFile: File | any = null;
  currentUser: any;
  imageUrl!: string | ArrayBuffer | any;
  photoUrl!: string;

  uploadPercent!: number;
  downloadURL!: string;


  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private photoUploadService: PhotoUploadService,
    private snackBar: MatSnackBar
  )
  {
    this.updatePatientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      createdAt: [''],
      gender: [''],
      dateOfBirth: [''],
      photoUrl: [''],
    });
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('patientId');
    this.createForm();
    this.loadClientData();

    this.patientId = this.route.snapshot.paramMap.get('patientId');
    this.patientService.getPatientById(this.patientId).subscribe((patient: any) => {
      if (patient) {
        this.patient = patient;
        this.updatePatientForm.patchValue(patient);
      }
    });

    this.authService.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
    });

    this.patient = this.route.paramMap.pipe(
      switchMap(params => {
        this.patientId = params.get('patientId');
        return this.patientService.getPatientById(this.patientId);
      })
    );

    this.patient.subscribe((client: any) => {
      this.updatePatientForm.patchValue(client);
    });


  }

  createForm(): void {
    this.updatePatientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      createdAt: [''],
      gender: [''],
      dateOfBirth: [''],
      photoUrl: [''],
    });
  }

  loadClientData(): void {
    if (this.patientId) {
      this.patientService.getPatients().subscribe((patients: any[]) => {
        const patient = patients.find(c => c.patientId === this.patientId);
        this.updatePatientForm.patchValue(patient);
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const filePath = `patient-photos/${this.patientId}/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe((percent: number| any) => {
      this.uploadPercent = percent;
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url: string) => {
          this.downloadURL = url;
          this.updatePatientForm.patchValue({ photoUrl: url });
        });
      })
    ).subscribe();
  }

  uploadPhoto(doctorId: string): void {

    const file = this.updatePatientForm.get('photoUrl').value;
    const path = `doctor-photos/${this.patientId}/${Date.now()}_${this.selectedFile.name}`;
    const ref = this.storage.ref(path);
    const task = ref.put(file);


    task.then((snapshot) => {
      snapshot.ref.getDownloadURL().then((downloadURL) => {
        this.patientService.updateDoctorPhoto(doctorId, downloadURL);
      });
    });

  }

  onSubmit(): void {

    const formData = this.updatePatientForm.value;
    if (this.patientId) {
      this.patientService.updatePatient(this.patientId, formData);
      console.log('Patient updated successfully!');
      this.router.navigate(['/patients']);
    } else {
      this.patientService.addPatient(formData);
      console.log('Patient created successfully!');
      this.router.navigate(['/patients']);
    }
  }

}
