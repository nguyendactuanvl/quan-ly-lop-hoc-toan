// Thêm State này vào đầu function QuizInterface
const [showResult, setShowResult] = useState(false);

// ... (Giữ nguyên các phần render cũ)

{/* THÊM NÚT BẤM VÀ LỜI GIẢI Ở CUỐI FILE, TRƯỚC DẤU ĐÓNG </div> CUỐI CÙNG */}
<div className="mt-8 pt-6 border-t border-dashed border-gray-200">
  {!showResult ? (
    <button 
      onClick={() => setShowResult(true)}
      className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center"
    >
      <CheckCircle2 className="mr-2" size={20} /> Kiểm tra đáp án & Xem lời giải
    </button>
  ) : (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
        <h4 className="font-bold text-amber-800 flex items-center mb-2">
          🎯 Đáp án đúng của Bộ:
        </h4>
        <p className="text-amber-900 font-mono bg-white inline-block px-3 py-1 rounded border border-amber-200">
          {question.correct_answer}
        </p>
      </div>

      {question.explanation && (
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-2 flex items-center">
             💡 Hướng dẫn giải chi tiết:
          </h4>
          <div className="text-slate-700 leading-relaxed italic">
            <MathText text={question.explanation} />
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setShowResult(false)}
        className="mt-4 text-sm text-slate-400 hover:text-indigo-600 underline"
      >
        Ẩn lời giải
      </button>
    </div>
  )}
</div>