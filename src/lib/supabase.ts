import { createClient } from '@supabase/supabase-js';

// Chúng ta ép kiểu 'any' để TypeScript bỏ qua việc kiểm tra lỗi này
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);