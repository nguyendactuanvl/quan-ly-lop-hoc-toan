import React, { useState } from 'react';
import { ClassInfo, Grade } from '../types';
import { Plus, Trash2, Edit2, Facebook } from 'lucide-react';

interface ClassesProps {
  classes: ClassInfo[];
  setClasses: React.Dispatch<React.SetStateAction<ClassInfo[]>>;
}

export function Classes({ classes, setClasses }: ClassesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ClassInfo>>({ grade: 10 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
      if (editingId) {
        setClasses(classes.map(c => c.id === editingId ? { ...formData, id: editingId } as ClassInfo : c));
      } else {
        setClasses([...classes, { ...formData, id: Date.now().toString() } as ClassInfo]);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ grade: 10 });
    }
  };

  const handleEdit = (cls: ClassInfo) => {
    setFormData(cls);
    setEditingId(cls.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa lớp này? Các học sinh trong lớp sẽ không thuộc lớp nào.')) {
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Quản lý Lớp học</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Thêm lớp</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Sửa lớp' : 'Thêm lớp mới'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên lớp (VD: 10A1)</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Khối</label>
                <select 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.grade}
                  onChange={e => setFormData({...formData, grade: Number(e.target.value) as Grade})}
                >
                  <option value={10}>Lớp 10</option>
                  <option value={11}>Lớp 11</option>
                  <option value={12}>Lớp 12</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link nhóm Facebook (Tùy chọn)</label>
              <input 
                type="url" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.facebookGroupUrl || ''}
                onChange={e => setFormData({...formData, facebookGroupUrl: e.target.value})}
                placeholder="https://facebook.com/groups/..."
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button 
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); setFormData({ grade: 10 }); }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editingId ? 'Cập nhật' : 'Lưu lớp'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {([10, 11, 12] as Grade[]).map(grade => {
          const gradeClasses = classes.filter(c => c.grade === grade);
          return (
            <div key={grade} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-800">Khối {grade}</h3>
              </div>
              <ul className="divide-y divide-slate-100">
                {gradeClasses.map(cls => (
                  <li key={cls.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                    <div>
                      <span className="font-medium text-indigo-600 block">{cls.name}</span>
                      {cls.facebookGroupUrl && (
                        <a href={cls.facebookGroupUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 flex items-center mt-1 hover:underline">
                          <Facebook size={12} className="mr-1" /> Nhóm FB
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(cls)} className="text-slate-400 hover:text-indigo-600">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(cls.id)} className="text-slate-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
                {gradeClasses.length === 0 && (
                  <li className="p-4 text-sm text-slate-500 text-center">Chưa có lớp nào</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
