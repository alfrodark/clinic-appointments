import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { finalize, map, Observable, switchMap } from 'rxjs';
import { Doctor } from '../../models/doctor.model';
import { StorageService } from '../storage/storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private doctorsCollection: AngularFirestoreCollection<Doctor>;

  user$!: Observable<any>;
  currentUserUid!: string;
  doctorId!: string;
  doctors!: Observable<{
    id: string; userId?: string | undefined; doctorId?: string | undefined; name: string; specialization: string;
    email: string; phoneNumber?: string | undefined; photoUrl?: string | undefined; gender: string | undefined; dateOfBirth: Date | undefined;
    createdAt?: Date | undefined; createdBy?: string | undefined; updatedAt?: Date | undefined;
    updatedBy?: string | undefined;
  }[]>;

  constructor(
    private firestore: AngularFirestore,
    private storageService: StorageService,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private authService: AuthService)
    {
      this.doctorsCollection = this.firestore.collection<Doctor>('doctors');
      this.doctors = this.doctorsCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Doctor;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      // Subscribe to authentication changes to get the current user's UID
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.currentUserUid = user.uid;
        }
      });
    }

  getDoctors(): Observable<Doctor[]> {
    return this.doctorsCollection.valueChanges({ idField: 'doctorId' });
  }

  getDoctorById(doctorId: string): Observable<Doctor> | any {
    return this.firestore.collection('doctors').doc(doctorId).valueChanges();
  }

  // getDoctorIds(): Observable<string[]> {
  //   // Replace 'loanPayments' with your actual collection name
  //   return this.firestore.collection('doctors').snapshotChanges().pipe(
  //     map(actions => actions.map(a => a.payload.doc.id))
  //   );
  // }

  getDoctorIds(): Observable<any[]> {
    return this.firestore.collection('doctors').valueChanges();
  }

  getDoctorId(): Observable<string> {
    return new Observable(observer => {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.firestore.collection('doctors', ref => ref.where('userId', '==', user.uid))
            .valueChanges({ idField: 'doctorId' })
            .subscribe(doctors => {
              if (doctors.length > 0) {
                observer.next(doctors[0].doctorId);
                observer.complete();
              } else {
                observer.error('Doctor not found');
              }
            });
        } else {
          observer.error('User not authenticated');
        }
      });
    });
  }

  // getDoctorId(): Observable<string> {
  //   return new Observable(observer => {
  //     this.afAuth.authState.subscribe(user => {
  //       if (user) {
  //         this.firestore.collection('doctors')
  //           .valueChanges({ idField: 'doctorId' })
  //           .subscribe(doctors => {
  //             if (doctors.length > 0) {
  //               observer.next(doctors[0].doctorId);
  //               observer.complete();
  //             } else {
  //               observer.error('Doctor not found');
  //             }
  //           });
  //       } else {
  //         observer.error('User not authenticated');
  //       }
  //     });
  //   });
  // }


  getDoctor(doctorId: string): Observable<Doctor> {
    return this.firestore
      .doc<Doctor>(`doctors/${doctorId}`)
      .valueChanges()
      .pipe(
        map((doctor) => {
          return doctor as Doctor;
        })
      );
  }

  getTotalDoctors(): Observable<number> {
    return this.firestore.collection('doctors').valueChanges().pipe(
      map(doctors => doctors.length)
    );
  }

  addDoctor(doctor: Doctor): Promise<any> {
    const doctorWithUserId: Doctor = { ...doctor, userId: this.currentUserUid };
    return this.doctorsCollection.add(doctorWithUserId)
      .then((docRef) => {
      // Document successfully added, docRef is a reference to the newly added document
      this.doctorId = docRef.id;
      console.log("Doctor ID:", this.doctorId);
      alert('Doctor added successfully')
      const doctorWithUserIdDoctorId: Doctor = { ...doctor, doctorId: this.doctorId, userId: this.currentUserUid };
      this.updateDoctor(this.doctorId, doctorWithUserIdDoctorId);
    }).catch(error => alert(error));
  }

  // addDoctor(doctor: Doctor): Promise<any> {
  //   return this.doctorsCollection.add(doctor)
  //   .then(() => alert('Doctor added successfully'))
  //     .catch(error => alert(error));
  // }

  updateDoctor(doctorId: string, doctor: Doctor): Promise<void> {
    return this.doctorsCollection.doc(doctorId).update(doctor)
    .then(() => alert('Doctor updated successfully'))
    .catch(error => alert(error));
  }

  updateDoctorPhoto(doctorId: string, photoUrl: string): Promise<void> {
    return this.doctorsCollection.doc(doctorId).update({photoUrl});
  }

  deleteDoctor(doctorId: string): Promise<void> {
    return this.doctorsCollection.doc(doctorId).delete()
    .then(() => alert('Doctor deleted successfully'))
    .catch(error => alert(error));
  }

  uploadPhoto(file: File): Observable<any> {
    const filePath = `doctor-photos/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {

          alert(`File available at: ${url}`);
        });
      })
    );
  }

}
