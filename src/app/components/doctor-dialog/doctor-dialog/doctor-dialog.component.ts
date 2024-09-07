import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Doctor } from '../../../models/doctor.model';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-doctor-dialog',
  templateUrl: './doctor-dialog.component.html',
  styleUrl: './doctor-dialog.component.css'
})
export class DoctorDialogComponent implements OnInit {

  doctorForm: FormGroup;
  imageUrl!: string | ArrayBuffer | any;
  downloadURL!: string;
  uploadPercent!: number;
  doctorId!: string | any;
  userData: Observable<User> | any;

  constructor(
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    public dialogRef: MatDialogRef<DoctorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string, doctor?: Doctor }
  ) {
    this.doctorForm = this.formBuilder.group({
      name: [data.doctor?.name || '', Validators.required],
      specialization: [data.doctor?.specialization || '', Validators.required],
      email: [data.doctor?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [data.doctor?.phoneNumber || '', Validators.required],
      gender: [data.doctor?.gender || '', Validators.required],
      dateOfBirth: [data.doctor?.dateOfBirth || '', Validators.required],
    });
  }
  ngOnInit(): void {
    this.doctorForm = this.formBuilder.group({
      name: [this.data.doctor?.name || '', Validators.required],
      specialization: [this.data.doctor?.specialization || '', Validators.required],
      email: [this.data.doctor?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [this.data.doctor?.phoneNumber || '', Validators.required],
      gender: [this.data.doctor?.gender || '', Validators.required],
      dateOfBirth: [this.data.doctor?.dateOfBirth || '', Validators.required],
    });

    this.route.params.subscribe((params) => {
      this.doctorId = params['id'];
      // this.loadLoanData();
      console.log(this.doctorId);
    });

    console.log('User Id: ', this.doctorService.currentUserUid);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmitClick(): void {
    if (this.doctorForm.valid) {
      const doctor: Doctor = {
        name: this.doctorForm.get('name')!.value,
        specialization: this.doctorForm.get('specialization')!.value,
        email: this.doctorForm.get('email')!.value,
        phoneNumber: this.doctorForm.get('phoneNumber')!.value,
        gender: this.doctorForm.get('gender')!.value,
        dateOfBirth: this.doctorForm.get('dateOfBirth')!.value,
      };
      if (this.data.doctor) {
        doctor.doctorId = this.data.doctor.doctorId;
      }
      this.dialogRef.close(doctor);
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
          this.downloadURL = url;
          this.doctorForm.patchValue({ imageUrl: url });
        });
      })
    ).subscribe();

  }

}
