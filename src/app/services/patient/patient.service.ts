import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { finalize, map, Observable } from 'rxjs';
import { Patient } from '../../models/patient.model';
import { StorageService } from '../storage/storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private patientsCollection: AngularFirestoreCollection<Patient>;

  user$!: Observable<any>;
  currentUserUid!: string;
  patientId!: string;
  patients!: Observable<{
    id: string; userId?: string | undefined; patientId?: string | undefined; name: string;
    email: string; phoneNumber?: string | undefined; photoUrl?: string | undefined;
    gender: string | undefined; dateOfBirth: Date | undefined; createdAt?: Date | undefined;
    createdBy?: string | undefined; updatedAt?: Date | undefined; updatedBy?: string | undefined;
  }[]>;

  constructor(
    private firestore: AngularFirestore,
    private storageService: StorageService,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
  )
    {
      this.patientsCollection = this.firestore.collection<Patient>('patients');
      this.patients = this.patientsCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Patient;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.currentUserUid = user.uid;
        }
      });
  }

  getPatients(): Observable<Patient[]> {
    return this.patientsCollection.valueChanges({ idField: 'id' });
  }

  getPatientById(patientId: string): Observable<Patient> | any {
    return this.firestore.collection('patients').doc(patientId).valueChanges();
  }

  // addPatient(patient: Patient): Promise<any> {
  //   return this.patientsCollection.add(patient);
  // }

  getTotalPatients(): Observable<number> {
    return this.firestore.collection('patients').valueChanges().pipe(
      map(patients => patients.length)
    );
  }

  searchPatients(searchTerm: string): Observable<Patient[]> {
    return this.firestore.collection<Patient>('patients', ref => ref.where('name', '>=', searchTerm)
    .where('name', '<=', searchTerm + '\uf8ff'))
    .valueChanges({ idField: 'id' });
  }

  filterPatients(filterValue: string): Observable<Patient[]> {
    return this.firestore.collection<Patient>('patients', ref => ref.where('category', '==', filterValue))
    .valueChanges({ idField: 'id' });
  }

  // addPatient(patient: Patient, imageFile?: File): void {
  //   if (imageFile) {
  //     this.storageService.uploadImage('patients', imageFile).subscribe(imageURL => {
  //       patient.imageURL = imageURL;
  //       this.patientsCollection.add(patient);
  //     });
  //   } else {
  //     this.patientsCollection.add(patient);
  //   }
  // }

  addPatient(patient: Patient): Promise<any> {
    const patientWithUserId: Patient = { ...patient, userId: this.currentUserUid };
    return this.patientsCollection.add(patientWithUserId)
      .then((docRef) => {
      // Document successfully added, docRef is a reference to the newly added document
      this.patientId = docRef.id;
      console.log("Patient ID:", this.patientId);
      alert('Patient added successfully')
      const patientWithUserIdPatientId: Patient = { ...patient, patientId: this.patientId, userId: this.currentUserUid };
      this.updatePatient(this.patientId, patientWithUserIdPatientId);
    }).catch(error => alert(error));
  }

  updatePatient(patientId: string, patient: Patient): Promise<void> {
    return this.patientsCollection.doc(patientId).update(patient)
    .then(() => alert('Patient updated successfully'))
    .catch(error => alert(error));;
  }

  updateDoctorPhoto(patientId: string, photoUrl: string): Promise<void> {
    return this.patientsCollection.doc(patientId).update({photoUrl});
  }

  deletePatient(patientId: string): Promise<void> {
    return this.patientsCollection.doc(patientId).delete()
    .then(() => alert('Patient deleted successfully'))
    .catch(error => alert(error));;
  }

  uploadPhoto(file: File): Observable<any> {
    const filePath = `patient-photos/${file.name}`;
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
