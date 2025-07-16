-- 确保启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 删除已存在的表（如果需要重新创建）
DROP TABLE IF EXISTS todos;

-- 创建todos表
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date TIMESTAMPTZ,
  notes TEXT,
  image_url TEXT
);

-- 创建索引
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos (user_id);
CREATE INDEX IF NOT EXISTS todos_created_at_idx ON todos (created_at);
CREATE INDEX IF NOT EXISTS todos_completed_idx ON todos (completed);
CREATE INDEX IF NOT EXISTS todos_priority_idx ON todos (priority);
CREATE INDEX IF NOT EXISTS todos_due_date_idx ON todos (due_date);
CREATE INDEX IF NOT EXISTS todos_user_completed_idx ON todos (user_id, completed);
CREATE INDEX IF NOT EXISTS todos_user_priority_idx ON todos (user_id, priority);

-- 启用行级安全策略
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 删除已存在的策略（如果需要重新创建）
DROP POLICY IF EXISTS "用户可以查看自己的任务" ON todos;
DROP POLICY IF EXISTS "用户可以添加自己的任务" ON todos;
DROP POLICY IF EXISTS "用户可以更新自己的任务" ON todos;
DROP POLICY IF EXISTS "用户可以删除自己的任务" ON todos;

-- 创建策略：用户只能查看自己的任务
CREATE POLICY "用户可以查看自己的任务" ON todos
  FOR SELECT USING (auth.uid() = user_id);

-- 创建策略：用户只能插入自己的任务
CREATE POLICY "用户可以添加自己的任务" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建策略：用户只能更新自己的任务
CREATE POLICY "用户可以更新自己的任务" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

-- 创建策略：用户只能删除自己的任务
CREATE POLICY "用户可以删除自己的任务" ON todos
  FOR DELETE USING (auth.uid() = user_id);

-- 启用Realtime功能
-- 注意：需要在Supabase控制台中启用Realtime功能，并选择要发布的表
-- 以下SQL语句可以通过编程方式启用todos表的Realtime功能
BEGIN;
  -- 检查supabase_realtime schema是否存在
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_namespace
      WHERE nspname = 'supabase_realtime'
    ) THEN
      -- 如果存在，启用todos表的Realtime
      INSERT INTO supabase_realtime.subscription (name, table_name, claims, filters, created_at)
      VALUES ('todos_realtime', 'todos', '{user_id}', NULL, now())
      ON CONFLICT (name) DO NOTHING;
      
      -- 设置实时发布优先级为高
      INSERT INTO supabase_realtime.publication (name, table_name, publish_insert, publish_update, publish_delete, publish_truncate, priority, created_at)
      VALUES ('todos_publication', 'todos', true, true, true, false, 1, now())
      ON CONFLICT (name, table_name) DO UPDATE SET priority = 1;
    END IF;
  END $$;
COMMIT;

-- 删除已存在的触发器和函数（如果需要重新创建）
DROP TRIGGER IF EXISTS set_todos_user_id ON todos;
DROP TRIGGER IF EXISTS notify_todos_changes ON todos;
DROP FUNCTION IF EXISTS set_user_id();
DROP FUNCTION IF EXISTS get_todo_stats();
DROP FUNCTION IF EXISTS notify_todo_changes();

-- 创建触发器函数，自动设置user_id为当前用户
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器，在插入时自动设置user_id
CREATE TRIGGER set_todos_user_id
  BEFORE INSERT ON todos
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();

-- 创建触发器函数，用于通知实时变更
CREATE OR REPLACE FUNCTION notify_todo_changes()
RETURNS TRIGGER AS $$
DECLARE
  record_data JSONB;
  notification JSONB;
  event_type TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    record_data = to_jsonb(NEW);
    event_type = 'INSERT';
  ELSIF TG_OP = 'UPDATE' THEN
    record_data = to_jsonb(NEW);
    event_type = 'UPDATE';
  ELSE
    record_data = to_jsonb(OLD);
    event_type = 'DELETE';
  END IF;
  
  notification = jsonb_build_object(
    'table', 'todos',
    'type', event_type,
    'record', record_data,
    'user_id', COALESCE(record_data->>'user_id', auth.uid()::text),
    'timestamp', extract(epoch from now())
  );
  
  -- 使用pg_notify发送通知
  PERFORM pg_notify('todos_changes', notification::text);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器，在任务变更时发送通知
CREATE TRIGGER notify_todos_changes
  AFTER INSERT OR UPDATE OR DELETE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION notify_todo_changes();

-- 创建函数，获取当前用户的任务统计信息
CREATE OR REPLACE FUNCTION get_todo_stats()
RETURNS TABLE (
  total_count BIGINT,
  completed_count BIGINT,
  active_count BIGINT,
  high_priority_count BIGINT,
  due_today_count BIGINT,
  overdue_count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_count,
    COUNT(*) FILTER (WHERE completed = true)::BIGINT AS completed_count,
    COUNT(*) FILTER (WHERE completed = false)::BIGINT AS active_count,
    COUNT(*) FILTER (WHERE priority = 'high' AND completed = false)::BIGINT AS high_priority_count,
    COUNT(*) FILTER (WHERE 
      due_date::date = CURRENT_DATE AND completed = false
    )::BIGINT AS due_today_count,
    COUNT(*) FILTER (WHERE 
      due_date < CURRENT_DATE AND completed = false
    )::BIGINT AS overdue_count
  FROM todos
  WHERE user_id = auth.uid();
END;
$$;

-- 为管理员创建一个可以查看所有任务的函数（可选）
CREATE OR REPLACE FUNCTION admin_get_all_todos()
RETURNS SETOF todos
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 检查调用者是否为管理员（需要自定义实现）
  -- 这里仅作为示例
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() AND email LIKE '%admin%'
  ) THEN
    RETURN QUERY SELECT * FROM todos;
  ELSE
    RAISE EXCEPTION '只有管理员才能访问所有任务';
  END IF;
END;
$$; 