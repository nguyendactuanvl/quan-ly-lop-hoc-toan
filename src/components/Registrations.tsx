import React, { useState } from 'react';
import { Registration, Grade } from '../types';
import { Check, Clock } from 'lucide-react';

interface RegistrationsProps {
  registrations: Registration[];
  setRegistrations: React.Dispatch<React.SetStateAction<Registration[]>>;
}

export function Registrations({ registrations, setRegistrations }: RegistrationsProps) {
  const [newReg, setNewReg] = useState<Partial<Registration>>({ grade: 10 });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReg.studentName && newReg.phone) {
      setRegistrations([
        { 
          ...newReg, 
          id: Date.now().toString(), 
          status: 'pending', 
          createdAt: new Date().toISOString() 
        } as Registration,
        ...registrations
      ]);
      setNewReg({ grade: 10 });
      setShowForm(false);
      alert('Đăng ký thành công! Chúng tôi sẽ liên hệ sớm nhất.');
    }
  };

  const handleToggleStatus = (id: string) => {
    setRegistrations(registrations.map(r => 
      r.id === id 
        ? { ...r, status: r.status === 'pending' ? 'contacted' : 'pending' } 
        : r
    ));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Liên hệ & Đăng ký học</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          {showForm ? 'Xem danh sách' : 'Mở form đăng ký (Public)'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-indigo-900 mb-2">Đăng ký học thêm Toán</h3>
            <p className="text-slate-500">Vui lòng điền thông tin, trung tâm sẽ liên hệ lại để tư vấn lớp học phù hợp.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Họ và tên học sinh</label>
              <input 
                required
                type="text" 
                placeholder="Nhập họ và tên..."
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newReg.studentName || ''}
                onChange={e => setNewReg({...newReg, studentName: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Số điện thoại liên hệ</label>
                <input 
                  required
                  type="tel" 
                  placeholder="09xx xxx xxx"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newReg.phone || ''}
                  onChange={e => setNewReg({...newReg, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Đăng ký học lớp</label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newReg.grade}
                  onChange={e => setNewReg({...newReg, grade: Number(e.target.value) as Grade})}
                >
                  <option value={10}>Toán Lớp 10</option>
                  <option value={11}>Toán Lớp 11</option>
                  <option value={12}>Toán Lớp 12 (Luyện thi THPT QG)</option>
                </select>
              </div>
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Gửi thông tin đăng ký
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Thời gian</th>
                <th className="p-4 font-medium">Học sinh</th>
                <th className="p-4 font-medium">Lớp</th>
                <th className="p-4 font-medium">Số điện thoại</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {registrations.map(reg => {
                const isContacted = reg.status === 'contacted';
                return (
                  <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-500 text-sm">
                      {new Date(reg.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4 font-medium text-slate-900">{reg.studentName}</td>
                    <td className="p-4 text-slate-600">Lớp {reg.grade}</td>
                    <td className="p-4 text-slate-600 font-mono">{reg.phone}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        isContacted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isContacted ? (
                          <><Check size={14} className="mr-1" /> Đã liên hệ</>
                        ) : (
                          <><Clock size={14} className="mr-1" /> Chờ liên hệ</>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleToggleStatus(reg.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          isContacted 
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                        }`}
                      >
                        {isContacted ? 'Đánh dấu chưa LH' : 'Đánh dấu đã LH'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {registrations.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Chưa có lượt đăng ký nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
