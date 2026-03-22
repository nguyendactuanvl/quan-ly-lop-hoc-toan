import React, { useState, useRef } from 'react';
import { Exercise, ClassInfo, Student, ExerciseSubmission, User } from '../types';
import { Plus, FileText, Calendar as CalendarIcon, Trash2, Upload, CheckCircle2, XCircle, Image as ImageIcon } from 'lucide-react';

interface ExercisesProps {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  classes: ClassInfo[];
  students: Student[];
  submissions: ExerciseSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<ExerciseSubmission[]>>;
  currentUser: User;
}

export function Exercises({ exercises, setExercises, classes, students, submissions, setSubmissions, currentUser }: ExercisesProps) {
  const [filterClassId, setFilterClassId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'list' | 'progress' | 'submit'>('list');
  
  const isAdmin = currentUser.role === 'admin';
  
  // Add Exercise State
  const [isAdding, setIsAdding] = useState(false);
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({ 
    classId: classes[0]?.id || '', 
    dueDate: new Date().toISOString().split('T')[0] 
  });

  // Submit Exercise State
  const [submitStudentId, setSubmitStudentId] = useState<string>('');
  const [submitExerciseId, setSubmitExerciseId] = useState<string>('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredExercises = exercises.filter(e => filterClassId === 'all' || e.classId === filterClassId);

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
      // Also delete related submissions
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
    } else {
      alert('Vui lòng chọn học sinh, bài tập và tải lên ít nhất 1 ảnh.');
    }
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Quản lý Bài tập</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            Danh sách
          </button>
          <button 
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'progress' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            Tiến độ
          </button>
          <button 
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'submit' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            Nộp bài
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilterClassId('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterClassId === 'all' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Tất cả các lớp
            </button>
            {classes.map(c => (
              <button
                key={c.id}
                onClick={() => setFilterClassId(c.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterClassId === c.id 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c.name}
              </button>
            ))}
            {isAdmin && (
              <button 
                onClick={() => setIsAdding(true)}
                className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                <span>Thêm bài tập</span>
              </button>
            )}
          </div>

          {isAdding && isAdmin && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
              <h3 className="text-lg font-semibold mb-4">Thêm bài tập mới</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newExercise.title || ''}
                      onChange={e => setNewExercise({...newExercise, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Lớp</label>
                    <select 
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newExercise.classId}
                      onChange={e => setNewExercise({...newExercise, classId: e.target.value})}
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung / Yêu cầu</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newExercise.description || ''}
                    onChange={e => setNewExercise({...newExercise, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hạn nộp</label>
                  <input 
                    required
                    type="date" 
                    className="w-full md:w-1/2 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newExercise.dueDate || ''}
                    onChange={e => setNewExercise({...newExercise, dueDate: e.target.value})}
                  />
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
                    Lưu bài tập
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map(exercise => {
              const classInfo = classes.find(c => c.id === exercise.classId);
              return (
                <div key={exercise.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {classInfo?.name || 'Lớp không xác định'}
                    </span>
                    {isAdmin && (
                      <button onClick={() => handleDelete(exercise.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
                    <FileText size={18} className="mr-2 text-indigo-500" />
                    {exercise.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 flex-1 whitespace-pre-wrap">
                    {exercise.description}
                  </p>
                  <div className="flex items-center text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-auto">
                    <CalendarIcon size={16} className="mr-2" />
                    Hạn nộp: {new Date(exercise.dueDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              );
            })}
            {filteredExercises.length === 0 && (
              <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                Không có bài tập nào.
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'progress' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-800">Tiến độ hoàn thành bài tập</h3>
            <select 
              className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={filterClassId}
              onChange={e => setFilterClassId(e.target.value)}
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium border-b border-slate-200">Học sinh</th>
                  <th className="p-4 font-medium border-b border-slate-200">Lớp</th>
                  <th className="p-4 font-medium border-b border-slate-200">Bài tập đã nộp</th>
                  <th className="p-4 font-medium border-b border-slate-200">Tiến độ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students
                  .filter(s => filterClassId === 'all' || s.classId === filterClassId)
                  .map(student => {
                    const classInfo = classes.find(c => c.id === student.classId);
                    const studentExercises = exercises.filter(e => e.classId === student.classId);
                    const totalExercises = studentExercises.length;
                    
                    const studentSubmissions = submissions.filter(s => s.studentId === student.id);
                    // Count unique exercises submitted
                    const submittedExerciseIds = new Set(studentSubmissions.map(s => s.exerciseId));
                    const completedCount = submittedExerciseIds.size;
                    
                    const progress = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-900">{student.name}</td>
                        <td className="p-4 text-slate-600">{classInfo?.name}</td>
                        <td className="p-4 text-slate-600">
                          {completedCount} / {totalExercises} bài
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-full bg-slate-200 rounded-full h-2.5 max-w-[150px]">
                              <div 
                                className={`h-2.5 rounded-full ${progress === 100 ? 'bg-emerald-500' : progress > 0 ? 'bg-indigo-500' : 'bg-slate-300'}`} 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-600">{progress}%</span>
                          </div>
                        </td>
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
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Upload className="mr-2 text-indigo-600" size={20} />
            Nộp bài tập (Upload ảnh)
          </h3>
          <form onSubmit={handleSubmitExercise} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chọn học sinh</label>
              <select 
                required
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={submitStudentId}
                onChange={e => {
                  setSubmitStudentId(e.target.value);
                  setSubmitExerciseId(''); // Reset exercise when student changes
                }}
              >
                <option value="">-- Chọn học sinh --</option>
                {students.map(s => {
                  const classInfo = classes.find(c => c.id === s.classId);
                  return (
                    <option key={s.id} value={s.id}>{s.name} ({classInfo?.name})</option>
                  );
                })}
              </select>
            </div>

            {submitStudentId && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chọn bài tập</label>
                <select 
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={submitExerciseId}
                  onChange={e => setSubmitExerciseId(e.target.value)}
                >
                  <option value="">-- Chọn bài tập --</option>
                  {exercises
                    .filter(e => {
                      const student = students.find(s => s.id === submitStudentId);
                      return student && e.classId === student.classId;
                    })
                    .map(e => (
                      <option key={e.id} value={e.id}>{e.title} (Hạn: {new Date(e.dueDate).toLocaleDateString('vi-VN')})</option>
                    ))
                  }
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tải ảnh lên</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon size={32} className="mx-auto text-slate-400 mb-3" />
                <p className="text-sm text-slate-600 font-medium">Click để chọn ảnh từ thiết bị</p>
                <p className="text-xs text-slate-400 mt-1">Hỗ trợ JPG, PNG</p>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {previewImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ảnh đã chọn ({previewImages.length})</label>
                <div className="grid grid-cols-3 gap-4">
                  {previewImages.map((img, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square">
                      <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removePreviewImage(index)}
                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200">
              <button 
                type="submit"
                disabled={!submitStudentId || !submitExerciseId || previewImages.length === 0}
                className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                <CheckCircle2 size={20} className="mr-2" />
                Xác nhận nộp bài
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

