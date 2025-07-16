'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  Plus, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Calendar,
  Clock,
  Star,
  Filter,
  Search,
  MoreHorizontal,
  AlertCircle,
  Image as ImageIcon,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { addTodo, deleteTodo, getTodos, updateTodo } from '@/lib/supabase/todos'
import { createRealtimeSubscription, createRealtimeHandler, removeRealtimeSubscription } from '@/lib/supabase/realtime'
import { Button } from './ui/button'
import { Input } from './ui/input'
import TodoDetail from './todo-detail'
import { useRouter } from 'next/navigation'
import { RealtimeChannel } from '@supabase/supabase-js'

interface Todo {
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

export default function TodoClient() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputText, setInputText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [loading, setLoading] = useState(false) // 改为默认false，避免不必要的加载状态
  const [initialLoading, setInitialLoading] = useState(true) // 初始加载状态
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [addingTodo, setAddingTodo] = useState(false) // 添加任务的加载状态
  const [isConnected, setIsConnected] = useState(true) // 实时连接状态
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null) // 最后同步时间
  const router = useRouter()
  const channelRef = useRef<RealtimeChannel | null>(null) // 使用ref存储channel引用
  const todosContainerRef = useRef<HTMLDivElement>(null) // 任务列表容器引用
  const initialLoadAttempted = useRef(false) // 跟踪是否已尝试初始加载

  const supabase = createClient()

  // 避免水合作用不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && theme === 'dark'

  // 检查用户是否已登录
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
        } else {
          console.log('用户未登录，重定向到登录页面')
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        setError('获取用户信息失败，请重新登录')
      }
    }

    checkUser()
  }, [supabase, router])

  // 获取任务列表的函数，添加重试机制
  const fetchTodos = useCallback(async (showLoading = true) => {
    if (!user) return // 如果用户未登录，不获取任务

    if (showLoading && !initialLoading) {
      setLoading(true)
    }
    setError(null)
    
    try {
      const data = await getTodos()
      if (data) {
        setTodos(data)
        setLastSyncTime(new Date())
        setIsConnected(true)
        initialLoadAttempted.current = true // 标记已尝试初始加载
      }
    } catch (error: any) {
      console.error('获取任务失败:', error)
      setError(error.message || '获取任务失败，请刷新页面重试')
      setIsConnected(false)
      
      // 添加重试逻辑
      if (!initialLoadAttempted.current) {
        console.log('初始加载失败，2秒后重试...')
        setTimeout(() => fetchTodos(showLoading), 2000)
      }
    } finally {
      if (showLoading) {
        setLoading(false)
      }
      setInitialLoading(false)
    }
  }, [user])

  // 手动刷新数据
  const handleRefresh = () => {
    fetchTodos(true)
  }

  // 设置实时订阅 - 使用防抖确保不会频繁重连
  useEffect(() => {
    if (!user) return
    
    let timeoutId: NodeJS.Timeout | null = null;
    
    // 初始加载任务
    if (!initialLoadAttempted.current) {
      fetchTodos()
    }

    // 创建实时数据处理函数
    const handleRealtimeUpdate = createRealtimeHandler<Todo>(setTodos)

    // 创建实时订阅
    const setupRealtimeSubscription = () => {
      if (channelRef.current) {
        // 如果已存在订阅，先移除
        removeRealtimeSubscription(channelRef.current)
      }
      
      const channel = createRealtimeSubscription(
        'todos',
        user.id,
        (payload) => {
          handleRealtimeUpdate(payload)
          // 更新最后同步时间
          setLastSyncTime(new Date())
          // 更新连接状态
          setIsConnected(true)
          
          // 清除任何待处理的重连
          if (timeoutId) {
            clearTimeout(timeoutId)
            timeoutId = null
          }
        }
      )
      
      // 保存channel引用
      channelRef.current = channel
    }
    
    setupRealtimeSubscription()

    // 添加连接状态检查
    const connectionCheckInterval = setInterval(() => {
      // 如果超过1分钟没有收到更新，尝试重新获取数据
      const now = new Date()
      if (lastSyncTime && (now.getTime() - lastSyncTime.getTime() > 60000)) {
        console.log('长时间未收到更新，静默刷新数据...')
        fetchTodos(false) // 静默刷新，不显示加载状态
        
        // 如果超过2分钟没有更新，尝试重新连接
        if (now.getTime() - lastSyncTime.getTime() > 120000 && !timeoutId) {
          console.log('尝试重新建立实时连接...')
          timeoutId = setTimeout(() => {
            setupRealtimeSubscription()
            timeoutId = null
          }, 1000) // 防抖，避免频繁重连
        }
      }
    }, 30000) // 每30秒检查一次

    // 清理函数
    return () => {
      console.log('取消实时订阅')
      if (channelRef.current) {
        removeRealtimeSubscription(channelRef.current)
        channelRef.current = null
      }
      clearInterval(connectionCheckInterval)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [supabase, user, fetchTodos, lastSyncTime])

  // 添加任务
  const handleAddTodo = async () => {
    if (!user) {
      setError('请先登录')
      router.push('/auth/login')
      return
    }

    if (!inputText.trim()) {
      setError('任务内容不能为空')
      return
    }

    // 设置添加按钮的加载状态，而不是整个列表
    setAddingTodo(true);
    setError(null)
    try {
      const result = await addTodo({
        text: inputText.trim(),
        priority
      })
      
      if (result) {
        setInputText('')
        // 添加成功提示
        const successMessage = '任务添加成功！';
        console.log(successMessage);
        
        // 立即更新本地状态，不等待实时订阅
        setTodos(prevTodos => {
          const exists = prevTodos.some(todo => todo.id === result.id)
          if (exists) return prevTodos
          return [result, ...prevTodos]
        })
        
        // 可以添加一个临时的成功提示
        const tempError = error;
        setError(successMessage);
        setTimeout(() => {
          // 如果错误状态没有被其他操作改变，则清除它
          if (error === successMessage) {
            setError(null);
          }
        }, 3000);
      } else {
        setError('添加任务失败，请重试')
      }
    } catch (error: any) {
      console.error('添加任务失败:', error)
      setError(error.message || '添加任务失败，请重试')
    } finally {
      setAddingTodo(false);
    }
  }

  // 添加连接状态指示器
  const renderConnectionStatus = () => {
    if (!user || initialLoading) return null
    
    return (
      <div className="flex items-center text-sm mb-2">
        <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-muted-foreground">
          {isConnected ? '实时同步已连接' : '实时同步已断开'}
        </span>
        {lastSyncTime && (
          <span className="text-muted-foreground ml-2">
            最后同步: {lastSyncTime.toLocaleTimeString()}
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-2 h-6 w-6" 
          onClick={handleRefresh}
          title="手动刷新"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // 渲染加载状态
  const renderLoadingState = () => {
    if (initialLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">正在加载您的任务...</p>
        </div>
      )
    }
    return null
  }

  // 渲染空状态
  const renderEmptyState = () => {
    if (!initialLoading && todos.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center min-h-[400px]">
          <div className="bg-muted/50 p-6 rounded-full mb-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">暂无任务</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            您还没有添加任何任务。使用上方的输入框添加您的第一个任务吧！
          </p>
        </div>
      )
    }
    return null
  }

  // 过滤任务列表
  const filteredTodos = todos.filter(todo => {
    // 根据过滤条件筛选
    if (filter === 'active' && todo.completed) return false
    if (filter === 'completed' && !todo.completed) return false
    
    // 根据搜索条件筛选
    if (searchTerm && !todo.text.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    
    return true
  })

  // 在渲染函数中添加连接状态指示器
  return (
    <div className="w-full p-4 max-w-4xl mx-auto">
      {/* 连接状态指示器 */}
      {renderConnectionStatus()}
      
      {/* 添加任务输入框 */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="添加一个新任务..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          className="flex-1 h-12 text-base"
          disabled={initialLoading}
        />
        <div className="relative min-w-32">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="h-12 w-full pl-4 pr-8 border rounded-md bg-background"
            disabled={initialLoading}
          >
            <option value="low">低优先级</option>
            <option value="medium">中优先级</option>
            <option value="high">高优先级</option>
          </select>
        </div>
        <Button 
          onClick={handleAddTodo} 
          className="h-12 w-12"
          disabled={addingTodo || !inputText.trim() || initialLoading}
        >
          {addingTodo ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* 搜索和过滤 */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索任务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={initialLoading}
          />
        </div>
        <div className="flex">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="flex-1 sm:flex-none"
            disabled={initialLoading}
          >
            全部
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
            className="flex-1 sm:flex-none"
            disabled={initialLoading}
          >
            进行中
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className="flex-1 sm:flex-none"
            disabled={initialLoading}
          >
            已完成
          </Button>
        </div>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className={`p-3 mb-4 rounded-md ${error.includes('成功') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}
      
      {/* 加载状态 */}
      {renderLoadingState()}
      
      {/* 空状态 */}
      {renderEmptyState()}
      
      {/* 任务列表 - 使用固定高度容器防止抖动 */}
      {!initialLoading && todos.length > 0 && (
        <div 
          ref={todosContainerRef}
          className="space-y-2"
          style={{ 
            minHeight: '400px',
            position: 'relative'
          }}
        >
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-background/80">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div 
                key={todo.id}
                className={`flex items-center gap-2 p-3 rounded-md border ${todo.completed ? 'bg-muted/30' : 'bg-card'}`}
              >
                {/* 任务内容 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full border ${todo.completed ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                  onClick={() => handleToggleTodo(todo.id, todo.completed)}
                >
                  {todo.completed && <Check className="h-4 w-4" />}
                </Button>
                
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => openTodoDetail(todo)}
                >
                  <div className="flex items-center">
                    <span className={`text-base ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {todo.text}
                    </span>
                    {todo.image_url && (
                      <div className="ml-2">
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <div className={`w-2 h-2 rounded-full mr-1 ${getPriorityColor(todo.priority)}`}></div>
                    <span className="capitalize">{todo.priority} 优先级</span>
                    <Clock className="h-3 w-3 ml-2 mr-1" />
                    <span>{new Date(todo.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(todo.id, todo.text)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openTodoDetail(todo)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* 编辑模式 */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">编辑任务</h3>
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                取消
              </Button>
              <Button onClick={handleSaveEdit}>
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* 任务详情对话框 */}
      <TodoDetail
        todo={selectedTodo}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onSave={handleSaveTodoDetail}
      />
      
      {/* 任务统计 */}
      {!initialLoading && (
        <div className="flex justify-around mt-8 p-4 bg-card rounded-lg shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{todos.filter(t => !t.completed).length}</div>
            <div className="text-sm text-muted-foreground">待完成</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{todos.filter(t => t.completed).length}</div>
            <div className="text-sm text-muted-foreground">已完成</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{todos.length}</div>
            <div className="text-sm text-muted-foreground">总计</div>
          </div>
        </div>
      )}
    </div>
  )

  // 以下是组件中的其他方法
  async function handleToggleTodo(id: string, completed: boolean) {
    if (!user) {
      setError('请先登录')
      router.push('/auth/login')
      return
    }

    setError(null)
    try {
      const updatedTodo = await updateTodo(id, { completed: !completed })
      
      // 立即更新本地状态，不等待实时订阅
      if (updatedTodo) {
        setTodos(prevTodos => 
          prevTodos.map(todo => 
            todo.id === id ? updatedTodo : todo
          )
        );
      }
    } catch (error: any) {
      console.error('更新任务状态失败:', error)
      setError(error.message || '更新任务状态失败，请重试')
    }
  }

  function startEdit(id: string, text: string) {
    if (!user) {
      setError('请先登录')
      router.push('/auth/login')
      return
    }

    setEditingId(id)
    setEditText(text)
  }

  async function handleSaveEdit() {
    if (!user) {
      setError('请先登录')
      router.push('/auth/login')
      return
    }

    if (!editText.trim()) {
      setError('任务内容不能为空')
      return
    }

    if (editText.trim() && editingId) {
      setError(null)
      try {
        const updatedTodo = await updateTodo(editingId, { text: editText.trim() })
        
        // 立即更新本地状态，不等待实时订阅
        if (updatedTodo) {
          setTodos(prevTodos => 
            prevTodos.map(todo => 
              todo.id === editingId ? updatedTodo : todo
            )
          );
        }
        
        setEditingId(null)
        setEditText('')
      } catch (error: any) {
        console.error('更新任务失败:', error)
        setError(error.message || '更新任务失败，请重试')
      }
    }
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  async function handleDeleteTodo(id: string) {
    if (!user) {
      setError('请先登录')
      router.push('/auth/login')
      return
    }

    if (!confirm('确定要删除此任务吗？')) {
      return
    }

    setError(null)
    try {
      const success = await deleteTodo(id)
      
      // 立即更新本地状态，不等待实时订阅
      if (success) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      }
    } catch (error: any) {
      console.error('删除任务失败:', error)
      setError(error.message || '删除任务失败，请重试')
    }
  }

  function openTodoDetail(todo: Todo) {
    if (!user) {
      setError('请先登录')
      router.push('/auth/login')
      return
    }

    setSelectedTodo(todo)
    setDetailOpen(true)
  }

  async function handleSaveTodoDetail(updatedTodoData: any): Promise<void> {
    if (!user || !selectedTodo) {
      setError('请先登录')
      router.push('/auth/login')
      return
    }
    
    setError(null)
    try {
      console.log('保存任务详情，接收到的数据:', updatedTodoData)
      
      // 特别检查图片URL的更改
      if (selectedTodo.image_url !== updatedTodoData.image_url) {
        console.log('图片URL已更改:', {
          old: selectedTodo.image_url,
          new: updatedTodoData.image_url
        })
      }
      
      const updatedTodo = await updateTodo(selectedTodo.id, updatedTodoData)
      console.log('任务已更新，服务器返回:', updatedTodo)
      
      // 立即更新本地状态，不等待实时订阅
      if (updatedTodo) {
        setTodos(prevTodos => 
          prevTodos.map(todo => 
            todo.id === selectedTodo.id ? updatedTodo : todo
          )
        );
        console.log('本地任务列表已更新')
      }
      
      setDetailOpen(false)
    } catch (error: any) {
      console.error('更新任务详情失败:', error)
      setError(error.message || '更新任务详情失败，请重试')
      throw error; // 重新抛出错误，以便TodoDetail组件可以处理
    }
  }

  function getPriorityColor(priority: string) {
    return priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
  }
} 