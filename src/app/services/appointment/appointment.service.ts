import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Appointment } from '../../models/appointment.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private appointmentsCollection: AngularFirestoreCollection<Appointment>;

  user$!: Observable<any>;
  currentUserUid!: string;
  appointmentId!: string;
  appointments!: Observable<{
    id: string; userId?: string | undefined; appointmentId?: string | undefined;
    patientId?: string | undefined; doctorId?: string | undefined; patientName: string | undefined;
    doctorName: string | undefined; date: Date | undefined; startTime?: Date | undefined;
    endTime?: Date | undefined; notes?: string | undefined; status?: string | undefined;
    updatedAt?: Date | undefined; updatedBy?: string | undefined;
  }[]>;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
  )
  {
    this.appointmentsCollection = this.firestore.collection<Appointment>('appointments');
      this.appointments = this.appointmentsCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Appointment;
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

  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsCollection.valueChanges({ idField: 'appointmentId' });
  }

  getAppointmentById(appointmentId: string): Observable<Appointment> | any {
    return this.firestore.collection('appointments').doc(appointmentId).valueChanges();
  }

  getTotalAppointments(): Observable<number> {
    return this.firestore.collection('appointments').valueChanges().pipe(
      map(appointments => appointments.length)
    );
  }

  // addAppointment(appointment: Appointment): Promise<any> {
  //   return this.appointmentsCollection.add(appointment);
  // }

  addAppointment(appointment: Appointment): Promise<any> {
    const patientWithUserId: Appointment = { ...appointment, userId: this.currentUserUid };
    return this.appointmentsCollection.add(patientWithUserId)
      .then((docRef) => {
      // Document successfully added, docRef is a reference to the newly added document
      this.appointmentId = docRef.id;
      console.log("Appointment ID:", this.appointmentId);
      alert('Appointment added successfully')
      const patientWithUserIdPatientId: Appointment = { ...appointment, appointmentId: this.appointmentId, userId: this.currentUserUid };
      this.updateAppointment(this.appointmentId, patientWithUserIdPatientId);
    }).catch(error => alert(error));
  }

  updateAppointment(appointmentId: string, appointment: Appointment): Promise<void> {
    return this.appointmentsCollection.doc(appointmentId).update(appointment)
    .then(() => alert('Appointment updated successfully'))
    .catch(error => alert(error));
  }

  deleteAppointment(appointmentId: string): Promise<void> {
    return this.appointmentsCollection.doc(appointmentId).delete();
  }
}
