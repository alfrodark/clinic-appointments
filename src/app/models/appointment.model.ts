// appointment.model.ts
export interface Appointment {
  appointmentId?: string;
  patientId: string; // Reference to the patient document
  doctorId: string;
  userId?: string;
  patientName: string;
  doctorName: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  notes: string;
  status: string; // e.g., scheduled, completed, canceled
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
