import React, { useState } from 'react';
import { AppNotification, User } from '../types';
import { Plus, Bell, Trash2, AlertCircle } from 'lucide-react';

interface NotificationsProps {
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  currentUser: User;
}

export function Notifications({ notifications, setNotifications, currentUser }: NotificationsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNotification, setNewNotification] = useState<Partial<AppNotification>>({ 
    isImportant: false 
  });

  const isAdmin = currentUser.role === 'admin';

  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNotification.title && newNotification.content) {
      setNotifications([
        { 
          ...newNotification, 
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        } as AppNotification,
        ...notifications
      ]);
      setIsAdding(false);
      setNewNotification({ isImportant: false });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Xóa thông báo này?')) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Thông báo</h2>
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            <span>Tạo thông báo</span>
          </button>
        )}
      </div>

      {isAdding && isAdmin && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold mb-4">Tạo thông báo mới</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề</label>
              <input 
                required
                type="text" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newNotification.title || ''}
                onChange={e => setNewNotification({...newNotification, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung</label>
              <textarea 
                required
                rows={3}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newNotification.content || ''}
                onChange={e => setNewNotification({...newNotification, content: e.target.value})}
              />
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="isImportant"
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                checked={newNotification.isImportant || false}
                onChange={e => setNewNotification({...newNotification, isImportant: e.target.checked})}
              />
              <label htmlFor="isImportant" className="ml-2 text-sm text-slate-700">
                Đánh dấu là thông báo quan trọng (nổi bật)
              </label>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Gửi thông báo
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {sortedNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row md:items-start gap-4 ${
              notification.isImportant ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
            }`}
          >
            <div className={`p-3 rounded-full ${notification.isImportant ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {notification.isImportant ? <AlertCircle size={24} /> : <Bell size={24} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className={`text-lg font-bold mb-1 ${notification.isImportant ? 'text-rose-800' : 'text-slate-800'}`}>
                  {notification.title}
                </h3>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(notification.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-3">
                {new Date(notification.createdAt).toLocaleString('vi-VN')}
              </p>
              <p className="text-slate-700 whitespace-pre-wrap">
                {notification.content}
              </p>
            </div>
          </div>
        ))}
        {sortedNotifications.length === 0 && (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            Chưa có thông báo nào.
          </div>
        )}
      </div>
    </div>
  );
}
