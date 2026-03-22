export type Grade = 10 | 11 | 12;

export interface ClassInfo {
  id: string;
  name: string;
  grade: Grade;
  facebookGroupUrl?: string;
}

export interface User {
  role: 'admin' | 'student';
  studentId?: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  phone: string;
  parentPhone: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'excused';
}

export interface TuitionRecord {
  studentId: string;
  month: number;
  year: number;
  status: 'paid' | 'unpaid';
}

export interface ScheduleItem {
  id: string;
  classId: string;
  dayOfWeek: string;
  time: string;
  content?: string;
}

export interface Exercise {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface ExerciseSubmission {
  id: string;
  exerciseId: string;
  studentId: string;
  imageUrls: string[]; // Base64 strings for simplicity in local storage
  submittedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isImportant: boolean;
}

export interface Registration {
  id: string;
  studentName: string;
  grade: Grade;
  phone: string;
  status: 'pending' | 'contacted';
  createdAt: string;
}

export interface AppSettings {
  facebookGroupUrl: string;
}

