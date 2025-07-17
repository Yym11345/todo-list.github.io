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
  LogIn,
  UserPlus,
  ArrowRight,
  Star,
  Target,
  Zap
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { warmupConnection } from '@/lib/supabase/client'

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  dueDate?: Date
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputText, setInputText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const router = useRouter()

  // 避免水合作用不匹配
  useEffect(() => {
    setMounted(true)
    // 预热 Supabase 连接
    warmupConnection()
  }, [])

  const isDark = mounted && theme === 'dark'

  useEffect(() => {
    const saved = localStorage.getItem('demo_todos')
    if (saved) {
      const parsedTodos = JSON.parse(saved).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }))
      setTodos(parsedTodos)
    } else {
      // 添加一些示例数据
      const demoTodos: Todo[] = [
        {
          id: '1',
          text: '完成项目文档',
          completed: false,
          priority: 'high',
          createdAt: new Date(),
        },
        {
          id: '2',
          text: '学习 React 新特性',
          completed: true,
          priority: 'medium',
          createdAt: new Date(Date.now() - 86400000),
        },
        {
          id: '3',
          text: '准备周会汇报',
          completed: false,
          priority: 'low',
          createdAt: new Date(Date.now() - 172800000),
        }
      ]
      setTodos(demoTodos)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('demo_todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
        priority,
        createdAt: new Date()
      }
      setTodos([newTodo, ...todos])
      setInputText('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEdit = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = () => {
    if (editText.trim() && editingId) {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ))
      setEditingId(null)
      setEditText('')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
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

  const features = [
    {
      icon: Target,
      title: '智能任务管理',
      description: '优先级分类，截止日期提醒，让你的任务井井有条'
    },
    {
      icon: Zap,
      title: '实时同步',
      description: '多设备实时同步，随时随地管理你的任务'
    },
    {
      icon: Star,
      title: '数据安全',
      description: '企业级安全保障，你的数据永远安全可靠'
    }
  ]

  return (
    <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
      {/* 头部 */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative">
            <Sparkles className={`w-10 h-10 ${isDark ? 'text-purple-400' : 'text-indigo-600'} animate-pulse`} />
            <div className="absolute inset-0 animate-ping">
              <Sparkles className={`w-10 h-10 ${isDark ? 'text-purple-400' : 'text-indigo-600'} opacity-75`} />
            </div>
          </div>
          <h1 className={`text-5xl font-bold bg-gradient-to-r ${
            isDark 
              ? 'from-purple-400 via-pink-400 to-indigo-400' 
              : 'from-indigo-600 via-purple-600 to-pink-600'
          } bg-clip-text text-transparent`}>
            超级Todo
          </h1>
        </div>
        
        <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
          让任务管理变得简单高效，专为现代工作方式设计的智能Todo应用
        </p>
      
        {/* 登录注册按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <a href="/auth/login" 
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-white shadow-lg'
                : 'bg-white hover:bg-gray-50 text-gray-800 shadow-lg border'
            }`}>
            <LogIn className="w-5 h-5" />
            登录
          </a>
          <a href="/auth/sign-up" 
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg ${
              isDark
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
            }`}>
            <UserPlus className="w-5 h-5" />
            免费注册
          </a>
        </div>
        
        {/* 功能特色 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className={`p-6 rounded-2xl backdrop-blur-md ${
                isDark ? 'bg-white/10' : 'bg-white/70'
              } shadow-xl border ${isDark ? 'border-white/20' : 'border-white/50'} hover:scale-105 transition-all duration-300`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${
                  isDark ? 'from-purple-500 to-pink-500' : 'from-indigo-500 to-purple-500'
                } flex items-center justify-center mb-4 mx-auto`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
        
        {/* 进度条 */}
        <div className={`max-w-md mx-auto p-6 rounded-2xl backdrop-blur-md ${
          isDark ? 'bg-white/10' : 'bg-white/70'
        } shadow-xl border ${isDark ? 'border-white/20' : 'border-white/50'}`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              演示进度
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

      {/* 演示区域 */}
      <div className={`p-8 rounded-3xl backdrop-blur-md ${
        isDark ? 'bg-white/5' : 'bg-white/50'
      } shadow-2xl border ${isDark ? 'border-white/10' : 'border-white/30'} mb-8`}>
        <h2 className={`text-2xl font-bold text-center mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          体验演示版本
        </h2>
        
        {/* 添加任务区域 */}
        <div className={`mb-6 p-4 rounded-2xl backdrop-blur-md ${
          isDark ? 'bg-white/10' : 'bg-white/70'
        } shadow-lg border ${isDark ? 'border-white/20' : 'border-white/50'}`}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="添加一个新任务..."
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
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
                className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
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
                onClick={addTodo}
                disabled={!inputText.trim()}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
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
                    onClick={() => toggleTodo(todo.id)}
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
                            {todo.createdAt.toLocaleDateString()}
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
                        onClick={() => deleteTodo(todo.id)}
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
          <div className={`mt-6 p-4 rounded-2xl backdrop-blur-md ${
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
      </div>

      {/* 底部CTA */}
      <div className={`text-center ${
        isDark ? 'text-purple-300' : 'text-indigo-600'
      }`}>
        <p className="text-lg mb-4">准备好开始高效管理你的任务了吗？</p>
        <a href="/auth/sign-up" className="inline-flex items-center gap-2 hover:underline font-medium">
          <span>立即免费注册</span>
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  )
}