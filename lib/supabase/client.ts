import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // 使用单例模式，避免重复创建客户端
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
    const client = createClient();
    // 预热认证状态检查
    client.auth.getSession().catch(() => {
      // 忽略错误，这只是预热
    });
  }
}