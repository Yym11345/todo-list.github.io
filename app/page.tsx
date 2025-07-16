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
  ArrowRight
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  // 避免水合作用不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && theme === 'dark'

  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      const parsedTodos = JSON.parse(saved).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }))
      setTodos(parsedTodos)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!isLoggedIn) {
      window.location.href = '/auth/login'
      return
    }
    
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
    if (!isLoggedIn) {
      window.location.href = '/auth/login'
      return
    }
    
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    if (!isLoggedIn) {
      window.location.href = '/auth/login'
      return
    }
    
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEdit = (id: string, text: string) => {
    if (!isLoggedIn) {
      window.location.href = '/auth/login'
      return
    }
    
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = () => {
    if (!isLoggedIn) {
      window.location.href = '/auth/login'
      return
    }
    
    if (editText.trim() && editingId) {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ))
      setEditingId(null)
      setEditText('')
    }
  }

  const cancelEdit = () => {
    if (!isLoggedIn) {
      window.location.href = '/auth/login'
      return
    }
    
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

  return (
    <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
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
      
        {/* 登录注册按钮 */}
        <div className="flex justify-center gap-4 mb-6">
          <a href="/auth/login" 
            className={`px-5 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-800 shadow-md'
            }`}>
            <LogIn className="w-4 h-4" />
            登录
          </a>
          <a href="/auth/sign-up" 
            className={`px-5 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
              isDark
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
            }`}>
            <UserPlus className="w-4 h-4" />
            注册
          </a>
        </div>
        
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

      {/* 未登录提示 */}
      <div className={`mb-8 text-center ${
        isDark ? 'text-purple-300' : 'text-indigo-600'
      }`}>
        <a href="/auth/login" className="flex items-center justify-center gap-2 hover:underline">
          <span className="font-medium">开始你的计划吧</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
} 