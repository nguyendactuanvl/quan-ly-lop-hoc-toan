import React from 'react';
import { Users, CalendarCheck, DollarSign, Calendar, BookOpen, UserPlus, LayoutDashboard, BookText, Settings, GraduationCap, Bell, LogOut } from 'lucide-react';
import { User } from '../types';

export type TabType = 'dashboard' | 'classes' | 'students' | 'attendance' | 'tuition' | 'schedule' | 'exercises' | 'registrations' | 'notifications' | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser: User;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, roles: ['admin', 'student'] },
    { id: 'classes', label: 'Quản lý Lớp', icon: GraduationCap, roles: ['admin'] },
    { id: 'students', label: 'Học sinh', icon: Users, roles: ['admin'] },
    { id: 'attendance', label: 'Điểm danh', icon: CalendarCheck, roles: ['admin', 'student'] },
    { id: 'tuition', label: 'Học phí', icon: DollarSign, roles: ['admin', 'student'] },
    { id: 'schedule', label: 'Thời khóa biểu & Kế hoạch', icon: Calendar, roles: ['admin', 'student'] },
    { id: 'exercises', label: 'Bài tập', icon: BookOpen, roles: ['admin', 'student'] },
    { id: 'registrations', label: 'Đăng ký học', icon: UserPlus, roles: ['admin'] },
    { id: 'notifications', label: 'Thông báo', icon: Bell, roles: ['admin', 'student'] },
    { id: 'settings', label: 'Cài đặt', icon: Settings, roles: ['admin'] },
  ] as const;

  const visibleItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-400">MathMaster</h1>
        <p className="text-slate-400 text-sm mt-1">
          {currentUser.role === 'admin' ? 'Quản lý lớp Toán THPT' : 'Cổng thông tin học sinh'}
        </p>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-4">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
