import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Doctor } from '../../../models/doctor.model';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { DoctorDialogComponent } from '../../doctor-dialog/doctor-dialog/doctor-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable, switchMap } from 'rxjs';
import { User } from '../../../models/user.model';
import { subscribe } from 'diagnostics_channel';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  doctors!: Observable<Doctor[]>;
  doctors$!: Observable<Doctor[]>;
  doctorId!: string | any;
  userId!: string | any;
  user: Observable<User> | any;
  userData: Observable<User> | any;
  currentUser: any;
  doctorsIds!: Observable<any[]>;

  constructor(
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) {

  }

  ngOnInit(): void {
    this.doctors$ = this.afs.collection('doctors').snapshotChanges().pipe(
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
        this.getDoctors();
      } else {
        // Load clients for the authenticated user
        this.getDoctors();
      }
    });

    console.log('User Id: ', this.doctorService.currentUserUid);
    // console.log('Doctor Id: ', this.doctors$);

  }

  getDoctors() {
    this.doctorService.getDoctors().subscribe((doctors: any) => {
      this.doctors = doctors;
    });
  }

  viewDoctorDetails(doctor: Doctor): void {
    this.router.navigate(['/doctor-details', doctor.doctorId]);
  }

  openDialog(action: string, doctor?: Doctor) {
    const dialogRef = this.dialog.open(DoctorDialogComponent, {
      width: '400px',
      data: { action, doctor }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (action === 'Add') {
          this.addDoctor(result);
        } else if (action === 'Edit') {
          this.editDoctor(result);
        } else if (action === 'Delete') {

        }
      }
    });
  }

  addDoctor(doctor: Doctor) {
    this.doctorService.addDoctor(doctor);
  }

  editDoctor(doctor: Doctor) {
    this.doctorService.updateDoctor(doctor.doctorId!, doctor);
    this.doctorService.updateDoctorPhoto(doctor.doctorId!, doctor.photoUrl!);
    alert('Successfully Updated.')
  }

  deleteDoctor(doctorId: string, doctorName: string) {
    const confirmDelete = confirm(`Are you sure you want to delete ${doctorName}?`);
    if (confirmDelete) {
      this.doctorService.deleteDoctor(doctorId);
      alert('Deleted successfully.')
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
