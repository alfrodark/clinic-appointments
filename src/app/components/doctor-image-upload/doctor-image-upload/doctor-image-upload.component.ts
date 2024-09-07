import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctor-image-upload',
  templateUrl: './doctor-image-upload.component.html',
  styleUrl: './doctor-image-upload.component.css'
})
export class DoctorImageUploadComponent implements OnInit {

  selectedImage: any = null;
  imageURL: string | ArrayBuffer | any;
  uploadProgress$: Observable<number> | any;
  doctorId!: string | any;

  constructor(
    private storage: AngularFireStorage,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    
  }

  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0] as File;
  }

  onUpload(): void {
    const filePath = `doctors/${Date.now()}_${this.selectedImage.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedImage);

    this.uploadProgress$ = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.imageURL = url;
          // this.doctorService.updateDoctorPhoto(doctorId, this.imageURL);
        });
      })
    ).subscribe();
  }

}
