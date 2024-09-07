import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Doctor } from '../../models/doctor.model';
import { DoctorService } from '../../services/doctor/doctor.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.css'
})
export class DoctorDetailsComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  doctor!: Doctor;
  doctorId!: string | any;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private authService: AuthService,
  ) {
    this.route.paramMap.subscribe(params => {
      this.doctorId = params.get('doctorId');
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.route.params.subscribe((params) => {
          this.doctorId = params['id'];
      });
      } else {

      }
    });
    // const doctorId = this.route.snapshot.paramMap.get('id');
    this.doctorService.getDoctorById(this.doctorId!).subscribe((doctor: Doctor) => {
      this.doctor = doctor;
    });

    console.log('Doctor Id: ', this.doctorId);
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
