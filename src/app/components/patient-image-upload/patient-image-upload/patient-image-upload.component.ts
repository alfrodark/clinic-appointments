import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-patient-image-upload',
  templateUrl: './patient-image-upload.component.html',
  styleUrl: './patient-image-upload.component.css'
})
export class PatientImageUploadComponent implements OnInit {

  selectedImage: any = null;
  imageURL: any = null;
  uploadProgress$!: Observable<number> | any;
  user!: firebase.default.User | any;

  constructor(
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0] as File;
  }

  onUpload(): void {
    const filePath = `patients/${Date.now()}_${this.selectedImage.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedImage);

    this.uploadProgress$ = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.imageURL = url;
          // You can save the imageURL to the patient model or perform any other action here
        });
      })
    ).subscribe();
  }

}
