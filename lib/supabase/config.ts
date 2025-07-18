// Supabase 配置文件
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}

// 检查必需的环境变量
export const hasRequiredEnvVars = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// 验证环境变量格式
export const validateEnvVars = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('缺少必需的 Supabase 环境变量')
  }

  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL 格式不正确')
  }

  if (key.length < 100) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY 格式不正确')
  }

  return true
}