import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Save, Facebook } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export function Settings({ settings, setSettings }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Cài đặt hệ thống</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Thông tin chung</h3>
          <p className="text-sm text-slate-500">Cấu hình các thông tin hiển thị cho học sinh</p>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 flex items-center">
              <Facebook size={18} className="mr-2 text-blue-600" />
              Link nhóm Facebook (Dành cho học sinh)
            </label>
            <input 
              type="url" 
              placeholder="https://facebook.com/groups/..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={localSettings.facebookGroupUrl || ''}
              onChange={e => setLocalSettings({...localSettings, facebookGroupUrl: e.target.value})}
            />
            <p className="mt-2 text-sm text-slate-500">
              Đường link này sẽ hiển thị trên trang tổng quan để học sinh dễ dàng tham gia nhóm lớp.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {isSaved ? (
              <span className="text-emerald-600 font-medium flex items-center">
                Đã lưu cài đặt thành công!
              </span>
            ) : (
              <span />
            )}
            <button 
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Save size={18} className="mr-2" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}