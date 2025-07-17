import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // 检查环境变量
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase 环境变量缺失');
    console.error('请确保在 .env.local 文件中设置了以下环境变量:');
    console.error('- NEXT_PUBLIC_SUPABASE_URL');
    console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    throw new Error('Supabase 环境变量未配置。请检查 .env.local 文件并重启开发服务器。');
  }

  // 使用单例模式，避免重复创建客户端
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
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
          },
        },
        // 优化实时连接
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      }
    );
  }
  
  return supabaseClient;
}

// 预热连接函数
export function warmupConnection() {
  if (typeof window !== 'undefined') {
    try {
      const client = createClient();
      // 预热认证状态检查
      client.auth.getSession().catch(() => {
        // 忽略错误，这只是预热
      });
    } catch (error) {
      console.warn('预热连接失败:', error);
    }
  }
}