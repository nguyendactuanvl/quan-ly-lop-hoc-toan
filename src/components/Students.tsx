import React, { useState } from 'react';
import { Student, ClassInfo } from '../types';
import { Plus, Search, Trash2, Download, FileText, FileSpreadsheet, File as FilePdf } from 'lucide-react';
import { exportToExcel, exportToPDF, exportToWord } from '../utils/exportUtils';

interface StudentsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: ClassInfo[];
}

export function Students({ students, setStudents, classes }: StudentsProps) {
  const [filterClass, setFilterClass] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({ classId: classes[0]?.id || '' });
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredStudents = students.filter(s => 
    (filterClass === 'all' || s.classId === filterClass) &&
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudent.name && newStudent.phone && newStudent.classId) {
      setStudents([...students, { ...newStudent, id: Date.now().toString() } as Student]);
      setIsAdding(false);
      setNewStudent({ classId: classes[0]?.id || '' });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'Chưa xếp lớp';
  };

  const prepareExportData = () => {
    return filteredStudents.map(s => ({
      'Họ và tên': s.name,
      'Lớp': getClassName(s.classId),
      'SĐT Học sinh': s.phone,
      'SĐT Phụ huynh': s.parentPhone || ''
    }));
  };

  const handleExportExcel = () => {
    exportToExcel(prepareExportData(), 'Danh_sach_hoc_sinh');
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    const headers = ['Họ và tên', 'Lớp', 'SĐT Học sinh', 'SĐT Phụ huynh'];
    const data = filteredStudents.map(s => [s.name, getClassName(s.classId), s.phone, s.parentPhone || '']);
    exportToPDF(headers, data, 'Danh_sach_hoc_sinh', 'Danh sách học sinh');
    setShowExportMenu(false);
  };

  const handleExportWord = () => {
    const headers = ['Họ và tên', 'Lớp', 'SĐT Học sinh', 'SĐT Phụ huynh'];
    const data = filteredStudents.map(s => [s.name, getClassName(s.classId), s.phone, s.parentPhone || '']);
    exportToWord(headers, data, 'Danh_sach_hoc_sinh', 'Danh sách học sinh');
    setShowExportMenu(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Danh sách học sinh</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-50 transition-colors"
            >
              <Download size={20} />
              <span>Xuất file</span>
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
                <button 
                  onClick={handleExportExcel}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <FileSpreadsheet size={16} className="text-emerald-600" />
                  <span>Xuất Excel</span>
                </button>
                <button 
                  onClick={handleExportWord}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <FileText size={16} className="text-blue-600" />
                  <span>Xuất Word</span>
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <FilePdf size={16} className="text-rose-600" />
                  <span>Xuất PDF</span>
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            <span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold mb-4">Thêm học sinh mới</h3>
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
              <input 
                required
                type="text" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newStudent.name || ''}
                onChange={e => setNewStudent({...newStudent, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lớp</label>
              <select 
                required
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newStudent.classId}
                onChange={e => setNewStudent({...newStudent, classId: e.target.value})}
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Khối {c.grade})</option>
                ))}
                {classes.length === 0 && <option value="" disabled>Chưa có lớp nào</option>}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại HS</label>
              <input 
                required
                type="tel" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newStudent.phone || ''}
                onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại Phụ huynh</label>
              <input 
                type="tel" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newStudent.parentPhone || ''}
                onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit"
                disabled={classes.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Lưu học sinh
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm học sinh..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <button
              onClick={() => setFilterClass('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterClass === 'all' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất cả
            </button>
            {classes.map(c => (
              <button
                key={c.id}
                onClick={() => setFilterClass(c.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterClass === c.id 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Họ và tên</th>
                <th className="p-4 font-medium">Lớp</th>
                <th className="p-4 font-medium">SĐT Học sinh</th>
                <th className="p-4 font-medium">SĐT Phụ huynh</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{student.name}</td>
                  <td className="p-4 text-slate-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getClassName(student.classId)}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{student.phone}</td>
                  <td className="p-4 text-slate-600">{student.parentPhone}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(student.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Không tìm thấy học sinh nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
