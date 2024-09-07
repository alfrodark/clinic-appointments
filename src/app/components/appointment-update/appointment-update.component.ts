import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-appointment-update',
  templateUrl: './appointment-update.component.html',
  styleUrl: './appointment-update.component.css'
})
export class AppointmentUpdateComponent {

  updateAppointmentForm: FormGroup | any = null;
  appointmentId!: string | any;
  appointment!: Observable<Appointment> | any;
  currentUser: any;

  // selectedStartTime!: string;
  // selectedEndTime!: string;
  selectedDateTime!: Date;
  selectedDateCreated!: Date;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private snackBar: MatSnackBar
  )
  {
    // this.selectedStartTime = '12:00';
    // this.selectedEndTime = '12:00';
    this.selectedDateTime = new Date();
    this.selectedDateCreated = new Date();
    this.updateAppointmentForm = this.fb.group({
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
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
    this.createForm();
    this.loadAppointmentData();

    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe((appointment: any) => {
      if (appointment) {
        this.appointment = appointment;
        this.updateAppointmentForm.patchValue(appointment);
      }
    });

    this.authService.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
    });

    this.appointment = this.route.paramMap.pipe(
      switchMap(params => {
        this.appointmentId = params.get('appointmentId');
        return this.appointmentService.getAppointmentById(this.appointmentId);
      })
    );

    this.appointment.subscribe((client: any) => {
      this.updateAppointmentForm.patchValue(client);
    });

  }

  createForm(): void {
    // this.selectedStartTime = '12:00';
    // this.selectedEndTime = '12:00';
    this.selectedDateTime = new Date();
    this.selectedDateCreated = new Date();
    this.updateAppointmentForm = this.fb.group({
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

  get startTime() {
    return this.updateAppointmentForm.get('startTime')?.value;
  }

  get endTime() {
    return this.updateAppointmentForm.get('endTime')?.value;
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

  loadAppointmentData(): void {
    if (this.appointmentId) {
      this.appointmentService.getAppointments().subscribe((appoints: any[]) => {
        const appoint = appoints.find(c => c.appointId === this.appointmentId);
        this.updateAppointmentForm.patchValue(appoint);
      });
    }
  }

  onSubmit(): void {
    const formData = this.updateAppointmentForm.value;
    if (this.appointmentId) {
      this.appointmentService.updateAppointment(this.appointmentId, formData);
      console.log('Appointment updated successfully!');
      this.router.navigate(['/appointments']);
    } else {
      this.appointmentService.addAppointment(formData);
      console.log('Appointment created successfully!');
      this.router.navigate(['/appointments']);
    }
  }

  deleteAppointment(appointmentId: string, patientName: string) {
    const confirmDelete = confirm(`Are you sure you want to delete ${patientName}?`);
    if (confirmDelete) {
      this.appointmentService.deleteAppointment(appointmentId);
      alert('Appointment Deleted successfully.')
    }
  }

}
