import { Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient/patient.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.css'
})
export class PatientDetailsComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  patient!: Patient;
  patientId!: string | any;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private authService: AuthService,
  ) {
    this.route.paramMap.subscribe(params => {
      this.patientId = params.get('patientId');
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.route.params.subscribe((params) => {
          this.patientId = params['id'];
      });
      } else {

      }
    });
    // const doctorId = this.route.snapshot.paramMap.get('id');
    this.patientService.getPatientById(this.patientId!).subscribe((patient: Patient) => {
      this.patient = patient;
    });

    console.log('Patient Id: ', this.patientId);
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
