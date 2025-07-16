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

-- 启用行级安全策略
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己的任务
CREATE POLICY "用户可以查看自己的任务" ON todos
  FOR SELECT USING (auth.uid() = user_id);

-- 创建策略：用户可以插入自己的任务
CREATE POLICY "用户可以添加自己的任务" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建策略：用户可以更新自己的任务
CREATE POLICY "用户可以更新自己的任务" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

-- 创建策略：用户可以删除自己的任务
CREATE POLICY "用户可以删除自己的任务" ON todos
  FOR DELETE USING (auth.uid() = user_id);

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

-- 创建函数，获取当前用户的任务统计信息
CREATE OR REPLACE FUNCTION get_todo_stats()
RETURNS TABLE (
  total_count BIGINT,
  completed_count BIGINT,
  active_count BIGINT,
  high_priority_count BIGINT,
  due_today_count BIGINT
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
    )::BIGINT AS due_today_count
  FROM todos
  WHERE user_id = auth.uid();
END;
$$; 