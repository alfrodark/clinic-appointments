import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient/patient.service';
import { PatientDialogComponent } from '../../patient-dialog/patient-dialog/patient-dialog.component';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, throwError } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  patients!: Observable<Patient[]> | any;
  error!: string;
  patients$!: Observable<Patient[]> | any;
  searchControl = new FormControl('');
  filterControl = new FormControl('');

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.patients$ = this.afs.collection('patients').snapshotChanges().pipe(
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
        this.getPatients();
      } else {
        // Load clients for the authenticated user
        this.getPatients();
      }
    });

    console.log('User Id: ', this.patientService.currentUserUid);
    console.log('Patient Id: ', );

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.patients$ = this.patientService.searchPatients(searchTerm!);
    });

    this.filterControl.valueChanges.subscribe(filterValue => {
      this.patients$ = this.patientService.filterPatients(filterValue!);
    });

  }

  getPatients() {
    this.patientService.getPatients().subscribe(patients => {
      this.patients = patients;
    });
  }

  viewPatientDetails(patient: Patient): void {
    this.router.navigate(['/patient-details', patient.patientId]);
  }

  openDialog(action: string, patient?: Patient) {
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      width: '300px',
      data: { action, patient }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (action === 'Add') {
          this.addPatient(result);
        } else if (action === 'Edit') {
          this.editPatient(result);
        } else if (action === 'Delete') {
          this.deletePatient(result.id, result.name);
        }
      }
    });
  }

  addPatient(patient: Patient) {
    this.patientService.addPatient(patient);
  }

  editPatient(patient: Patient) {
    this.patientService.updatePatient(patient.patientId!, patient);
  }

  deletePatient(patientId: string, patientName: string) {
    const confirmDelete = confirm(`Are you sure you want to delete ${patientName}?`);
    if (confirmDelete) {
      this.patientService.deletePatient(patientId);
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
