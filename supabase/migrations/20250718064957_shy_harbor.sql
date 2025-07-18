/*
  # 创建 todos 表和相关功能

  1. 新表
    - `todos`
      - `id` (uuid, 主键)
      - `user_id` (uuid, 外键到 auth.users)
      - `text` (text, 任务内容)
      - `completed` (boolean, 完成状态)
      - `priority` (text, 优先级: low/medium/high)
      - `created_at` (timestamptz, 创建时间)
      - `due_date` (timestamptz, 截止日期，可选)
      - `notes` (text, 备注，可选)
      - `image_url` (text, 图片URL，可选)

  2. 安全策略
    - 启用 RLS
    - 用户只能访问自己的任务

  3. 索引
    - 用户ID索引
    - 创建时间索引
    - 完成状态索引
*/

-- 确保启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
DROP TRIGGER IF EXISTS set_todos_user_id ON todos;
CREATE TRIGGER set_todos_user_id
  BEFORE INSERT ON todos
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();