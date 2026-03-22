import React, { useState } from 'react';
import { Student, ClassInfo, AttendanceRecord, User } from '../types';
import { Check, X, AlertCircle } from 'lucide-react';

interface AttendanceProps {
  students: Student[];
  classes: ClassInfo[];
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  currentUser: User;
}

export function Attendance({ students, classes, attendance, setAttendance, currentUser }: AttendanceProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || '');

  const filteredStudents = students.filter(s => s.classId === selectedClass);

  const isAdmin = currentUser.role === 'admin';

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'excused') => {
    if (!isAdmin) return;
    setAttendance(prev => {
      const existing = prev.findIndex(a => a.studentId === studentId && a.date === selectedDate);
      if (existing >= 0) {
        const newAttendance = [...prev];
        newAttendance[existing] = { ...newAttendance[existing], status };
        return newAttendance;
      } else {
        return [...prev, { studentId, date: selectedDate, status }];
      }
    });
  };

  const getStatus = (studentId: string) => {
    return attendance.find(a => a.studentId === studentId && a.date === selectedDate)?.status;
  };

  // Calculate absence stats
  const absenceStats = students.map(student => {
    const studentAttendance = attendance.filter(a => a.studentId === student.id);
    const absentCount = studentAttendance.filter(a => a.status === 'absent').length;
    const excusedCount = studentAttendance.filter(a => a.status === 'excused').length;
    return { ...student, absentCount, excusedCount, totalAbsence: absentCount + excusedCount };
  }).filter(s => s.totalAbsence > 0).sort((a, b) => b.totalAbsence - a.totalAbsence);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Điểm danh buổi học</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-6 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Ngày học</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Chọn Lớp</label>
          <select 
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-w-[200px]"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} (Khối {c.grade})</option>
            ))}
            {classes.length === 0 && <option value="" disabled>Chưa có lớp nào</option>}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800">Danh sách điểm danh</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Học sinh</th>
                <th className="p-4 font-medium text-center">Có mặt</th>
                <th className="p-4 font-medium text-center">Vắng (Có phép)</th>
                <th className="p-4 font-medium text-center">Vắng (Không phép)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map(student => {
                const status = getStatus(student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{student.name}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleStatusChange(student.id, 'present')}
                        disabled={!isAdmin}
                        className={`p-2 rounded-full transition-colors ${status === 'present' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-300'} ${isAdmin ? 'hover:bg-slate-100' : 'cursor-default'}`}
                      >
                        <Check size={24} />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleStatusChange(student.id, 'excused')}
                        disabled={!isAdmin}
                        className={`p-2 rounded-full transition-colors ${status === 'excused' ? 'bg-amber-100 text-amber-600' : 'text-slate-300'} ${isAdmin ? 'hover:bg-slate-100' : 'cursor-default'}`}
                      >
                        <AlertCircle size={24} />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        disabled={!isAdmin}
                        className={`p-2 rounded-full transition-colors ${status === 'absent' ? 'bg-red-100 text-red-600' : 'text-slate-300'} ${isAdmin ? 'hover:bg-slate-100' : 'cursor-default'}`}
                      >
                        <X size={24} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Không có học sinh nào trong lớp này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-200 bg-rose-50">
            <h3 className="font-bold text-rose-800">Cảnh báo vắng nhiều</h3>
          </div>
          <div className="p-4 space-y-3">
            {absenceStats.slice(0, 10).map(student => (
              <div key={student.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="font-medium text-slate-800">{student.name}</p>
                  <p className="text-xs text-slate-500">{classes.find(c => c.id === student.classId)?.name}</p>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-rose-600">{student.totalAbsence} buổi</span>
                  <span className="text-xs text-slate-500">({student.absentCount} KP, {student.excusedCount} CP)</span>
                </div>
              </div>
            ))}
            {absenceStats.length === 0 && (
              <p className="text-slate-500 text-center py-4 text-sm">Chưa có dữ liệu học sinh vắng.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
