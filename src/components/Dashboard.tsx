import React from 'react';
import { Users, DollarSign, UserPlus, BookOpen } from 'lucide-react';
import { Student, AttendanceRecord, TuitionRecord, Registration, AppNotification, AppSettings, ClassInfo, User } from '../types';

interface DashboardProps {
  students: Student[];
  attendance: AttendanceRecord[];
  tuition: TuitionRecord[];
  registrations: Registration[];
  notifications: AppNotification[];
  settings: AppSettings;
  classes: ClassInfo[];
  currentUser: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ students, attendance, tuition, registrations, notifications, settings, classes, currentUser }) => {
  
  // HÀM QUAN TRỌNG: Đếm học sinh bằng cách tìm chữ "10", "11", "12" trong tên lớp
  const getStudentCountByGrade = (grade: string) => {
    return students.filter(s => s.classId && s.classId.includes(grade)).length;
  };

  const stats = [
    { 
      title: 'Tổng số học sinh', 
      value: students.length, 
      icon: <Users size={24} />, 
      color: 'bg-blue-50 text-blue-600' 
    },
    { 
      title: 'Đã đóng học phí', 
      value: `${tuition.filter(t => t.status === 'paid').length} / ${students.length}`, 
      icon: <DollarSign size={24} />, 
      color: 'bg-green-50 text-green-600' 
    },
    { 
      title: 'Đăng ký mới', 
      value: registrations.filter(r => r.status === 'pending').length, 
      icon: <UserPlus size={24} />, 
      color: 'bg-orange-50 text-orange-600' 
    },
    { 
      title: 'Số lớp thực tế', 
      value: new Set(students.map(s => s.classId)).size, 
      icon: <BookOpen size={24} />, 
      color: 'bg-purple-50 text-purple-600' 
    },
  ];

  const grades = [
    { label: 'Khối 10', count: getStudentCountByGrade('10') },
    { label: 'Khối 11', count: getStudentCountByGrade('11') },
    { label: 'Khối 12', count: getStudentCountByGrade('12') },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Tổng quan trung tâm</h1>
      
      {/* 4 thẻ thống kê trên cùng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Biểu đồ phân bổ theo khối */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Phân bổ học sinh theo khối</h2>
          <div className="space-y-5">
            {grades.map((grade) => {
              const percentage = students.length > 0 ? (grade.count / students.length) * 100 : 0;
              return (
                <div key={grade.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700">{grade.label}</span>
                    <span className="text-slate-500 font-medium">{grade.count} học sinh ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div 
                      className="bg-indigo-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Danh sách học sinh (Xem nhanh) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h2 className="text-lg font-bold text-slate-800 mb-4">Danh sách học sinh mới nhất</h2>
           <div className="space-y-3">
              {students.slice(0, 5).map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.classId} • {student.phone}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">Học sinh</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};