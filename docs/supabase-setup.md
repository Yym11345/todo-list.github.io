# Supabase 数据库设置详细指南

## 第一步：访问 Supabase SQL 编辑器

1. 登录您的 Supabase 项目仪表板
2. 在左侧导航菜单中找到并点击 **"SQL Editor"**
3. 您会看到一个 SQL 查询编辑界面

## 第二步：执行第一个迁移文件（创建数据库结构）

### 2.1 创建新查询
- 点击 **"New query"** 按钮
- 会打开一个新的 SQL 编辑器标签页

### 2.2 复制第一个迁移文件内容
1. 在项目中打开文件：`supabase/migrations/20250709073247_broad_coast.sql`
2. 选择并复制整个文件的内容（从第一行到最后一行）
3. 将内容粘贴到 Supabase SQL 编辑器中

### 2.3 执行查询
- 点击右下角的 **"Run"** 按钮（或使用快捷键 Ctrl+Enter）
- 等待执行完成，您应该看到成功消息

### 2.4 验证表创建
执行完成后，您可以：
- 点击左侧的 **"Table Editor"** 查看创建的表
- 应该能看到三个新表：`genes`、`user_profiles`、`search_history`

## 第三步：执行第二个迁移文件（插入示例数据）

### 3.1 创建另一个新查询
- 再次点击 **"New query"** 按钮
- 这会打开另一个新的 SQL 编辑器标签页

### 3.2 复制第二个迁移文件内容
1. 在项目中打开文件：`supabase/migrations/20250709073307_quiet_hat.sql`
2. 选择并复制整个文件的内容
3. 将内容粘贴到新的 SQL 编辑器中

### 3.3 执行查询
- 点击 **"Run"** 按钮执行查询
- 等待执行完成

### 3.4 验证数据插入
执行完成后：
- 点击左侧的 **"Table Editor"**
- 点击 `genes` 表
- 您应该能看到插入的示例基因数据

## 第四步：验证设置

### 4.1 检查表结构
在 Table Editor 中，确认以下表已创建：

**genes 表**：
- id (uuid, 主键)
- name (text)
- organism (text)
- enzyme_type (text)
- function (text)
- sequence (text)
- length (integer)
- domain (text)
- accession (text)
- completeness (text)
- created_at (timestamptz)
- updated_at (timestamptz)

**user_profiles 表**：
- id (uuid, 主键)
- user_id (uuid, 外键)
- full_name (text)
- organization (text)
- research_field (text)
- created_at (timestamptz)
- updated_at (timestamptz)

**search_history 表**：
- id (uuid, 主键)
- user_id (uuid, 外键)
- query (text)
- filters (jsonb)
- results_count (integer)
- created_at (timestamptz)

### 4.2 检查示例数据
在 genes 表中应该能看到：
- 果胶甲酯酶1
- 多聚半乳糖醛酸酶
- 丝氨酸蛋白酶1
- 半胱氨酸蛋白酶
- 脂肪酶α/β
- 磷脂酶A2
- α-淀粉酶
- β-淀粉酶
- 内切纤维素酶
- 外切纤维素酶
- 木质素过氧化物酶
- 锰过氧化物酶

### 4.3 检查安全策略
1. 点击左侧的 **"Authentication"**
2. 点击 **"Policies"**
3. 确认为每个表都创建了适当的 RLS 策略

## 常见问题解决

### 问题1：执行失败
如果执行失败，可能的原因：
- 网络连接问题：重试执行
- 语法错误：检查复制的内容是否完整
- 权限问题：确认您有项目管理员权限

### 问题2：表已存在错误
如果看到 "table already exists" 错误：
- 这是正常的，说明表已经创建过了
- 可以忽略这个错误，或者先删除现有表再重新创建

### 问题3：数据插入失败
如果第二个文件执行失败：
- 确认第一个文件已经成功执行
- 检查是否有重复的 accession 值

## 执行后的效果

完成这两个步骤后，您的 Supabase 数据库将：

1. **拥有完整的表结构**：支持基因数据存储、用户管理和搜索历史
2. **包含示例数据**：12条不同类型的酶基因数据
3. **启用安全策略**：保护用户数据，允许公开访问基因数据
4. **优化查询性能**：通过索引提高搜索速度

## 下一步

数据库设置完成后：
1. 确保 `.env` 文件配置正确
2. 重启开发服务器：`npm run dev`
3. 测试用户注册和登录功能
4. 尝试搜索基因数据

如果遇到任何问题，请检查：
- Supabase 项目状态
- 环境变量配置
- 网络连接
- 浏览器控制台错误信息