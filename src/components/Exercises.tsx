import React, { useState, useRef } from 'react';
import { Exercise, ClassInfo, Student, ExerciseSubmission, User } from '../types';
import { Plus, FileText, Calendar as CalendarIcon, Trash2, Upload, CheckCircle2, XCircle, Image as ImageIcon, BookOpen } from 'lucide-react';
import QuizInterface from './QuizInterface'; // Thầy nhớ file này phải nằm cùng thư mục components nhé

interface ExercisesProps {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  classes: ClassInfo[];
  students: Student[];
  submissions: ExerciseSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<ExerciseSubmission[]>>;
  currentUser: User;
  dbQuestions: any[]; // NHẬN DỮ LIỆU TỪ SUPABASE
}

export function Exercises({ exercises, setExercises, classes, students, submissions, setSubmissions, currentUser, dbQuestions }: ExercisesProps) {
  const [filterClassId, setFilterClassId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'list' | 'progress' | 'submit'>('list');
  
  const isAdmin = currentUser.role === 'admin';
  
  // States cũ giữ nguyên
  const [isAdding, setIsAdding] = useState(false);
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({ 
    classId: classes[0]?.id || '', 
    dueDate: new Date().toISOString().split('T')[0] 
  });

  const [submitStudentId, setSubmitStudentId] = useState<string>('');
  const [submitExerciseId, setSubmitExerciseId] = useState<string>('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredExercises = exercises.filter(e => filterClassId === 'all' || e.classId === filterClassId);

  // Các hàm xử lý cũ giữ nguyên...
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExercise.title && newExercise.description && newExercise.classId) {
      setExercises([...exercises, { ...newExercise, id: Date.now().toString() } as Exercise]);
      setIsAdding(false);
      setNewExercise({ classId: classes[0]?.id || '', dueDate: new Date().toISOString().split('T')[0] });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Xóa bài tập này?')) {
      setExercises(exercises.filter(e => e.id !== id));
      setSubmissions(submissions.filter(s => s.exerciseId !== id));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files as FileList).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitStudentId && submitExerciseId && previewImages.length > 0) {
      const newSubmission: ExerciseSubmission = {
        id: Date.now().toString(),
        exerciseId: submitExerciseId,
        studentId: submitStudentId,
        imageUrls: previewImages,
        submittedAt: new Date().toISOString()
      };
      setSubmissions([...submissions, newSubmission]);
      setSubmitStudentId('');
      setSubmitExerciseId('');
      setPreviewImages([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert('Nộp bài thành công!');
    }
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Bài tập & Luyện đề</h2>
        <div className="flex space-x-1 md:space-x-2">
          <button onClick={() => setActiveTab('list')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border'}`}>Danh sách</button>
          <button onClick={() => setActiveTab('progress')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'progress' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border'}`}>Tiến độ</button>
          <button onClick={() => setActiveTab('submit')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'submit' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border'}`}>Nộp ảnh</button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="space-y-12">
          {/* PHẦN 1: NGÂN HÀNG CÂU HỎI SUPABASE (LUYỆN ĐỀ 2026) */}
          <section className="bg-indigo-50 p-4 md:p-6 rounded-2xl border border-indigo-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-indigo-900 flex items-center">
                <BookOpen className="mr-2 text-indigo-600" /> Ngân hàng câu hỏi 2026
              </h3>
              <span className="text-xs font-bold bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full uppercase">Đề thi mới nhất</span>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {dbQuestions.length > 0 ? (
                dbQuestions.map((q, index) => (
                  <div key={q.id} className="bg-white p-2 rounded-xl shadow-sm border border-indigo-50 overflow-hidden">
                    <div className="bg-slate-50 p-2 flex justify-between items-center border-b mb-4">
                      <span className="text-xs font-black text-indigo-600 uppercase">Câu hỏi số {index + 1}</span>
                      <span className="text-[10px] text-slate-400">Dạng: {q.type === 'true_false' ? 'Đúng/Sai' : 'Trắc nghiệm'}</span>
                    </div>
                    <QuizInterface question={q} />
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-500 italic">Đang tải câu hỏi từ Supabase...</div>
              )}
            </div>
          </section>

          {/* PHẦN 2: BÀI TẬP TỰ LUẬN TRUYỀN THỐNG */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">Bài tập Tự luận & Về nhà</h3>
              {isAdmin && (
                <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"><Plus size={20}/></button>
              )}
            </div>

            {isAdding && isAdmin && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-semibold mb-4">Giao bài tập mới</h3>
                <form onSubmit={handleAdd} className="space-y-4">
                  <input required type="text" placeholder="Tiêu đề" className="w-full p-2 border rounded-lg" value={newExercise.title || ''} onChange={e => setNewExercise({...newExercise, title: e.target.value})} />
                  <textarea required rows={3} placeholder="Nội dung" className="w-full p-2 border rounded-lg" value={newExercise.description || ''} onChange={e => setNewExercise({...newExercise, description: e.target.value})} />
                  <div className="flex gap-4">
                    <select className="w-1/2 p-2 border rounded-lg" value={newExercise.classId} onChange={e => setNewExercise({...newExercise, classId: e.target.value})}>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input required type="date" className="w-1/2 p-2 border rounded-lg" value={newExercise.dueDate || ''} onChange={e => setNewExercise({...newExercise, dueDate: e.target.value})} />
                  </div>
                  <div className="flex justify-end space-x-3"><button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600">Hủy</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Lưu</button></div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map(exercise => (
                <div key={exercise.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col relative group">
                  <div className="flex justify-between mb-4">
                    <span className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded uppercase">Lớp {classes.find(c => c.id === exercise.classId)?.name}</span>
                    {isAdmin && <button onClick={() => handleDelete(exercise.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">{exercise.title}</h4>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">{exercise.description}</p>
                  <div className="mt-auto pt-4 border-t flex items-center text-xs text-slate-400"><CalendarIcon size={14} className="mr-1"/> Hạn: {new Date(exercise.dueDate).toLocaleDateString('vi-VN')}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* GIỮ NGUYÊN TAB PROGRESS VÀ SUBMIT CỦA THẦY Ở DƯỚI ĐÂY */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           {/* Copy y nguyên phần bảng Tiến độ của thầy vào đây */}
           <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-800">Tiến độ hoàn thành bài tập</h3>
            <select className="p-2 border border-slate-300 rounded-lg" value={filterClassId} onChange={e => setFilterClassId(e.target.value)}>
              <option value="all">Tất cả các lớp</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                {/* Giữ nguyên phần Tbody và Thead của thầy */}
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <th className="p-4 font-medium border-b">Học sinh</th>
                    <th className="p-4 font-medium border-b">Bài đã nộp</th>
                    <th className="p-4 font-medium border-b text-center">Tiến độ</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.filter(s => filterClassId === 'all' || s.classId === filterClassId).map(student => {
                    const studentEx = exercises.filter(e => e.classId === student.classId);
                    const studentSub = submissions.filter(s => s.studentId === student.id);
                    const progress = studentEx.length > 0 ? Math.round((new Set(studentSub.map(s => s.exerciseId)).size / studentEx.length) * 100) : 0;
                    return (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="p-4 text-sm font-medium">{student.name}</td>
                        <td className="p-4 text-xs text-slate-500">{new Set(studentSub.map(s => s.exerciseId)).size} / {studentEx.length} bài</td>
                        <td className="p-4"><div className="w-full bg-slate-200 h-1.5 rounded-full"><div className="bg-indigo-600 h-1.5 rounded-full" style={{width: `${progress}%`}}></div></div></td>
                      </tr>
                    );
                  })}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'submit' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
          {/* Copy y nguyên phần Form Nộp bài của thầy vào đây */}
          <h3 className="text-lg font-semibold mb-6 flex items-center text-emerald-600"><Upload className="mr-2" size={20}/> Nộp ảnh bài làm</h3>
          <form onSubmit={handleSubmitExercise} className="space-y-6">
            <select required className="w-full p-3 border rounded-lg" value={submitStudentId} onChange={e => setSubmitStudentId(e.target.value)}>
               <option value="">-- Chọn học sinh --</option>
               {students.map(s => <option key={s.id} value={s.id}>{s.name} ({classes.find(c => c.id === s.classId)?.name})</option>)}
            </select>
            {submitStudentId && (
              <select required className="w-full p-3 border rounded-lg" value={submitExerciseId} onChange={e => setSubmitExerciseId(e.target.value)}>
                <option value="">-- Chọn bài tập --</option>
                {exercises.filter(e => e.classId === students.find(s => s.id === submitStudentId)?.classId).map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            )}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon size={32} className="mx-auto text-slate-400 mb-2"/><p className="text-xs text-slate-500">Chụp ảnh hoặc chọn file</p>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            </div>
            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">{previewImages.map((img, i) => <div key={i} className="relative aspect-square border rounded-lg overflow-hidden"><img src={img} className="w-full h-full object-cover"/><button type="button" onClick={() => removePreviewImage(i)} className="absolute top-0 right-0 bg-white/80 p-1 rounded-bl-lg text-red-500"><XCircle size={14}/></button></div>)}</div>
            )}
            <button type="submit" disabled={previewImages.length === 0} className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold disabled:opacity-50">XÁC NHẬN NỘP BÀI</button>
          </form>
        </div>
      )}
    </div>
  );
}