-- 为my-todo存储桶创建策略

-- 确保存储桶存在
INSERT INTO storage.buckets (id, name, public)
VALUES ('my-todo', 'my-todo', false)
ON CONFLICT (id) DO NOTHING;

-- 删除已有的策略（如果存在）
DROP POLICY IF EXISTS "用户可以查看自己的文件" ON storage.objects;
DROP POLICY IF EXISTS "用户可以上传自己的文件" ON storage.objects;
DROP POLICY IF EXISTS "用户可以更新自己的文件" ON storage.objects;
DROP POLICY IF EXISTS "用户可以删除自己的文件" ON storage.objects;

-- 创建策略：用户只能查看自己的文件
CREATE POLICY "用户可以查看自己的文件" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'my-todo' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 创建策略：用户只能上传到自己的文件夹
CREATE POLICY "用户可以上传自己的文件" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'my-todo' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 创建策略：用户只能更新自己的文件
CREATE POLICY "用户可以更新自己的文件" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'my-todo' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 创建策略：用户只能删除自己的文件
CREATE POLICY "用户可以删除自己的文件" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'my-todo' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  ); 