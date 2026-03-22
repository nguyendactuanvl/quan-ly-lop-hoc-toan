import React from 'react';
import { Student, AttendanceRecord, TuitionRecord, Registration, AppNotification, AppSettings, ClassInfo, User } from '../types';
import { Users, BookOpen, DollarSign, UserPlus, Bell, Facebook, AlertCircle } from 'lucide-react';

interface DashboardProps {
  students: Student[];
  attendance: AttendanceRecord[];
  tuition: TuitionRecord[];
  registrations: Registration[];
  notifications: AppNotification[];
  settings: AppSettings;
  classes?: ClassInfo[];
  currentUser: User;
}

export function Dashboard({ students, attendance, tuition, registrations, notifications, settings, classes = [], currentUser }: DashboardProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const isStudent = currentUser.role === 'student';
  const currentStudent = isStudent ? students.find(s => s.id === currentUser.studentId) : null;
  const studentClass = currentStudent ? classes.find(c => c.id === currentStudent.classId) : null;

  const displayStudents = isStudent && currentStudent ? [currentStudent] : students;
  
  const paidThisMonth = tuition.filter(t => t.month === currentMonth && t.year === currentYear && t.status === 'paid' && (!isStudent || t.studentId === currentUser.studentId)).length;
  const pendingRegistrations = registrations.filter(r => r.status === 'pending').length;

  const stats = [
    {
      title: isStudent ? 'Lớp của bạn' : 'Tổng số học sinh',
      value: isStudent ? studentClass?.name || 'Chưa xếp lớp' : students.length,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      show: true
    },
    {
      title: 'Đã đóng học phí (Tháng này)',
      value: isStudent ? (paidThisMonth > 0 ? 'Đã đóng' : 'Chưa đóng') : `${paidThisMonth} / ${students.length}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      show: true
    },
    {
      title: 'Đăng ký mới chờ xử lý',
      value: pendingRegistrations,
      icon: UserPlus,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      show: !isStudent
    },
    {
      title: 'Tổng số lớp học',
      value: classes.length || '3',
      icon: BookOpen,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      show: !isStudent
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">
        {isStudent ? `Xin chào, ${currentStudent?.name}` : 'Tổng quan trung tâm'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.filter(s => s.show).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <div className={`p-4 rounded-xl ${stat.bgColor} ${stat.textColor}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {!isStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Phân bổ học sinh theo khối</h3>
            <div className="space-y-4">
              {([10, 11, 12] as const).map(grade => {
                const count = students.filter(s => {
                  const studentClass = classes.find(c => c.id === s.classId);
                  return studentClass ? studentClass.grade === grade : false;
                }).length;
                const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                return (
                  <div key={grade}>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="text-slate-700">Khối {grade}</span>
                      <span className="text-slate-500">{count} học sinh ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Học sinh chưa đóng học phí (Tháng {currentMonth})</h3>
            <div className="space-y-3">
              {students.filter(s => {
                const record = tuition.find(t => t.studentId === s.id && t.month === currentMonth && t.year === currentYear);
                return !record || record.status === 'unpaid';
              }).slice(0, 5).map(student => (
                <div key={student.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <p className="font-medium text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">
                      {classes.find(c => c.id === student.classId)?.name || 'Chưa xếp lớp'} • SĐT: {student.phone}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                    Chưa đóng
                  </span>
                </div>
              ))}
              {students.filter(s => {
                const record = tuition.find(t => t.studentId === s.id && t.month === currentMonth && t.year === currentYear);
                return !record || record.status === 'unpaid';
              }).length === 0 && (
                <p className="text-slate-500 text-center py-4">Tất cả học sinh đã đóng học phí.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Thông báo mới nhất</h3>
            <Bell size={20} className="text-slate-400" />
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 3).map(notification => (
              <div key={notification.id} className={`p-3 rounded-lg border ${notification.isImportant ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-start space-x-2">
                  {notification.isImportant && <AlertCircle size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />}
                  <div>
                    <h4 className={`font-medium text-sm ${notification.isImportant ? 'text-rose-800' : 'text-slate-800'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notification.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-slate-500 text-center py-4 text-sm">Không có thông báo nào.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Liên kết hữu ích</h3>
          <div className="space-y-3">
            {isStudent && studentClass?.facebookGroupUrl ? (
              <a 
                href={studentClass.facebookGroupUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-colors group"
              >
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Facebook size={24} />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-blue-900">Nhóm Facebook Lớp {studentClass.name}</h4>
                  <p className="text-sm text-blue-700 mt-0.5">Tham gia để trao đổi và nhận tài liệu</p>
                </div>
              </a>
            ) : !isStudent && classes.some(c => c.facebookGroupUrl) ? (
              classes.filter(c => c.facebookGroupUrl).map(c => (
                <a 
                  key={c.id}
                  href={c.facebookGroupUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-colors group"
                >
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Facebook size={24} />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-blue-900">Nhóm Facebook Lớp {c.name}</h4>
                  </div>
                </a>
              ))
            ) : settings.facebookGroupUrl ? (
              <a 
                href={settings.facebookGroupUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-colors group"
              >
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Facebook size={24} />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-blue-900">Nhóm Facebook Chung</h4>
                  <p className="text-sm text-blue-700 mt-0.5">Tham gia để trao đổi và nhận tài liệu</p>
                </div>
              </a>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <p className="text-slate-500 text-sm">Chưa cấu hình link nhóm Facebook.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
