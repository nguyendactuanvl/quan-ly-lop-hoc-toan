import React, { useState } from 'react';
import { User, Student } from '../types';
import { GraduationCap, Lock, Phone } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  students: Student[];
}

export function Login({ onLogin, students }: LoginProps) {
  const [role, setRole] = useState<'admin' | 'student'>('student');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      if (password === 'admin') {
        onLogin({ role: 'admin' });
      } else {
        setError('Mật khẩu không đúng. (Mật khẩu mặc định: admin)');
      }
    } else {
      const student = students.find(s => s.phone === phone);
      if (student) {
        onLogin({ role: 'student', studentId: student.id });
      } else {
        setError('Không tìm thấy học sinh với số điện thoại này.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-indigo-600">
          <GraduationCap size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          MathMaster
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Hệ thống quản lý lớp học thêm Toán THPT
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => { setRole('student'); setError(''); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                role === 'student'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Học sinh
            </button>
            <button
              onClick={() => { setRole('admin'); setError(''); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                role === 'admin'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Giáo viên
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {role === 'admin' ? (
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Mật khẩu
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md p-2 border outline-none"
                    placeholder="Nhập mật khẩu (admin)"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Số điện thoại học sinh
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md p-2 border outline-none"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
