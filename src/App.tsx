import React, { useState } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Classes } from './components/Classes';
import { Students } from './components/Students';
import { Attendance } from './components/Attendance';
import { Tuition } from './components/Tuition';
import { Schedule } from './components/Schedule';
import { Exercises } from './components/Exercises';
import { Registrations } from './components/Registrations';
import { Notifications } from './components/Notifications';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initialStudents, initialSchedule, initialExercises, initialRegistrations, initialClasses, initialNotifications, initialSettings, initialSubmissions } from './data/mockData';
import { Student, AttendanceRecord, TuitionRecord, ScheduleItem, Exercise, Registration, ClassInfo, AppNotification, AppSettings, ExerciseSubmission, User } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('math_current_user', null);

  const [students, setStudents] = useLocalStorage<Student[]>('math_students', initialStudents);
  const [classes, setClasses] = useLocalStorage<ClassInfo[]>('math_classes', initialClasses);
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('math_attendance', []);
  const [tuition, setTuition] = useLocalStorage<TuitionRecord[]>('math_tuition', []);
  const [schedule, setSchedule] = useLocalStorage<ScheduleItem[]>('math_schedule', initialSchedule);
  const [exercises, setExercises] = useLocalStorage<Exercise[]>('math_exercises', initialExercises);
  const [submissions, setSubmissions] = useLocalStorage<ExerciseSubmission[]>('math_submissions', initialSubmissions);
  const [registrations, setRegistrations] = useLocalStorage<Registration[]>('math_registrations', initialRegistrations);
  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>('math_notifications', initialNotifications);
  const [settings, setSettings] = useLocalStorage<AppSettings>('math_settings', initialSettings);

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
        return <Exercises exercises={exercises} setExercises={setExercises} classes={classes} students={students} submissions={submissions} setSubmissions={setSubmissions} currentUser={currentUser} />;
      case 'registrations':
        return currentUser.role === 'admin' ? <Registrations registrations={registrations} setRegistrations={setRegistrations} /> : null;
      case 'notifications':
        return <Notifications notifications={notifications} setNotifications={setNotifications} currentUser={currentUser} />;
      case 'settings':
        return currentUser.role === 'admin' ? <Settings settings={settings} setSettings={setSettings} /> : null;
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
