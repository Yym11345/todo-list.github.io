import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AuthenticatedTodoApp from '@/components/authenticated-todo-app'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth/login')
  }

  return (
    <AuthenticatedTodoApp user={user} />
  )
}
