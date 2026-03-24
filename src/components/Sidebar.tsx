import React, { useState } from 'react';
import { LayoutDashboard, Users, ClipboardCheck, DollarSign, Calendar, BookOpen, UserPlus, Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import { TabType } from '../App';
import { User } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái đóng/mở trên mobile

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} />, roles: ['admin', 'student'] },
    { id: 'students', label: 'Học sinh', icon: <Users size={20} />, roles: ['admin'] },
    { id: 'attendance', label: 'Điểm danh', icon: <ClipboardCheck size={20} />, roles: ['admin', 'student'] },
    { id: 'tuition', label: 'Học phí', icon: <DollarSign size={20} />, roles: ['admin', 'student'] },
    { id: 'exercises', label: 'Bài tập', icon: <BookOpen size={20} />, roles: ['admin', 'student'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  const handleTabClick = (id: string) => {
    setActiveTab(id as TabType);
    setIsOpen(false); // Tự động đóng menu sau khi chọn trên điện thoại
  };

  return (
    <>
      {/* Nút bấm mở Menu trên điện thoại */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-md shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Lớp phủ mờ khi mở menu trên mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Thanh Sidebar chính */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-full
      `}>
        <div className="p-6">
          <h1 className="text-xl font-bold text-white tracking-tight">MathMaster</h1>
          <p className="text-xs text-slate-500 mt-1">Quản lý lớp Toán THPT</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
};