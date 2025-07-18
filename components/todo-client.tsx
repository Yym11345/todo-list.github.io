'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Calendar,
  Clock,
  Search,
  Sparkles,
  MoreHorizontal
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { getTodos, addTodo, updateTodo, deleteTodo, type Todo } from '@/lib/supabase/todos'
import { createRealtimeSubscription, removeRealtimeSubscription, createRealtimeHandler } from '@/lib/supabase/realtime'
import { initStorage } from '@/lib/supabase/storage'
import TodoDetail from './todo-detail'

export default function TodoClient({ user }: { user: any }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputText, setInputText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  // 避免水合作用不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && theme === 'dark'

  // 初始化数据和实时订阅
  useEffect(() => {
    if (!user?.id) return

    let realtimeChannel: any = null

    const initializeApp = async () => {
      try {
        setLoading(true)
        setError(null)

        // 初始化存储
        await initStorage()

        // 加载任务数据
        const todosData = await getTodos()
        setTodos(todosData)

        // 设置实时订阅
        const realtimeHandler = createRealtimeHandler<Todo>(setTodos)
        realtimeChannel = createRealtimeSubscription('todos', user.id, realtimeHandler)

        console.log('✅ 应用初始化成功')
      } catch (err: any) {
        console.error('❌ 应用初始化失败:', err)
        setError(err.message || '加载数据失败，请刷新页面重试')
      } finally {
        setLoading(false)
      }
    }

    initializeApp()

    // 清理函数
    return () => {
      if (realtimeChannel) {
        removeRealtimeSubscription(realtimeChannel)
      }
    }
  }, [user?.id])

  const handleAddTodo = async () => {
    if (!inputText.trim()) return

    try {
      await addTodo({
        text: inputText.trim(),
        priority,
      })
      setInputText('')
      console.log('✅ 任务添加成功')
    } catch (err: any) {
      console.error('❌ 添加任务失败:', err)
      setError(err.message || '添加任务失败，请重试')
    }
  }

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      await updateTodo(id, { completed: !todo.completed })
      console.log('✅ 任务状态更新成功')
    } catch (err: any) {
      console.error('❌ 更新任务状态失败:', err)
      setError(err.message || '更新任务失败，请重试')
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id)
      console.log('✅ 任务删除成功')
    } catch (err: any) {
      console.error('❌ 删除任务失败:', err)
      setError(err.message || '删除任务失败，请重试')
    }
  }

  const startEdit = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = async () => {
    if (!editText.trim() || !editingId) return

    try {
      await updateTodo(editingId, { text: editText.trim() })
      setEditingId(null)
      setEditText('')
      console.log('✅ 任务编辑成功')
    } catch (err: any) {
      console.error('❌ 编辑任务失败:', err)
      setError(err.message || '编辑任务失败，请重试')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleSaveTodoDetail = async (todoData: any) => {
    try {
      await updateTodo(todoData.id, todoData)
      console.log('✅ 任务详情保存成功')
    } catch (err: any) {
      console.error('❌ 保存任务详情失败:', err)
      throw err
    }
  }

  const openTodoDetail = (todo: Todo) => {
    setSelectedTodo(todo)
    setShowDetail(true)
  }

  const closeTodoDetail = () => {
    setSelectedTodo(null)
    setShowDetail(false)
  }

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed)
    
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500'
      case 'medium': return 'from-yellow-500 to-orange-500'
      case 'low': return 'from-green-500 to-emerald-500'
      default: return 'from-blue-500 to-purple-500'
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  if (loading) {
    return (
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              正在加载您的任务...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 头部 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <Sparkles className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-indigo-600'} animate-pulse`} />
            <div className="absolute inset-0 animate-ping">
              <Sparkles className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-indigo-600'} opacity-75`} />
            </div>
          </div>
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${
            isDark 
              ? 'from-purple-400 via-pink-400 to-indigo-400' 
              : 'from-indigo-600 via-purple-600 to-pink-600'
          } bg-clip-text text-transparent`}>
            超级Todo
          </h1>
        </div>
        
        {/* 欢迎信息 */}
        <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          欢迎回来，{user.email}
        </p>
        
        {/* 进度条 */}
        <div className={`max-w-md mx-auto p-4 rounded-2xl backdrop-blur-md ${
          isDark ? 'bg-white/10' : 'bg-white/70'
        } shadow-xl border ${isDark ? 'border-white/20' : 'border-white/50'}`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              进度
            </span>
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </span>
          </div>
          <div className={`w-full h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {completedCount} / {totalCount} 任务完成
          </p>
        </div>
      </div>

      {/* 添加任务区域 */}
      <div className={`mb-8 p-6 rounded-3xl backdrop-blur-md ${
        isDark ? 'bg-white/10' : 'bg-white/70'
      } shadow-2xl border ${isDark ? 'border-white/20' : 'border-white/50'}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="添加一个新任务..."
              className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/30' 
                  : 'bg-white/80 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30'
              }`}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className={`px-4 py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-600 text-white' 
                  : 'bg-white/80 border-gray-200 text-gray-800'
              }`}
            >
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </select>
            
            <button
              onClick={handleAddTodo}
              disabled={!inputText.trim()}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isDark
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-indigo-500/25'
              }`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 搜索和过滤区域 */}
      <div className={`mb-6 p-4 rounded-2xl backdrop-blur-md ${
        isDark ? 'bg-white/5' : 'bg-white/50'
      } shadow-lg border ${isDark ? 'border-white/10' : 'border-white/30'}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索任务..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                isDark 
                  ? 'bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500/50' 
                  : 'bg-white/80 border border-gray-200 text-gray-800 placeholder-gray-500 focus:ring-indigo-500/50'
              }`}
            />
          </div>
          
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  filter === filterType
                    ? isDark
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-indigo-600 text-white shadow-lg'
                    : isDark
                      ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      : 'bg-white/60 text-gray-600 hover:bg-white/80'
                }`}
              >
                {filterType === 'all' ? '全部' : filterType === 'active' ? '进行中' : '已完成'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl backdrop-blur-md ${
            isDark ? 'bg-white/5' : 'bg-white/50'
          } shadow-lg border ${isDark ? 'border-white/10' : 'border-white/30'}`}>
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Calendar className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {searchTerm ? '没有找到匹配的任务' : '还没有任务，添加一个开始吧！'}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              className={`group p-4 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${
                isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-white/70 hover:bg-white/90'
              } shadow-lg hover:shadow-xl border ${
                isDark ? 'border-white/20' : 'border-white/50'
              } animate-in slide-in-from-top-2`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* 优先级指示器 */}
                <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${getPriorityColor(todo.priority)}`}></div>
                
                {/* 完成按钮 */}
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center hover:scale-110 ${
                    todo.completed
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500'
                      : isDark
                        ? 'border-gray-500 hover:border-purple-400'
                        : 'border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  {todo.completed && <Check className="w-4 h-4 text-white" />}
                </button>

                {/* 任务内容 */}
                <div className="flex-1">
                  {editingId === todo.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className={`flex-1 px-3 py-1 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
                          isDark 
                            ? 'bg-gray-800 border-gray-600 text-white focus:ring-purple-500/50' 
                            : 'bg-white border-gray-200 text-gray-800 focus:ring-indigo-500/50'
                        }`}
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="p-1 text-green-500 hover:bg-green-500/20 rounded-lg transition-all duration-300"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 text-red-500 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className={`font-medium transition-all duration-300 ${
                        todo.completed 
                          ? isDark ? 'text-gray-500 line-through' : 'text-gray-400 line-through'
                          : isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                        {todo.text}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`text-xs flex items-center gap-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {new Date(todo.created_at).toLocaleDateString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          todo.priority === 'high' 
                            ? 'bg-red-500/20 text-red-400' 
                            : todo.priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                        }`}>
                          {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 操作按钮 */}
                {editingId !== todo.id && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => startEdit(todo.id, todo.text)}
                      className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                        isDark 
                          ? 'text-blue-400 hover:bg-blue-500/20' 
                          : 'text-blue-500 hover:bg-blue-500/20'
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openTodoDetail(todo)}
                      className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                        isDark 
                          ? 'text-purple-400 hover:bg-purple-500/20' 
                          : 'text-purple-500 hover:bg-purple-500/20'
                      }`}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                        isDark 
                          ? 'text-red-400 hover:bg-red-500/20' 
                          : 'text-red-500 hover:bg-red-500/20'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 统计信息 */}
      {todos.length > 0 && (
        <div className={`mt-8 p-4 rounded-2xl backdrop-blur-md ${
          isDark ? 'bg-white/5' : 'bg-white/50'
        } shadow-lg border ${isDark ? 'border-white/10' : 'border-white/30'}`}>
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {todos.filter(t => !t.completed).length}
              </div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>待完成</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {completedCount}
              </div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>已完成</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                {totalCount}
              </div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>总计</div>
            </div>
          </div>
        </div>
      )}

      {/* 任务详情弹窗 */}
      <TodoDetail
        open={showDetail}
        onClose={closeTodoDetail}
        todo={selectedTodo}
        onSave={handleSaveTodoDetail}
      />
    </div>
  )
}