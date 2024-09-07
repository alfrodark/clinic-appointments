import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { environment } from '../environments/environment';

import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { FirestoreModule } from '@angular/fire/firestore';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AuthGuard } from './services/auth/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { SignUpComponent } from './components/sign-up/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login/login.component';
import { PatientService } from './services/patient/patient.service';
import { DoctorService } from './services/doctor/doctor.service';
import { AppointmentService } from './services/appointment/appointment.service';
import { PatientsComponent } from './components/patients/patients/patients.component';
import { PatientDialogComponent } from './components/patient-dialog/patient-dialog/patient-dialog.component';
import { DoctorsComponent } from './components/doctors/doctors/doctors.component';
import { DoctorDialogComponent } from './components/doctor-dialog/doctor-dialog/doctor-dialog.component';
import { AppointmentsComponent } from './components/appointments/appointments/appointments.component';
import { AppointmentDialogComponent } from './components/appointment-dialog/appointment-dialog/appointment-dialog.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { UserUpdateComponent } from './components/user-update/user-update/user-update.component';
import { PatientImageUploadComponent } from './components/patient-image-upload/patient-image-upload/patient-image-upload.component';
import { DoctorImageUploadComponent } from './components/doctor-image-upload/doctor-image-upload/doctor-image-upload.component';
import { AddPatientComponent } from './components/add-patient/add-patient/add-patient.component';
import { HeaderComponent } from './header/header.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DoctorDetailsComponent } from './components/doctor-details/doctor-details.component';
import { DoctorUpdateComponent } from './components/doctor-update/doctor-update.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AddDoctorComponent } from './components/add-doctor/add-doctor.component';
import { PatientUpdateComponent } from './components/patient-update/patient-update.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { AddAppointmentComponent } from './components/add-appointment/add-appointment.component';
import { AppointmentUpdateComponent } from './components/appointment-update/appointment-update.component';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({ declarations: [
        AppComponent,
        SignUpComponent,
        LoginComponent,
        PatientsComponent,
        PatientDialogComponent,
        DoctorsComponent,
        DoctorDialogComponent,
        AppointmentsComponent,
        AppointmentDialogComponent,
        DashboardComponent,
        DashboardHeaderComponent,
        UserUpdateComponent,
        HeaderComponent,
        PatientImageUploadComponent,
        DoctorImageUploadComponent,
        AddPatientComponent,
        DoctorDetailsComponent,
        DoctorUpdateComponent,
        UserDetailsComponent,
        AddDoctorComponent,
        PatientUpdateComponent,
        PatientDetailsComponent,
        AddAppointmentComponent,
        AppointmentUpdateComponent,
        AppointmentDetailsComponent
    ],
    bootstrap: [AppComponent],
    imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMaterialTimepickerModule,
        NgxMatNativeDateModule,
        MatProgressBarModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        FirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        AngularFireModule], providers: [
        provideClientHydration(), provideHttpClient(), AuthGuard, AuthService, UserService,
        PatientService, DoctorService, AppointmentService,
        provideHttpClient(withInterceptorsFromDi())
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] })
export class AppModule { }
