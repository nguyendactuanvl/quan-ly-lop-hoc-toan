import { supabase } from './lib/supabase';
import { useEffect } from 'react';
import React, { useState } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Classes } from './components/Classes';
import { Students } from './components/Students';
import { Attendance } from './components/Attendance';
import { Tuition } from './components/Tuition';
import { Schedule } from './components/Schedule';
import { Exercises } from './components/Exercises'; // Giao diện Exercises cũ
import QuizInterface from './components/QuizInterface'; // Thêm Giao diện Đề thi mới
import { Registrations } from './components/Registrations';
import { Notifications } from './components/Notifications';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initialSchedule, initialExercises, initialRegistrations, initialClasses, initialNotifications, initialSettings, initialSubmissions } from './data/mockData';
import { Student, AttendanceRecord, TuitionRecord, ScheduleItem, Exercise, Registration, ClassInfo, AppNotification, AppSettings, ExerciseSubmission, User } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('math_current_user', null);

  // Quan trọng: Dùng useState để chứa dữ liệu từ Supabase
  const [students, setStudents] = useState<Student[]>([]);
  
  // THÊM MỚI: State để chứa câu hỏi từ Supabase
  const [dbQuestions, setDbQuestions] = useState<any[]>([]); // Lưu ngân hàng câu hỏi

  const [classes, setClasses] = useLocalStorage<ClassInfo[]>('math_classes', initialClasses);
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('math_attendance', []);
  const [tuition, setTuition] = useLocalStorage<TuitionRecord[]>('math_tuition', []);
  const [schedule, setSchedule] = useLocalStorage<ScheduleItem[]>('math_schedule', initialSchedule);
  
  // Vẫn giữ Mock Data cũ cho Exercise để App không bị lỗi (tạm thời)
  const [exercises, setExercises] = useLocalStorage<Exercise[]>('math_exercises', initialExercises);
  const [submissions, setSubmissions] = useLocalStorage<ExerciseSubmission[]>('math_submissions', initialSubmissions);
  const [registrations, setRegistrations] = useLocalStorage<Registration[]>('math_registrations', initialRegistrations);
  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>('math_notifications', initialNotifications);
  const [settings, setSettings] = useLocalStorage<AppSettings>('math_settings', initialSettings);

  // 1. Tự động tải dữ liệu khi mở App
  useEffect(() => {
    const loadData = async () => {
      // A. Tải học sinh (giữ nguyên code cũ của thầy)
      const { data: stdData, error: stdError } = await supabase
        .from('students')
        .select('*');

      if (stdError) {
        console.error('Lỗi tải học sinh:', stdError.message);
      } else if (stdData) {
        const formattedData: Student[] = stdData.map(item => ({
          id: item.id.toString(),
          name: item.name || '',
          phone: item.phone || '',
          classId: item.class_id || 'Chưa xếp lớp',
          parentPhone: item.parent_phone || '',
          joinDate: item.created_at
        }));
        setStudents(formattedData);
        console.log("Đã tải học sinh thành công");
      }

      // B. Tải CÂU HỎI từ bảng questions (THÊM MỚI)
      const { data: quesData, error: quesError } = await supabase
        .from('questions')
        .select('*');
      
      if (quesError) {
        console.error('Lỗi tải câu hỏi từ Supabase:', quesError.message);
      } else if (quesData) {
        setDbQuestions(quesData); // Lưu vào kho để tí nữa dùng
        console.log("Đã tải ngân hàng câu hỏi thành công");
      }
    };
    loadData();
  }, []);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} students={students} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard students={students} attendance={attendance} tuition={tuition} registrations={registrations} notifications={notifications} settings={settings} classes={classes} currentUser={currentUser} />;
      case 'classes':
        return currentUser.role === 'admin' ? <Classes classes={classes} setClasses={setClasses} /> : null;
      case 'students':
        return currentUser.role === 'admin' ? <Students students={students} setStudents={setStudents} classes={classes} /> : null;
      case 'attendance':
        return <Attendance students={students} attendance={attendance} setAttendance={setAttendance} classes={classes} currentUser={currentUser} />;
      case 'tuition':
        return <Tuition students={students} tuition={tuition} setTuition={setTuition} classes={classes} currentUser={currentUser} />;
      case 'schedule':
        return <Schedule schedule={schedule} setSchedule={setSchedule} classes={classes} currentUser={currentUser} />;
      
      case 'exercises':
        // CHỈNH SỬA: Tôi chèn trực tiếp giao diện đề thi vào Dashboard để thầy kiểm tra nhanh
        // (Nếu thầy muốn làm một trang riêng chuyên nghiệp, thầy nên sửa file Exercises.tsx để nhận dbQuestions)
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">📝 Làm bài thi 2026 (Chương trình 2018)</h2>
            {dbQuestions.length > 0 ? (
              <div className="space-y-10">
                {dbQuestions.map((q, index) => (
                  <div key={q.id}>
                    <p className="text-sm font-medium text-indigo-500 mb-2 uppercase tracking-widest">
                      Câu hỏi {index + 1}
                    </p>
                    <QuizInterface question={q} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-xl text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">Kho đề đang trống. Thầy hãy Insert thêm câu hỏi trên Supabase nhé!</p>
              </div>
            )}
          </div>
        );
      
      case 'registrations':
        return currentUser.role === 'admin' ? <Registrations registrations={registrations} setRegistrations={setRegistrations} /> : null;
      case 'notifications':
        return <Notifications notifications={notifications} setNotifications={setNotifications} currentUser={currentUser} />;
      case 'settings':
        return <Settings settings={settings} setSettings={setSettings} />;
      default:
        return <Dashboard students={students} attendance={attendance} tuition={tuition} registrations={registrations} notifications={notifications} settings={settings} classes={classes} currentUser={currentUser} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}