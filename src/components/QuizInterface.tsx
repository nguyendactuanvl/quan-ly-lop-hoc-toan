import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Hàm nhỏ để kiểm tra xem nội dung có chứa công thức Toán không
const MathText = ({ text }: { text: string }) => {
  if (!text) return null;
  const parts = text.split(/(\$.*?\$)/g);
  return (
    <span>
      {parts.map((part, i) => 
        part.startsWith('$') && part.endsWith('$') ? (
          <InlineMath key={i} math={part.slice(1, -1)} />
        ) : (
          part
        )
      )}
    </span>
  );
};

const QuizInterface = ({ question }: { question: any }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
      {/* 1. NỘI DUNG CÂU HỎI */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
          <MathText text={question.content} />
        </h3>
      </div>

      {/* 2. HÌNH ẢNH MINH HỌA (Nếu có link ở cột image_url) */}
      {question.image_url && (
        <div className="my-6 flex justify-center">
          <img 
            src={question.image_url} 
            alt="Minh họa đề bài" 
            className="max-h-64 object-contain rounded-lg border shadow-sm"
          />
        </div>
      )}

      <hr className="my-6 border-gray-100" />

      {/* 3. CÁC LOẠI ĐÁP ÁN */}
      
      {/* A. TRẮC NGHIỆM 4 LỰA CHỌN (Phần I) */}
      {question.type === 'choice' && (
        <div className="grid grid-cols-1 gap-3">
          {question.options?.map((opt: string, index: number) => (
            <button key={index} className="p-4 border-2 border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left flex items-center group">
              <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center font-bold mr-3">
                {String.fromCharCode(65 + index)}
              </span>
              <MathText text={opt} />
            </button>
          ))}
        </div>
      )}

      {/* B. ĐÚNG / SAI (Phần II - Chuẩn 2025) */}
      {question.type === 'true_false' && (
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-gray-100 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="p-3 text-left">Lệnh hỏi</th>
                <th className="p-3 w-20 text-center">Đúng</th>
                <th className="p-3 w-20 text-center">Sai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {question.options?.map((opt: string, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3">
                    <span className="font-bold mr-2">{String.fromCharCode(97 + index)}.</span>
                    <MathText text={opt} />
                  </td>
                  <td className="p-3 text-center">
                    <input type="radio" name={`q-${question.id}-${index}`} className="w-5 h-5 accent-green-600" />
                  </td>
                  <td className="p-3 text-center">
                    <input type="radio" name={`q-${question.id}-${index}`} className="w-5 h-5 accent-red-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* C. TRẢ LỜI NGẮN (Phần III) */}
      {question.type === 'short' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600 mb-2 text-indigo-500">Kết quả của bạn (Nhập số):</label>
          <input 
            type="text" 
            className="w-full p-4 border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:outline-none text-lg font-bold"
            placeholder="Ví dụ: 12.5"
          />
        </div>
      )}

      {/* D. TỰ LUẬN (Dành cho kiểm tra lớp) */}
      {question.type === 'essay' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Trình bày lời giải chi tiết:</label>
          <textarea 
            className="w-full p-4 border-2 border-gray-100 rounded-xl h-48 focus:border-indigo-500 focus:outline-none"
            placeholder="Các em trình bày lời giải tại đây hoặc nộp file ảnh sau..."
          />
        </div>
      )}
    </div>
  );
};

export default QuizInterface;