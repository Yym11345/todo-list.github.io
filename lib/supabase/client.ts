import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig, hasRequiredEnvVars, validateEnvVars } from './config';

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // 检查环境变量
  if (!hasRequiredEnvVars) {
    console.error('❌ Supabase 环境变量缺失');
    console.error('请确保在 .env.local 文件中设置了以下环境变量:');
    console.error('- NEXT_PUBLIC_SUPABASE_URL');
    console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.error('');
    console.error('获取这些值的步骤:');
    console.error('1. 访问 https://supabase.com/dashboard');
    console.error('2. 选择你的项目');
    console.error('3. 进入 Settings > API');
    console.error('4. 复制 Project URL 和 anon public key');
    throw new Error('Supabase 环境变量未配置。请检查 .env.local 文件并重启开发服务器。');
  }

  // 验证环境变量格式
  try {
    validateEnvVars();
  } catch (error) {
    console.error('❌ Supabase 环境变量格式错误:', error);
    throw error;
  }

  // 使用单例模式，避免重复创建客户端
  if (!supabaseClient) {
    try {
      supabaseClient = createBrowserClient(
        supabaseConfig.url,
        supabaseConfig.anonKey,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce',
            // 优化认证性能
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
          },
          global: {
            headers: {
              'x-client-info': 'supabase-js-web',
              'x-application-name': 'super-todo-app',
            },
          },
          // 优化实时连接
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
          // 数据库连接优化
          db: {
            schema: 'public',
          },
        }
      );
      
      console.log('✅ Supabase 客户端创建成功');
      console.log('🔗 项目 URL:', supabaseConfig.url);
      
    } catch (error) {
      console.error('❌ Supabase 客户端创建失败:', error);
      throw new Error('无法创建 Supabase 客户端，请检查配置');
    }
  }
  
  return supabaseClient;
}

// 预热连接函数
export function warmupConnection() {
  if (typeof window !== 'undefined' && hasRequiredEnvVars) {
    try {
      const client = createClient();
      // 预热认证状态检查
      client.auth.getSession().then(() => {
        console.log('🔥 Supabase 连接预热完成');
      }).catch((error) => {
        console.warn('⚠️ 预热连接时出现警告:', error.message);
      });
    } catch (error) {
      console.warn('⚠️ 预热连接失败:', error);
    }
  }
}

// 测试连接函数
export async function testConnection() {
  try {
    const client = createClient();
    const { data, error } = await client.auth.getSession();
    
    if (error) {
      console.error('❌ 连接测试失败:', error);
      return false;
    }
    
    console.log('✅ Supabase 连接测试成功');
    return true;
  } catch (error) {
    console.error('❌ 连接测试异常:', error);
    return false;
  }
}

// 获取连接状态
export function getConnectionStatus() {
  return {
    hasEnvVars: hasRequiredEnvVars,
    clientCreated: supabaseClient !== null,
    url: hasRequiredEnvVars ? supabaseConfig.url : null,
  };
}