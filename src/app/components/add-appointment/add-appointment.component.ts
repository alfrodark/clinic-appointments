import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment } from '../../models/appointment.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AppointmentService } from '../../services/appointment/appointment.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css'
})
export class AddAppointmentComponent {

  appointmentForm!: FormGroup | any;
  appointments!: Observable<Appointment>;

  addAppointmentForm: FormGroup | any = null;
  imageUrl!: string | ArrayBuffer | any;
  uploadPercent!: number;
  // beginningTime!: string;
  // selectedStartTime!: string;
  // selectedEndTime!: string;
  selectedDateTime!: Date;
  selectedDateCreated!: Date;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private storage: AngularFireStorage,
    private router: Router,
  ) {
    // this.selectedStartTime = '12:00';
    // this.selectedEndTime = '12:00';
    this.selectedDateTime = new Date();
    this.selectedDateCreated = new Date();
    this.addAppointmentForm = this.fb.group({
      patientName: ['', Validators.required],
      doctorName: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      createdAt: ['', Validators.required],
      notes: [''],
      status: ['', Validators.required]
    });

  }

  ngOnInit(): void {

  }

  get startTime() {
    return this.addAppointmentForm.get('startTime')?.value;
  }

  get endTime() {
    return this.addAppointmentForm.get('endTime')?.value;
  }

  // onTimeChange1(event: any): void {
  //   this.selectedStartTime = event.target.value;
  // }

  // onTimeChange2(event: any): void {
  //   this.selectedEndTime = event.target.value;
  // }

  onDateTimeChange(event: any): void {
    this.selectedDateTime = event.value;
  }

  onDateTimeChange2(event: any): void {
    this.selectedDateCreated = event.value;
  }

  onSubmit(): void {
    if (this.addAppointmentForm.valid) {
      const newAppointment = this.addAppointmentForm.value;
      this.appointmentService.addAppointment({ ...newAppointment })
        .then(() => {
          this.router.navigate(['/appointments']);
        })
        .catch(error => {
          alert(error);
        });
    } else {
      // Display error messages to the user
    }
  }

}
