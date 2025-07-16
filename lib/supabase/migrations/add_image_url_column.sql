-- 添加image_url列到todos表
ALTER TABLE IF EXISTS todos
ADD COLUMN IF NOT EXISTS image_url TEXT;
 
-- 刷新Supabase的schema缓存
SELECT pg_notify('supabase_db_changes', 'reload_schema'); 