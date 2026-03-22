import React, { useState } from 'react';
import { ScheduleItem, ClassInfo, User } from '../types';
import { Clock, Plus, Edit2, Trash2, BookOpen } from 'lucide-react';

interface ScheduleProps {
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  classes: ClassInfo[];
  currentUser: User;
}

export function Schedule({ schedule, setSchedule, classes, currentUser }: ScheduleProps) {
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({ classId: classes[0]?.id || '', dayOfWeek: 'Thứ 2', time: '17:30 - 19:30', content: '' });

  const isAdmin = currentUser.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.time && formData.classId) {
      if (editingId) {
        setSchedule(schedule.map(s => s.id === editingId ? { ...formData, id: editingId } as ScheduleItem : s));
      } else {
        setSchedule([...schedule, { ...formData, id: Date.now().toString() } as ScheduleItem]);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ classId: classes[0]?.id || '', dayOfWeek: 'Thứ 2', time: '17:30 - 19:30', content: '' });
    }
  };

  const handleEdit = (item: ScheduleItem) => {
    setFormData(item);
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa lịch học này?')) {
      setSchedule(schedule.filter(s => s.id !== id));
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ classId: classes[0]?.id || '', dayOfWeek: 'Thứ 2', time: '17:30 - 19:30', content: '' });
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'Chưa xếp lớp';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Thời khóa biểu & Kế hoạch dạy</h2>
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            <span>Thêm lịch học</span>
          </button>
        )}
      </div>

      {isAdding && isAdmin && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Sửa lịch học' : 'Thêm lịch học mới'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lớp</label>
              <select 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.classId}
                onChange={e => setFormData({...formData, classId: e.target.value})}
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Khối {c.grade})</option>
                ))}
                {classes.length === 0 && <option value="" disabled>Chưa có lớp nào</option>}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thứ</label>
              <select 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.dayOfWeek}
                onChange={e => setFormData({...formData, dayOfWeek: e.target.value})}
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thời gian</label>
              <input 
                required
                type="text" 
                placeholder="VD: 17:30 - 19:30"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.time || ''}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung bài học (Kế hoạch dạy)</label>
              <textarea 
                placeholder="Nhập nội dung bài học dự kiến..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                value={formData.content || ''}
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
            </div>
            <div className="md:col-span-3 flex justify-end space-x-3 mt-2">
              <button 
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit"
                disabled={classes.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {editingId ? 'Cập nhật' : 'Lưu lịch học'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1000px] grid grid-cols-7 gap-4">
          {days.map(day => {
            const dayClasses = schedule.filter(s => s.dayOfWeek === day).sort((a, b) => a.time.localeCompare(b.time));
            
            return (
              <div key={day} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                <div className="bg-indigo-50 p-3 border-b border-indigo-100 text-center">
                  <h3 className="font-bold text-indigo-900">{day}</h3>
                </div>
                <div className="p-3 space-y-3 flex-1 bg-slate-50/50">
                  {dayClasses.length === 0 ? (
                    <p className="text-center text-sm text-slate-400 py-4">Trống</p>
                  ) : (
                    dayClasses.map(cls => (
                      <div key={cls.id} className="flex flex-col p-3 bg-white rounded-lg border border-slate-200 shadow-sm relative group hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-indigo-700">{getClassName(cls.classId)}</span>
                        </div>
                        
                        <div className="flex items-center text-xs font-medium text-slate-600 mb-2">
                          <Clock size={14} className="mr-1.5 text-slate-400" />
                          {cls.time}
                        </div>

                        {cls.content && (
                          <div className="mt-1 pt-2 border-t border-slate-100">
                            <div className="flex items-start text-xs text-slate-600">
                              <BookOpen size={14} className="mr-1.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                              <span className="line-clamp-3" title={cls.content}>{cls.content}</span>
                            </div>
                          </div>
                        )}
                        
                        {isAdmin && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 bg-white rounded-md shadow-sm border border-slate-200">
                            <button 
                              onClick={() => handleEdit(cls)}
                              className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                              title="Sửa"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(cls.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
