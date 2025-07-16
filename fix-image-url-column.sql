-- 添加image_url列到todos表（如果不存在）
ALTER TABLE IF EXISTS todos
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 刷新Supabase的schema缓存
SELECT pg_notify('supabase_db_changes', 'reload_schema');

-- 验证列是否存在
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'todos' AND column_name = 'image_url';

-- 如果上述查询返回结果，则说明列已成功添加 