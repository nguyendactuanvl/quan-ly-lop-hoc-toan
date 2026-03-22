import { Student, ScheduleItem, Exercise, Registration, ClassInfo, AppNotification, AppSettings, ExerciseSubmission } from '../types';

export const initialClasses: ClassInfo[] = [
  { id: 'c1', name: '10A1', grade: 10 },
  { id: 'c2', name: '10A2', grade: 10 },
  { id: 'c3', name: '11B1', grade: 11 },
  { id: 'c4', name: '12C1', grade: 12 },
];

export const initialStudents: Student[] = [
  { id: '1', name: 'Nguyễn Văn A', classId: 'c1', phone: '0901234567', parentPhone: '0912345678' },
  { id: '2', name: 'Trần Thị B', classId: 'c1', phone: '0902345678', parentPhone: '0913456789' },
  { id: '3', name: 'Lê Văn C', classId: 'c3', phone: '0903456789', parentPhone: '0914567890' },
  { id: '4', name: 'Phạm Thị D', classId: 'c4', phone: '0904567890', parentPhone: '0915678901' },
];

export const initialSchedule: ScheduleItem[] = [
  { id: '1', classId: 'c1', dayOfWeek: 'Thứ 2', time: '17:30 - 19:30' },
  { id: '2', classId: 'c1', dayOfWeek: 'Thứ 5', time: '17:30 - 19:30' },
  { id: '3', classId: 'c3', dayOfWeek: 'Thứ 3', time: '17:30 - 19:30' },
  { id: '4', classId: 'c3', dayOfWeek: 'Thứ 6', time: '17:30 - 19:30' },
  { id: '5', classId: 'c4', dayOfWeek: 'Thứ 4', time: '17:30 - 19:30' },
  { id: '6', classId: 'c4', dayOfWeek: 'Chủ Nhật', time: '08:00 - 10:00' },
];

export const initialExercises: Exercise[] = [
  { id: '1', classId: 'c1', title: 'Bài tập Hàm số', description: 'Làm bài 1, 2, 3 SGK trang 45', dueDate: '2023-10-15' },
  { id: '2', classId: 'c3', title: 'Bài tập Lượng giác', description: 'Giải phương trình lượng giác cơ bản', dueDate: '2023-10-16' },
  { id: '3', classId: 'c4', title: 'Khảo sát hàm số', description: 'Khảo sát và vẽ đồ thị hàm số bậc 3', dueDate: '2023-10-17' },
];

export const initialRegistrations: Registration[] = [
  { id: '1', studentName: 'Hoàng Văn E', grade: 10, phone: '0987654321', status: 'pending', createdAt: new Date().toISOString() }
];

export const initialNotifications: AppNotification[] = [
  { id: '1', title: 'Nghỉ lễ Quốc Khánh', content: 'Trung tâm nghỉ lễ ngày 2/9. Các lớp học bù vào chủ nhật.', createdAt: new Date().toISOString(), isImportant: true }
];

export const initialSettings: AppSettings = {
  facebookGroupUrl: 'https://www.facebook.com/groups/mathmaster'
};

export const initialSubmissions: ExerciseSubmission[] = [];

