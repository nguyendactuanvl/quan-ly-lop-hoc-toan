import React, { useState } from 'react';
import { Calendar, ChevronRight, UserCheck, UserX, AlertCircle, Clock } from 'lucide-react';
import { Student, AttendanceRecord, ClassInfo, User } from '../types';

interface AttendanceProps {
  students: Student[];
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  classes: ClassInfo[];
  currentUser: User;
}

export const Attendance: React.FC<AttendanceProps> = ({ students, attendance, setAttendance, classes, currentUser }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');

  // HÀM QUAN TRỌNG: Lọc học sinh theo lớp
  const filteredStudents = students.filter(student => {
    if (selectedClassId === 'all') return false;
    // So sánh linh hoạt: chỉ cần tên lớp chứa classId hoặc ngược lại
    return student.classId === selectedClassId || selectedClassId.includes(student.classId);
  });

  const getAttendanceStatus = (studentId: string) => {
    return attendance.find(a => a.studentId === studentId && a.date === selectedDate)?.status;
  };

  const handleAttendance = (studentId: string, status: 'present' | 'absent_excused' | 'absent_no_excuse') => {
    const existingIndex = attendance.findIndex(a => a.studentId === studentId && a.date === selectedDate);
    
    if (existingIndex >= 0) {
      const newAttendance = [...attendance];
      newAttendance[existingIndex] = { ...newAttendance[existingIndex], status };
      setAttendance(newAttendance);
    } else {
      setAttendance([...attendance, {
        id: Math.random().toString(36).substr(2, 9),
        studentId,
        date: selectedDate,
        status,
        note: ''
      }]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Điểm danh buổi học</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ngày học</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Chọn Lớp</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="all">-- Chọn lớp cần điểm danh --</option>
              {/* Lấy danh sách các lớp thực tế từ học sinh trên database */}
              {Array.from(new Set(students.map(s => s.classId))).filter(Boolean).map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="font-bold text-slate-800">Danh sách điểm danh</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Học sinh</th>
                <th className="px-6 py-4 text-center">Có mặt</th>
                <th className="px-6 py-4 text-center">Vắng (Có phép)</th>
                <th className="px-6 py-4 text-center">Vắng (Không phép)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const status = getAttendanceStatus(student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{student.name}</div>
                      <div className="text-xs text-slate-500">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleAttendance(student.id, 'present')}
                        className={`p-2 rounded-full transition-colors ${status === 'present' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      >
                        <UserCheck size={20} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleAttendance(student.id, 'absent_excused')}
                        className={`p-2 rounded-full transition-colors ${status === 'absent_excused' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      >
                        <Clock size={20} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleAttendance(student.id, 'absent_no_excuse')}
                        className={`p-2 rounded-full transition-colors ${status === 'absent_no_excuse' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      >
                        <UserX size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              {selectedClassId === 'all' ? 'Vui lòng chọn lớp để xem danh sách.' : 'Không có học sinh nào trong lớp này.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};