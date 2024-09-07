export interface Patient {
  patientId?: string;
  userId?: string;
  name: string;
  email: string;
  phoneNumber: string;
  photoUrl?: string;
  gender: string;
  dateOfBirth: Date;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
