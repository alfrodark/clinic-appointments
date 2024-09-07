import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from '../../../models/appointment.model';

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrl: './appointment-dialog.component.css'
})
export class AppointmentDialogComponent {

  appointmentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string, appointment?: Appointment }
  ) {
    this.appointmentForm = this.formBuilder.group({
      patientName: [data.appointment?.patientName || '', Validators.required],
      doctorName: [data.appointment?.doctorName || '', Validators.required],
      date: [data.appointment?.date || '', Validators.required],
      startTime: [data.appointment?.startTime || '', Validators.required],
      endTime: [data.appointment?.endTime || '', Validators.required],
      notes: [data.appointment?.notes || ''],
      status: [data.appointment?.status || '', Validators.required]
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmitClick(): void {
    if (this.appointmentForm.valid) {
      const appointment: Appointment = {
        patientName: this.appointmentForm.get('patientName')!.value,
        doctorName: this.appointmentForm.get('doctorName')!.value,
        date: this.appointmentForm.get('date')!.value,
        startTime: this.appointmentForm.get('startTime')!.value,
        endTime: this.appointmentForm.get('endTime')!.value,
        notes: this.appointmentForm.get('notes')!.value,
        status: this.appointmentForm.get('status')!.value,
        patientId: '',
        doctorId: ''
      };
      if (this.data.appointment) {
        appointment.appointmentId = this.data.appointment.appointmentId;
      }
      this.dialogRef.close(appointment);
    }
  }

}
