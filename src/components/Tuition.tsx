import React, { useState } from 'react';
import { Student, TuitionRecord, ClassInfo, User } from '../types';
import { CheckCircle2, XCircle, Search, Eye, EyeOff, Download, FileText, FileSpreadsheet, File as FilePdf } from 'lucide-react';
import { exportToExcel, exportToPDF, exportToWord } from '../utils/exportUtils';

interface TuitionProps {
  students: Student[];
  tuition: TuitionRecord[];
  setTuition: React.Dispatch<React.SetStateAction<TuitionRecord[]>>;
  classes: ClassInfo[];
  currentUser: User;
}

export function Tuition({ students, tuition, setTuition, classes, currentUser }: TuitionProps) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnpaid, setShowUnpaid] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const isAdmin = currentUser.role === 'admin';

  const handleToggleStatus = (studentId: string) => {
    if (!isAdmin) return;
    setTuition(prev => {
      const existing = prev.findIndex(t => t.studentId === studentId && t.month === selectedMonth && t.year === selectedYear);
      if (existing >= 0) {
        const newTuition = [...prev];
        newTuition[existing] = { 
          ...newTuition[existing], 
          status: newTuition[existing].status === 'paid' ? 'unpaid' : 'paid' 
        };
        return newTuition;
      } else {
        return [...prev, { studentId, month: selectedMonth, year: selectedYear, status: 'paid' }];
      }
    });
  };

  const getStatus = (studentId: string) => {
    const record = tuition.find(t => t.studentId === studentId && t.month === selectedMonth && t.year === selectedYear);
    return record?.status || 'unpaid';
  };

  const displayStudents = isAdmin ? students : students.filter(s => s.id === currentUser.studentId);

  const paidCount = displayStudents.filter(s => getStatus(s.id) === 'paid').length;
  const unpaidCount = displayStudents.length - paidCount;

  const filteredStudents = displayStudents.filter(student => {
    const status = getStatus(student.id);
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (searchTerm) {
      return matchesSearch; // If searching, show regardless of paid status
    }
    
    if (!showUnpaid && status === 'unpaid' && isAdmin) {
      return false; // Hide unpaid if toggle is off and no search (only for admin)
    }
    
    return true;
  });

  const prepareExportData = () => {
    return filteredStudents.map(s => ({
      'Họ và tên': s.name,
      'Lớp': classes.find(c => c.id === s.classId)?.name || 'Chưa xếp lớp',
      'Tháng': `${selectedMonth}/${selectedYear}`,
      'Trạng thái': getStatus(s.id) === 'paid' ? 'Đã đóng' : 'Chưa đóng'
    }));
  };

  const handleExportExcel = () => {
    exportToExcel(prepareExportData(), `Hoc_phi_T${selectedMonth}_${selectedYear}`);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    const headers = ['Họ và tên', 'Lớp', 'Tháng', 'Trạng thái'];
    const data = filteredStudents.map(s => [
      s.name, 
      classes.find(c => c.id === s.classId)?.name || 'Chưa xếp lớp', 
      `${selectedMonth}/${selectedYear}`, 
      getStatus(s.id) === 'paid' ? 'Đã đóng' : 'Chưa đóng'
    ]);
    exportToPDF(headers, data, `Hoc_phi_T${selectedMonth}_${selectedYear}`, `Danh sách học phí tháng ${selectedMonth}/${selectedYear}`);
    setShowExportMenu(false);
  };

  const handleExportWord = () => {
    const headers = ['Họ và tên', 'Lớp', 'Tháng', 'Trạng thái'];
    const data = filteredStudents.map(s => [
      s.name, 
      classes.find(c => c.id === s.classId)?.name || 'Chưa xếp lớp', 
      `${selectedMonth}/${selectedYear}`, 
      getStatus(s.id) === 'paid' ? 'Đã đóng' : 'Chưa đóng'
    ]);
    exportToWord(headers, data, `Hoc_phi_T${selectedMonth}_${selectedYear}`, `Danh sách học phí tháng ${selectedMonth}/${selectedYear}`);
    setShowExportMenu(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Quản lý học phí (8 buổi/tháng)</h2>
        {isAdmin && (
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
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <label className="block text-sm font-medium text-slate-500 mb-2">Chọn Tháng / Năm</label>
          <div className="flex space-x-4">
            <select 
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none flex-1"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
            <select 
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none flex-1"
            >
              {[currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1].map(y => (
                <option key={y} value={y}>Năm {y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-800">Đã đóng học phí</p>
            <p className="text-2xl font-bold text-emerald-900">{paidCount} học sinh</p>
          </div>
        </div>

        <div className="bg-rose-50 p-6 rounded-xl border border-rose-100 flex items-center space-x-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-full">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-rose-800">Chưa đóng học phí</p>
            <p className="text-2xl font-bold text-rose-900">{unpaidCount} học sinh</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowUnpaid(!showUnpaid)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              showUnpaid 
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showUnpaid ? <EyeOff size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
            {showUnpaid ? 'Ẩn học sinh chưa đóng' : 'Hiển thị học sinh chưa đóng'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Học sinh</th>
              <th className="p-4 font-medium">Lớp</th>
              <th className="p-4 font-medium">Trạng thái</th>
              {isAdmin && <th className="p-4 font-medium text-right">Thao tác</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredStudents.map(student => {
              const status = getStatus(student.id);
              const isPaid = status === 'paid';
              const classInfo = classes.find(c => c.id === student.classId);
              return (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{student.name}</td>
                  <td className="p-4 text-slate-600">{classInfo?.name || 'Chưa xếp lớp'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isPaid ? 'Đã đóng' : 'Chưa đóng'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleToggleStatus(student.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isPaid 
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {isPaid ? 'Hủy xác nhận' : 'Xác nhận đã đóng'}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="p-8 text-center text-slate-500">
                  {students.length === 0 
                    ? 'Chưa có học sinh nào.' 
                    : 'Không tìm thấy học sinh phù hợp (hoặc danh sách chưa đóng đang bị ẩn).'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
