import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TodoClient from '@/components/todo-client'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth/login')
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl animate-in">
        <TodoClient />
      </div>
    </div>
  )
}
