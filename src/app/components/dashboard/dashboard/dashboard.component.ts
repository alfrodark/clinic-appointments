import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientService } from '../../../services/patient/patient.service';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  totalPatients$!: Observable<number>;
  totalDoctors$!: Observable<number>;
  totalAppointments$!: Observable<number>;
  user!: Observable<any>;
  userData: any;
  userService!: UserService;
  uid!: Observable<any>;

  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      this.userData = user;
      if (user) {

      }else {

      }
    });

    this.totalPatients$ = this.patientService.getTotalPatients();
    this.totalDoctors$ = this.doctorService.getTotalDoctors();
    this.totalAppointments$ = this.appointmentService.getTotalAppointments();

  }

}
