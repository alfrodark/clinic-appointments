import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, finalize } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { Doctor } from '../../models/doctor.model';
import { DoctorService } from '../../services/doctor/doctor.service';
import { PhotoUploadService } from '../../services/photo-upload.service';

@Component({
  selector: 'app-doctor-update',
  templateUrl: './doctor-update.component.html',
  styleUrl: './doctor-update.component.css'
})
export class DoctorUpdateComponent implements OnInit {

  updateDoctorForm: FormGroup | any = null;
  doctorId!: string | any;
  doctor!: Observable<Doctor> | any;
  selectedFile: File | any = null;
  currentUser: any;
  imageUrl!: string | ArrayBuffer | any;
  photoUrl!: string;

  uploadPercent!: number;
  downloadURL!: string;


  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private photoUploadService: PhotoUploadService,
    private snackBar: MatSnackBar
  )
  {
    this.updateDoctorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      specialization: ['', Validators.required],
      gender: [''],
      dateOfBirth: [''],
      photoUrl: [''],
    });
  }

  ngOnInit(): void {
    this.doctorId = this.route.snapshot.paramMap.get('doctorId');
    this.createForm();
    this.loadClientData();

    this.doctorId = this.route.snapshot.paramMap.get('doctorId');
    this.doctorService.getDoctorById(this.doctorId).subscribe((doctor: any) => {
      if (doctor) {
        this.doctor = doctor;
        this.updateDoctorForm.patchValue(doctor);
      }
    });

    this.authService.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
    });

    this.doctor = this.route.paramMap.pipe(
      switchMap(params => {
        this.doctorId = params.get('doctorId');
        return this.doctorService.getDoctorById(this.doctorId);
      })
    );

    this.doctor.subscribe((client: any) => {
      this.updateDoctorForm.patchValue(client);
    });


  }

  createForm(): void {
    this.updateDoctorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      specialization: ['', Validators.required],
      gender: [''],
      dateOfBirth: [''],
      photoUrl: [''],
    });
  }

  loadClientData(): void {
    if (this.doctorId) {
      this.doctorService.getDoctors().subscribe((doctors: any[]) => {
        const doctor = doctors.find(c => c.doctorId === this.doctorId);
        this.updateDoctorForm.patchValue(doctor);
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const filePath = `doctor-photos/${this.doctorId}/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe((percent: number| any) => {
      this.uploadPercent = percent;
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url: string) => {
          this.downloadURL = url;
          this.updateDoctorForm.patchValue({ photoUrl: url });
        });
      })
    ).subscribe();
  }

  uploadPhoto(doctorId: string): void {

    const file = this.updateDoctorForm.get('photoUrl').value;
    const path = `doctor-photos/${this.doctorId}/${Date.now()}_${this.selectedFile.name}`;
    const ref = this.storage.ref(path);
    const task = ref.put(file);


    task.then((snapshot) => {
      snapshot.ref.getDownloadURL().then((downloadURL) => {
        this.doctorService.updateDoctorPhoto(doctorId, downloadURL);
      });
    });

  }

  onSubmit(): void {

    const formData = this.updateDoctorForm.value;
    if (this.doctorId) {
      this.doctorService.updateDoctor(this.doctorId, formData);
      console.log('Doctor updated successfully!');
      this.router.navigate(['/doctors']);
    } else {
      this.doctorService.addDoctor(formData);
      console.log('Doctor created successfully!');
      this.router.navigate(['/doctors']);
    }
  }

}
