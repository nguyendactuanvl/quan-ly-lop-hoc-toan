import { createClient } from '@supabase/supabase-js';

// 1. Lấy biến môi trường từ file .env (Cách viết chuẩn của Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Kiểm tra nhanh để tránh lỗi trắng trang nếu quên điền .env
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Lỗi: Thiếu cấu hình Supabase trong file .env rồi thầy Tuấn ơi!");
}

// 3. Khởi tạo Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);