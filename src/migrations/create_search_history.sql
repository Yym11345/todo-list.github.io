-- 创建搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(user_id, query)
);

-- 创建索引以加快查询速度
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at);

-- 添加触发器以限制每个用户的搜索历史数量（最多保留20条）
CREATE OR REPLACE FUNCTION limit_search_history()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM search_history
  WHERE user_id = NEW.user_id
  AND id NOT IN (
    SELECT id
    FROM search_history
    WHERE user_id = NEW.user_id
    ORDER BY created_at DESC
    LIMIT 19
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_limit_search_history
AFTER INSERT ON search_history
FOR EACH ROW
EXECUTE FUNCTION limit_search_history(); 