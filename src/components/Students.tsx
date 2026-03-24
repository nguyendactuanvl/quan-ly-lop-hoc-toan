import React, { useState } from 'react';
import { Search, Plus, FileDown, Trash2, Filter } from 'lucide-react';
import { Student, ClassInfo } from '../types';

interface StudentsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: ClassInfo[];
}

export const Students: React.FC<StudentsProps> = ({ students, setStudents, classes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Hàm lấy tên lớp: Ưu tiên lấy trực tiếp từ database
  const getClassName = (classId: string) => {
    // Nếu classId đã là tên lớp (ví dụ: "LỚP 10"), hiện luôn
    if (classId.includes('LỚP') || classId.includes('Lớp')) return classId;
    
    // Nếu không, mới đi tìm trong danh sách classes
    const classInfo = classes.find(c => c.id === classId);
    return classInfo ? classInfo.name : 'Chưa xếp lớp';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.phone.includes(searchTerm);
    const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Danh sách học sinh</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <FileDown size={18} />
            <span>Xuất file</span>
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus size={18} />
            <span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm học sinh..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
             <button 
                onClick={() => setSelectedClass('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedClass === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                Tất cả
              </button>
              {/* Hiển thị các nút lọc lớp từ dữ liệu thực tế */}
              {Array.from(new Set(students.map(s => s.classId))).filter(Boolean).map(className => (
                <button
                  key={className}
                  onClick={() => setSelectedClass(className)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedClass === className ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  {className}
                </button>
              ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Họ và tên</th>
                <th className="px-6 py-4">Lớp</th>
                <th className="px-6 py-4">SĐT Học sinh</th>
                <th className="px-6 py-4">SĐT Phụ huynh</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{student.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getClassName(student.classId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{student.phone}</td>
                  <td className="px-6 py-4 text-slate-600">{student.parentPhone || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="p-12 text-center text-slate-500 bg-white">
              Không tìm thấy học sinh nào phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};