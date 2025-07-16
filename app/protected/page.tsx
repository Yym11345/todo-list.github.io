import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TodoClient from '@/components/todo-client'
import { initStorage } from '@/lib/supabase/storage'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth/login')
  }

  // 初始化存储桶
  try {
    await initStorage()
  } catch (error) {
    console.error('初始化存储桶失败:', error)
    // 继续加载页面，不阻止用户使用
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl animate-in">
        <TodoClient />
      </div>
    </div>
  )
}
