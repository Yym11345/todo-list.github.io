# Supabase 连接配置指南

## 🚀 快速开始

### 第一步：获取 Supabase 凭证

1. **访问 Supabase Dashboard**
   - 打开 [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - 登录你的账户

2. **创建或选择项目**
   - 如果没有项目，点击 "New Project" 创建
   - 如果已有项目，直接选择

3. **获取 API 凭证**
   - 在项目页面，点击左侧菜单的 "Settings"
   - 选择 "API" 选项卡
   - 复制以下两个值：
     - **Project URL** (格式: https://xxx.supabase.co)
     - **anon public** key (很长的字符串)

### 第二步：配置环境变量

1. **编辑 .env.local 文件**
   ```bash
   # 将占位符替换为你的实际值
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **保存文件并重启服务器**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   # 然后重新启动
   npm run dev
   ```

### 第三步：设置数据库

1. **创建 todos 表**
   - 在 Supabase Dashboard 中，点击 "SQL Editor"
   - 运行以下 SQL：

   ```sql
   -- 创建 todos 表
   CREATE TABLE IF NOT EXISTS todos (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

   -- 创建安全策略
   CREATE POLICY "用户可以查看自己的任务" ON todos
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "用户可以添加自己的任务" ON todos
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "用户可以更新自己的任务" ON todos
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "用户可以删除自己的任务" ON todos
     FOR DELETE USING (auth.uid() = user_id);
   ```

2. **设置存储桶（用于图片上传）**
   - 在 Supabase Dashboard 中，点击 "Storage"
   - 点击 "Create bucket"
   - 输入名称：`my-todo`
   - 取消勾选 "Public bucket"
   - 点击 "Create bucket"

3. **配置存储策略**
   - 在 SQL Editor 中运行：

   ```sql
   -- 存储策略
   CREATE POLICY "用户可以查看自己的文件" ON storage.objects
     FOR SELECT USING (
       bucket_id = 'my-todo' AND 
       (storage.foldername(name))[1] = auth.uid()::text
     );

   CREATE POLICY "用户可以上传自己的文件" ON storage.objects
     FOR INSERT WITH CHECK (
       bucket_id = 'my-todo' AND 
       (storage.foldername(name))[1] = auth.uid()::text
     );

   CREATE POLICY "用户可以删除自己的文件" ON storage.objects
     FOR DELETE USING (
       bucket_id = 'my-todo' AND 
       (storage.foldername(name))[1] = auth.uid()::text
     );
   ```

### 第四步：启用实时功能

1. **在 Supabase Dashboard 中**
   - 点击 "Database" → "Replication"
   - 找到 "todos" 表
   - 启用 Realtime (勾选 Insert, Update, Delete)
   - 点击 "Save"

## ✅ 验证配置

配置完成后，你应该能够：

1. **访问应用首页** - 不再看到环境变量错误
2. **注册新用户** - 邮箱和密码注册
3. **登录现有用户** - 使用注册的凭证
4. **创建任务** - 添加、编辑、删除任务
5. **上传图片** - 为任务添加图片附件
6. **实时同步** - 多个标签页之间数据同步

## 🔧 故障排除

### 问题1：环境变量错误
```
Error: Supabase 环境变量未配置
```
**解决方案**：
- 检查 `.env.local` 文件是否存在
- 确认环境变量名称正确
- 重启开发服务器

### 问题2：URL 格式错误
```
Error: NEXT_PUBLIC_SUPABASE_URL 格式不正确
```
**解决方案**：
- 确保 URL 以 `https://` 开头
- 确保 URL 包含 `.supabase.co`
- 从 Supabase Dashboard 重新复制 URL

### 问题3：API 密钥错误
```
Error: NEXT_PUBLIC_SUPABASE_ANON_KEY 格式不正确
```
**解决方案**：
- 确保复制了完整的 anon public key
- 密钥应该很长（100+ 字符）
- 从 Supabase Dashboard 重新复制密钥

### 问题4：数据库连接失败
```
Error: 无法连接到数据库
```
**解决方案**：
- 检查 Supabase 项目是否处于活跃状态
- 确认网络连接正常
- 检查 API 密钥是否有效

## 📞 获取帮助

如果遇到问题：

1. **检查浏览器控制台** - 查看详细错误信息
2. **查看 Supabase Dashboard** - 确认项目状态
3. **重启开发服务器** - `npm run dev`
4. **清除浏览器缓存** - 刷新页面

配置成功后，你就可以享受完整的 Todo 应用功能了！🎉