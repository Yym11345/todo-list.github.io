import { createClient } from './client'
import { broadcastChange } from './realtime'

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  created_at: string
  due_date: string | null
  user_id: string
  notes?: string
  image_url?: string
}

// 获取所有任务
export async function getTodos(): Promise<Todo[]> {
  const supabase = createClient()
  
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('获取用户信息失败:', userError)
      throw new Error('获取用户信息失败')
    }
    
    if (!user) {
      console.error('用户未登录')
      throw new Error('用户未登录')
    }
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取任务失败:', error)
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('获取任务过程中发生错误:', error)
    throw error
  }
}

// 添加新任务
export async function addTodo(todoData: {
  text: string
  priority?: 'low' | 'medium' | 'high'
  due_date?: string | null
  notes?: string
  image_url?: string
}): Promise<Todo | null> {
  const supabase = createClient()
  
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('获取用户信息失败:', userError)
      throw new Error('获取用户信息失败')
    }
    
    if (!user) {
      console.error('用户未登录')
      throw new Error('用户未登录，无法添加任务')
    }
    
    const { data, error } = await supabase
      .from('todos')
      .insert({
        text: todoData.text,
        priority: todoData.priority || 'medium',
        due_date: todoData.due_date || null,
        notes: todoData.notes,
        image_url: todoData.image_url,
        user_id: user.id
      })
      .select()
      .single()
    
    if (error) {
      console.error('添加任务失败:', error)
      throw error
    }
    
    // 手动广播变更，提高实时性
    if (data) {
      try {
        await broadcastChange('todos', 'INSERT', data)
      } catch (broadcastError) {
        console.error('广播任务添加事件失败:', broadcastError)
        // 广播失败不影响主流程
      }
    }
    
    return data
  } catch (error) {
    console.error('添加任务过程中发生错误:', error)
    throw error
  }
}

// 更新任务
export async function updateTodo(
  id: string,
  updates: Partial<Omit<Todo, 'id' | 'created_at' | 'user_id'>>
): Promise<Todo | null> {
  const supabase = createClient()
  
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('获取用户信息失败:', userError)
      throw new Error('获取用户信息失败')
    }
    
    if (!user) {
      console.error('用户未登录')
      throw new Error('用户未登录，无法更新任务')
    }
    
    // 首先检查任务是否属于当前用户
    const { data: todoData, error: todoError } = await supabase
      .from('todos')
      .select('user_id')
      .eq('id', id)
      .single()
      
    if (todoError) {
      console.error('获取任务信息失败:', todoError)
      throw todoError
    }
    
    if (!todoData || todoData.user_id !== user.id) {
      throw new Error('无权更新此任务')
    }
    
    // 处理特殊情况：如果image_url是undefined，将其转换为null以清除数据库中的值
    const processedUpdates: any = { ...updates }
    if ('image_url' in updates && updates.image_url === undefined) {
      processedUpdates.image_url = null
      console.log('将undefined的image_url转换为null以清除数据库中的值')
    }
    
    console.log('准备更新任务:', id, '更新内容:', processedUpdates)
    
    const { data, error } = await supabase
      .from('todos')
      .update(processedUpdates)
      .eq('id', id)
      .eq('user_id', user.id) // 确保只更新用户自己的任务
      .select()
      .single()
    
    if (error) {
      console.error('更新任务失败:', error)
      throw error
    }
    
    console.log('任务更新成功:', data)
    
    // 手动广播变更，提高实时性
    if (data) {
      try {
        await broadcastChange('todos', 'UPDATE', data)
      } catch (broadcastError) {
        console.error('广播任务更新事件失败:', broadcastError)
        // 广播失败不影响主流程
      }
    }
    
    return data
  } catch (error) {
    console.error('更新任务过程中发生错误:', error)
    throw error
  }
}

// 删除任务
export async function deleteTodo(id: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('获取用户信息失败:', userError)
      throw new Error('获取用户信息失败')
    }
    
    if (!user) {
      console.error('用户未登录')
      throw new Error('用户未登录，无法删除任务')
    }
    
    // 首先获取要删除的任务信息，用于后续广播
    const { data: todoData, error: todoError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
      
    if (todoError) {
      console.error('获取任务信息失败:', todoError)
      throw todoError
    }
    
    if (!todoData || todoData.user_id !== user.id) {
      throw new Error('无权删除此任务')
    }
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // 确保只删除用户自己的任务
    
    if (error) {
      console.error('删除任务失败:', error)
      throw error
    }
    
    // 手动广播变更，提高实时性
    try {
      await broadcastChange('todos', 'DELETE', { id, user_id: user.id })
    } catch (broadcastError) {
      console.error('广播任务删除事件失败:', broadcastError)
      // 广播失败不影响主流程
    }
    
    return true
  } catch (error) {
    console.error('删除任务过程中发生错误:', error)
    throw error
  }
}

// 获取单个任务
export async function getTodoById(id: string): Promise<Todo | null> {
  const supabase = createClient()
  
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('获取用户信息失败:', userError)
      throw new Error('获取用户信息失败')
    }
    
    if (!user) {
      console.error('用户未登录')
      throw new Error('用户未登录，无法获取任务详情')
    }
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id) // 确保只获取用户自己的任务
      .single()
    
    if (error) {
      console.error('获取任务详情失败:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('获取任务详情过程中发生错误:', error)
    throw error
  }
} 