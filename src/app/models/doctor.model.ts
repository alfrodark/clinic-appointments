export interface Doctor {
  doctorId?: string;
  userId?: string;
  name: string;
  specialization: string;
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
