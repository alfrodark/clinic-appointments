import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up/sign-up.component';
import { PatientsComponent } from './components/patients/patients/patients.component';
import { AuthGuard } from './services/auth/auth.guard';
import { DoctorsComponent } from './components/doctors/doctors/doctors.component';
import { AppointmentsComponent } from './components/appointments/appointments/appointments.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { UserUpdateComponent } from './components/user-update/user-update/user-update.component';
import { DoctorImageUploadComponent } from './components/doctor-image-upload/doctor-image-upload/doctor-image-upload.component';
import { DoctorDetailsComponent } from './components/doctor-details/doctor-details.component';
import { DoctorUpdateComponent } from './components/doctor-update/doctor-update.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AddDoctorComponent } from './components/add-doctor/add-doctor.component';
import { AddPatientComponent } from './components/add-patient/add-patient/add-patient.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { PatientUpdateComponent } from './components/patient-update/patient-update.component';
import { AddAppointmentComponent } from './components/add-appointment/add-appointment.component';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { AppointmentUpdateComponent } from './components/appointment-update/appointment-update.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'doctor-image-upload', component: DoctorImageUploadComponent },
  { path: 'add-doctor', component: AddDoctorComponent },
  { path: 'add-patient', component: AddPatientComponent },
  { path: 'add-appointment', component: AddAppointmentComponent },
  { path: 'doctor-details/:doctorId', component: DoctorDetailsComponent },
  { path: 'update-doctor/:doctorId', component: DoctorUpdateComponent },
  { path: 'patient-details/:patientId', component: PatientDetailsComponent },
  { path: 'update-patient/:patientId', component: PatientUpdateComponent },
  { path: 'appointment-details/:appointmentId', component: AppointmentDetailsComponent },
  { path: 'update-appointment/:appointmentId', component: AppointmentUpdateComponent },
  {
    path: 'patients',
    component: PatientsComponent,
    canActivate: [AuthGuard], // Apply the AuthGuard
  },
  {
    path: 'doctors',
    component: DoctorsComponent,
    canActivate: [AuthGuard], // Apply the AuthGuard
  },
  {
    path: 'appointments',
    component: AppointmentsComponent,
    canActivate: [AuthGuard], // Apply the AuthGuard
  },
  {
    path: 'user-details',
    component: UserDetailsComponent,
    canActivate: [AuthGuard], // Apply the AuthGuard
  },
  {
    path: 'update-user',
    component: UserUpdateComponent,
    canActivate: [AuthGuard], // Apply the AuthGuard
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
