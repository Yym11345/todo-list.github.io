<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

# 超级Todo 应用

这是一个基于Next.js和Supabase构建的Todo应用，具有用户认证、实时数据同步和任务管理功能。

## 功能特点

- 用户认证（注册、登录、密码重置）
- 任务管理（添加、编辑、删除、标记完成）
- 任务优先级设置（低、中、高）
- 任务截止日期设置
- 任务备注功能
- 图片附件上传功能
- 实时数据同步
- 任务过滤和搜索
- 响应式设计，支持移动设备和桌面设备
- 深色/浅色主题切换
- 行级安全策略，确保用户只能访问自己的数据

## 技术栈

- [Next.js 14](https://nextjs.org/) - React框架
- [Supabase](https://supabase.com/) - 开源Firebase替代品
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [shadcn/ui](https://ui.shadcn.com/) - UI组件库
- [Lucide React](https://lucide.dev/) - 图标库
- [date-fns](https://date-fns.org/) - 日期处理库

## 快速开始

### 前提条件

- Node.js 18.x 或更高版本
- npm 或 yarn
- Supabase 账户

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/super-todo-app.git
cd super-todo-app
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 设置环境变量

创建一个 `.env.local` 文件，并填入你的 Supabase 项目凭证：

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

你可以从 Supabase 项目的设置 > API 页面获取这些值。

4. 设置 Supabase 数据库

在 Supabase 控制台中，进入 SQL 编辑器，然后运行 `setup-database.sql` 中的 SQL 语句来创建必要的表和安全策略。

具体步骤：
   - 登录 Supabase 控制台 (https://supabase.com/dashboard)
   - 选择你的项目
   - 点击左侧菜单的 "SQL 编辑器"
   - 复制 `setup-database.sql` 中的内容
   - 粘贴到 SQL 编辑器中并运行

5. 启用 Supabase Realtime 功能

在 Supabase 控制台中启用实时功能：

具体步骤：
   - 登录 Supabase 控制台
   - 选择你的项目
   - 点击左侧菜单的 "Database"
   - 点击 "Replication"
   - 在 "Realtime" 部分，点击 "Enable Realtime"
   - 在表格列表中找到 "todos" 表，并确保它已启用 (Inserts, Updates, Deletes 都应勾选)
   - 点击 "Save" 按钮保存设置

6. 设置 Supabase 存储

在 Supabase 控制台中，设置存储桶和权限策略：

具体步骤：
   - 登录 Supabase 控制台
   - 选择你的项目
   - 点击左侧菜单的 "Storage"
   - 点击 "Create bucket" 按钮
   - 输入存储桶名称：`my-todo`
   - 取消勾选 "Public bucket" 选项（保持私有）
   - 点击 "Create bucket" 按钮创建存储桶
   - 点击左侧菜单的 "SQL 编辑器"
   - 复制 `lib/supabase/storage-policy.sql` 中的内容
   - 粘贴到 SQL 编辑器中并运行
   - 确认存储桶权限策略已应用

7. 设置 Supabase 认证

在 Supabase 控制台中，进入 Authentication > Providers，确保启用了电子邮件认证。

8. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 运行。

## 使用指南

### 用户认证

1. 注册新账户：点击首页上的"注册"按钮，填写电子邮件和密码。
2. 登录：使用已注册的电子邮件和密码登录。
3. 重置密码：如果忘记密码，可以在登录页面点击"忘记密码"。

### 任务管理

1. 添加任务：在输入框中输入任务内容，选择优先级，然后点击"+"按钮。
2. 编辑任务：点击任务右侧的编辑图标。
3. 删除任务：点击任务右侧的删除图标。
4. 标记完成：点击任务左侧的圆形按钮。
5. 查看任务详情：点击任务或任务右侧的"更多"图标。
6. 添加图片附件：在任务详情页面，点击"点击上传图片"按钮，选择一张图片（最大2MB）作为附件。
7. 删除图片附件：在任务详情页面，点击图片上方的"删除图片"按钮。

### 任务过滤和搜索

1. 过滤任务：使用"全部"、"进行中"、"已完成"按钮过滤任务。
2. 搜索任务：在搜索框中输入关键词。

## 数据库结构

### todos 表

| 列名 | 类型 | 描述 |
|------|------|------|
| id | UUID | 主键，自动生成 |
| user_id | UUID | 外键，关联到auth.users表 |
| text | TEXT | 任务内容 |
| completed | BOOLEAN | 任务完成状态 |
| priority | TEXT | 任务优先级（low, medium, high） |
| created_at | TIMESTAMPTZ | 创建时间 |
| due_date | TIMESTAMPTZ | 截止日期（可选） |
| notes | TEXT | 任务备注（可选） |
| image_url | TEXT | 图片附件URL（可选） |

## 安全性

应用使用 Supabase 的行级安全策略（RLS）确保用户只能访问自己的数据：

- 用户只能查看自己的任务
- 用户只能添加自己的任务
- 用户只能更新自己的任务
- 用户只能删除自己的任务

## 实时数据同步

应用使用 Supabase 的实时订阅功能，确保多设备间的数据同步：

```javascript
// 设置实时订阅
const channel = supabase
  .channel('todos_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'todos',
      filter: `user_id=eq.${user.id}`
    },
    (payload) => {
      console.log('数据库变更:', payload)
      fetchTodos() // 重新获取任务列表
    }
  )
  .subscribe()
```

## 数据库迁移

如果您遇到"Could not find the 'image_url' column of 'todos' in the schema cache"错误，请按照以下步骤执行数据库迁移：

1. 登录到您的Supabase控制台 (https://supabase.com/dashboard)
2. 选择您的项目
3. 点击左侧菜单的"SQL编辑器"
4. 复制并执行以下SQL语句：

```sql
-- 添加image_url列到todos表
ALTER TABLE IF EXISTS todos
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 刷新Supabase的schema缓存
SELECT pg_notify('supabase_db_changes', 'reload_schema');
```

5. 执行完成后，刷新您的应用页面
6. 如果问题仍然存在，请尝试清除浏览器缓存或重新启动应用

## 常见问题解决

### 任务无法添加

如果遇到任务无法添加的问题，请检查：

1. 确保你已登录 - 只有登录用户才能添加任务
2. 检查浏览器控制台是否有错误信息
3. 确认 `.env.local` 文件中的 Supabase URL 和密钥是否正确
4. 确认数据库表和策略已正确设置
5. 检查行级安全策略是否正确配置
6. 确保任务内容不为空

### 认证问题

如果遇到认证问题：

1. 确保 Supabase 项目中已启用电子邮件认证
2. 检查 URL 重定向是否正确配置
3. 清除浏览器缓存和 Cookie 后重试
4. 确认 Supabase 项目的 API 密钥是否正确

### 实时数据同步问题

如果实时数据同步不工作：

1. 检查控制台是否有订阅错误
2. 确认 Supabase 项目中已启用实时功能
3. 检查网络连接是否正常
4. 尝试刷新页面或重新登录

### 图片上传问题

如果遇到图片上传问题：

1. 确保已在Supabase控制台中创建名为`my-todo`的存储桶
2. 确保已运行`storage-policy.sql`中的SQL语句设置权限策略
3. 检查浏览器控制台是否有错误信息
4. 确认上传的图片小于2MB且为常见图片格式（JPG、PNG等）
5. 确保用户已登录，只有登录用户才能上传图片
6. 检查网络连接是否正常

## 部署

应用可以部署到 Vercel、Netlify 或其他支持 Next.js 的平台。

### Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/super-todo-app)

部署时，确保设置环境变量：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 贡献

欢迎提交问题和拉取请求。

## 许可证

MIT
