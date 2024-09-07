import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from '../../../models/appointment.model';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { AppointmentDialogComponent } from '../../appointment-dialog/appointment-dialog/appointment-dialog.component';
import { map, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  appointments!: Observable<Appointment[]> | any;
  appointments$!: Observable<Appointment[]> | any;

  constructor(
    private appointmentService: AppointmentService,
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {


    this.appointments$ = this.afs.collection('appointments').snapshotChanges().pipe(
      map((actions: any[]) => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.getAppointments();
      } else {
        // Load clients for the authenticated user
        this.getAppointments();
      }
    });

    console.log('User Id: ', this.appointmentService.currentUserUid);
  }

  getAppointments() {
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.appointments = appointments;
    });
  }

  updateAppointments(appointment: Appointment): void {
    this.router.navigate(['/update-appointment', appointment.appointmentId]);
  }

  // openDialog(action: string, appointment?: Appointment) {
  //   const dialogRef = this.dialog.open(AppointmentDialogComponent, {
  //     width: '300px',
  //     data: { action, appointment }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       if (action === 'Add') {
  //         this.addAppointment(result);
  //       } else if (action === 'Edit') {
  //         this.editAppointment(result);
  //       } else if (action === 'Delete') {
  //         this.deleteAppointment(result.id);
  //       }
  //     }
  //   });
  // }

  viewAppointmentDetails(appointment: Appointment): void {
    this.router.navigate(['/appointment-details', appointment.appointmentId!]);
  }

  addAppointment(appointment: Appointment) {
    this.appointmentService.addAppointment(appointment);
  }

  editAppointment(appointment: Appointment) {
    this.appointmentService.updateAppointment(appointment.appointmentId!, appointment);
  }

  // deleteAppointment(appointmentId: string) {
  //   this.appointmentService.deleteAppointment(appointmentId);
  // }

  deleteAppointment(appointmentId: string, patientName: string) {
    const confirmDelete = confirm(`Are you sure you want to delete ${patientName}?`);
    if (confirmDelete) {
      this.appointmentService.deleteAppointment(appointmentId);
      alert('Appointment Deleted successfully.')
    }
  }

  formatTimestamp(timestampString: string): string {
    const regex = /Timestamp\(seconds=(\d+), nanoseconds=(\d+)\)/;
    const match = timestampString.match(regex);

    if (match && match.length === 3) {
      const seconds = parseInt(match[1], 10);
      const nanoseconds = parseInt(match[2], 10);
      const milliseconds = seconds * 1000 + nanoseconds / 1e6;

      const date = new Date(milliseconds);
      // Customize the format as needed
      const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

      return formattedDate;
    } else {
      return 'Invalid timestamp format';
    }
  }

}
