'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Calendar as CalendarIcon, Clock, X, AlertCircle, Upload, Image, Trash } from 'lucide-react'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Textarea } from './ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select'
import { uploadFile, deleteFileFixed } from '@/lib/supabase/storage'

export interface TodoDetailProps {
  open: boolean
  onClose: () => void
  todo: {
    id: string
    text: string
    completed: boolean
    priority: string
    created_at: string
    due_date: string | null
    notes?: string
    image_url?: string
  } | null
  onSave: (todo: any) => Promise<void>
}

export default function TodoDetail({ open, onClose, todo, onSave }: TodoDetailProps) {
  const [text, setText] = useState('')
  const [completed, setCompleted] = useState(false)
  const [priority, setPriority] = useState<string>('medium')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (todo) {
      setText(todo.text)
      setCompleted(todo.completed)
      setPriority(todo.priority)
      setNotes(todo.notes || '')
      setDueDate(todo.due_date ? new Date(todo.due_date) : undefined)
      setImageUrl(todo.image_url)
      setError(null) // 重置错误状态
    }
  }, [todo])

  const handleSave = async () => {
    if (!todo) return
    
    if (!text.trim()) {
      setError('任务内容不能为空')
      return
    }
    
    setIsLoading(true)
    setError(null)
    try {
      await onSave({
        id: todo.id,
        text,
        completed,
        priority,
        due_date: dueDate ? dueDate.toISOString() : null,
        notes,
        image_url: imageUrl // 确保保存当前的imageUrl状态，可能是undefined（当删除图片后）
      })
      onClose()
    } catch (error: any) {
      console.error('保存任务失败:', error)
      setError(error.message || '保存任务失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      setError('只能上传图片文件')
      return
    }

    // 检查文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过10MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // 如果已经有图片，先删除旧图片
      if (imageUrl) {
        try {
          await deleteFileFixed(imageUrl)
        } catch (error) {
          console.error('删除旧图片失败:', error)
          // 继续上传新图片，不阻止流程
        }
      }

      // 上传新图片
      const url = await uploadFile(file)
      setImageUrl(url)
    } catch (error: any) {
      console.error('上传图片失败:', error)
      setError(error.message || '上传图片失败，请重试')
    } finally {
      setUploading(false)
      // 清空文件输入，以便可以重新选择同一个文件
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = async () => {
    if (!imageUrl) return

    setUploading(true)
    setError(null)

    try {
      console.log('开始删除图片:', imageUrl)
      await deleteFileFixed(imageUrl)
      console.log('图片已从存储中删除')
      
      // 确保清除imageUrl状态
      setImageUrl(undefined)
      console.log('图片URL已从本地状态中清除')
      
    } catch (error: any) {
      console.error('删除图片失败:', error)
      setError(error.message || '删除图片失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (!todo) return null

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>任务详情</DialogTitle>
        </DialogHeader>
        
        {/* 显示错误信息 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="text">任务名称</Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入任务名称..."
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">优先级</Label>
              <Select value={priority} onValueChange={setPriority} disabled={isLoading}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="选择优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>截止日期</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : <span>选择日期</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    disabled={isLoading}
                  />
                  {dueDate && (
                    <div className="flex items-center justify-center p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDueDate(undefined)}
                        className="text-destructive"
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4 mr-1" />
                        清除日期
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">备注</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="添加备注..."
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          {/* 图片上传区域 */}
          <div className="grid gap-2">
            <Label>附件图片</Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isLoading || uploading}
            />
            
            {imageUrl ? (
              <div className="relative border rounded-md p-2">
                <div className="flex justify-end mb-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleRemoveImage}
                    disabled={isLoading || uploading}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    删除图片
                  </Button>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <img 
                    src={imageUrl} 
                    alt="附件" 
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      console.error('图片加载失败:', imageUrl);
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/png?text=加载失败';
                    }}
                    onLoad={() => console.log('图片加载成功:', imageUrl)}
                  />
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={triggerFileInput}
                disabled={isLoading || uploading}
                className="flex items-center justify-center gap-2 h-24 border-dashed"
              >
                {uploading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mr-2"></div>
                    <span>上传中...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span>点击上传图片</span>
                  </>
                )}
              </Button>
            )}
            <p className="text-xs text-gray-500">
              支持JPG、PNG格式，最大10MB
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
              disabled={isLoading}
            />
            <Label htmlFor="completed">已完成</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading || uploading}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={isLoading || uploading}>
            {isLoading ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 