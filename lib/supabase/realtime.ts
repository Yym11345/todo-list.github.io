import { createClient } from './client'
import { RealtimeChannel, RealtimeChannelSendResponse } from '@supabase/supabase-js'

/**
 * 创建一个实时订阅通道，用于监听特定表的变更
 * @param tableName 要监听的表名
 * @param userId 用户ID，用于过滤只接收该用户的数据
 * @param callback 当数据变更时的回调函数
 * @returns 返回创建的通道，可用于后续取消订阅
 */
export function createRealtimeSubscription(
  tableName: string,
  userId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  const supabase = createClient()
  
  // 创建一个唯一的通道名称
  const channelName = `${tableName}_changes_${userId}_${Date.now()}`
  
  // 创建并订阅通道，使用更高的优先级
  const channel = supabase
    .channel(channelName, {
      config: {
        broadcast: { self: true }, // 确保自己的更改也能收到
        presence: { key: userId }, // 添加presence功能以跟踪在线状态
      }
    })
    .on(
      'postgres_changes',
      {
        event: '*', // 监听所有事件类型：INSERT, UPDATE, DELETE
        schema: 'public',
        table: tableName,
        filter: `user_id=eq.${userId}` // 只接收当前用户的数据变更
      },
      (payload) => {
        console.log(`${tableName} 实时数据更新:`, payload)
        callback(payload)
      }
    )
    .subscribe((status, err) => {
      console.log(`${tableName} 实时订阅状态:`, status, err ? `错误: ${err.message}` : '')
      
      if (status === 'SUBSCRIBED') {
        console.log(`${tableName} 实时订阅成功，将接收数据更新`)
        // 订阅成功后发送一个心跳包，确保连接活跃
        sendHeartbeat(channel)
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`${tableName} 实时订阅失败`, err)
        // 尝试重新连接
        setTimeout(() => {
          console.log('尝试重新连接实时订阅...')
          channel.subscribe()
        }, 2000)
      }
    })
  
  return channel
}

/**
 * 发送心跳包以保持连接活跃
 */
function sendHeartbeat(channel: RealtimeChannel) {
  // 每30秒发送一次心跳包
  const intervalId = setInterval(() => {
    channel.send({
      type: 'broadcast',
      event: 'heartbeat',
      payload: { timestamp: Date.now() }
    })
    .then((response: RealtimeChannelSendResponse) => {
      if (response === 'ok') {
        console.log('心跳包发送成功')
      } else {
        console.warn('心跳包发送失败', response)
      }
    })
    .catch(err => {
      console.error('心跳包发送错误', err)
    })
  }, 30000)

  // 保存intervalId到channel对象，以便在取消订阅时清除
  ;(channel as any)._heartbeatInterval = intervalId
}

/**
 * 取消实时订阅
 * @param channel 要取消的通道
 */
export function removeRealtimeSubscription(channel: RealtimeChannel): void {
  const supabase = createClient()
  
  // 清除心跳包定时器
  if ((channel as any)._heartbeatInterval) {
    clearInterval((channel as any)._heartbeatInterval)
  }
  
  supabase.removeChannel(channel)
  console.log('已取消实时订阅')
}

/**
 * 创建一个通用的实时数据处理函数
 * @param setData 用于更新状态的函数
 * @returns 返回一个处理实时数据更新的函数
 */
export function createRealtimeHandler<T extends { id: string }>(
  setData: React.Dispatch<React.SetStateAction<T[]>>
) {
  return (payload: any) => {
    console.log('处理实时数据更新:', payload)
    
    if (payload.eventType === 'INSERT') {
      const newItem = payload.new as T
      setData(prevData => {
        // 检查是否已存在相同ID的项目（避免重复）
        const exists = prevData.some(item => item.id === newItem.id)
        if (exists) return prevData
        return [newItem, ...prevData]
      })
    } 
    else if (payload.eventType === 'UPDATE') {
      const updatedItem = payload.new as T
      setData(prevData => 
        prevData.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      )
    } 
    else if (payload.eventType === 'DELETE') {
      const deletedId = payload.old.id
      setData(prevData => 
        prevData.filter(item => item.id !== deletedId)
      )
    }
  }
}

/**
 * 手动触发实时更新广播
 * 当需要确保数据更改立即广播时使用
 * @param tableName 表名
 * @param event 事件类型 ('INSERT' | 'UPDATE' | 'DELETE')
 * @param record 记录数据
 */
export async function broadcastChange(
  tableName: string, 
  event: 'INSERT' | 'UPDATE' | 'DELETE', 
  record: any
): Promise<void> {
  const supabase = createClient()
  
  try {
    const channel = supabase.channel('manual_broadcast')
    
    await channel.send({
      type: 'broadcast',
      event: `${tableName}_${event.toLowerCase()}`,
      payload: {
        type: event,
        table: tableName,
        record
      }
    })
    
    supabase.removeChannel(channel)
  } catch (error) {
    console.error('手动广播失败:', error)
  }
} 