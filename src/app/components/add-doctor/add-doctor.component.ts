import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Doctor } from '../../models/doctor.model';
import { finalize, Observable } from 'rxjs';
import { DoctorService } from '../../services/doctor/doctor.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.css'
})
export class AddDoctorComponent implements OnInit {

  doctorForm: FormGroup | any = null;
  doctorId!: string | any;
  doctor!: Observable<Doctor>;

  addDoctorForm: FormGroup | any = null;
  imageUrl!: string | ArrayBuffer | any;
  uploadPercent!: number;


  constructor(private fb: FormBuilder,
    private doctorService: DoctorService,
    private storage: AngularFireStorage,
    private router: Router) {
    this.addDoctorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      specialization: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      photoUrl: [''],
    });
  }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.addDoctorForm.valid) {
      const newDoctor = this.addDoctorForm.value;
      this.doctorService.addDoctor({ ...newDoctor })
        .then(() => {
          this.router.navigate(['/doctors']);
        })
        .catch(error => {
          alert(error);
        });
    }
  }

  onFileSelected(event: any) {
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
          this.imageUrl = url;
          this.addDoctorForm.patchValue({ photoUrl: url });
        });
      })
    ).subscribe();

  }


}
