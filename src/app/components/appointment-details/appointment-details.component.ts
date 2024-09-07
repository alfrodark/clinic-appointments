import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../models/appointment.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.css'
})
export class AppointmentDetailsComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  appointments!: Appointment;
  appointmentId!: string | any;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private authService: AuthService,
  ) {
    this.route.paramMap.subscribe(params => {
      this.appointmentId = params.get('appointmentId');
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.route.params.subscribe((params) => {
          this.appointmentId = params['appointmentId'];
      });
      } else {

      }
    });
    // const doctorId = this.route.snapshot.paramMap.get('id');
    this.appointmentService.getAppointmentById(this.appointmentId!).subscribe((appointment: Appointment) => {
      this.appointments = appointment;
    });

    console.log('Appointment Id: ', this.appointmentId);
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
