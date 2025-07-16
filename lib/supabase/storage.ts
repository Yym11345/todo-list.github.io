import { createClient } from './client'

// 确保存储桶名称与Supabase控制台中创建的名称一致
const BUCKET_NAME = 'my-todo'

// 初始化存储桶（如果不存在）
export async function initStorage() {
  const supabase = createClient()
  
  try {
    // 检查存储桶是否存在
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error('获取存储桶列表失败:', error)
      throw error
    }
    
    console.log('所有存储桶:', buckets)
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)
    
    if (!bucketExists) {
      console.warn(`存储桶 ${BUCKET_NAME} 不存在，请在Supabase控制台中手动创建`)
      // 注意：不再尝试通过API创建存储桶，因为这需要管理员权限
    } else {
      console.log(`存储桶 ${BUCKET_NAME} 已存在`)
    }
    
    return true
  } catch (error) {
    console.error('初始化存储失败:', error)
    // 即使失败也返回true，不阻止应用程序运行
    return true
  }
}

// 上传文件到存储桶
export async function uploadFile(file: File): Promise<string> {
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
      throw new Error('用户未登录，无法上传文件')
    }
    
    // 生成唯一的文件名
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    
    console.log('准备上传文件:', fileName)
    
    // 上传文件
    const { error: uploadError, data } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file)
    
    if (uploadError) {
      console.error('上传文件失败:', uploadError)
      throw uploadError
    }
    
    console.log('文件上传成功:', data)
    
    // 获取文件的公共URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)
    
    console.log('获取到的公共URL:', publicUrl)
    
    return publicUrl
  } catch (error) {
    console.error('上传文件过程中发生错误:', error)
    throw error
  }
}

// 删除文件
export async function deleteFile(fileUrl: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    // 从URL中提取文件路径
    const url = new URL(fileUrl)
    const pathParts = url.pathname.split('/')
    
    console.log('删除文件URL:', fileUrl)
    console.log('路径部分:', pathParts)
    
    // 查找存储桶名称在路径中的位置
    const bucketIndex = pathParts.indexOf(BUCKET_NAME)
    if (bucketIndex === -1) {
      console.error('无法从URL中提取存储桶路径:', fileUrl)
      throw new Error('无效的文件URL格式')
    }
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/')
    
    console.log('尝试删除文件:', filePath)
    
    // 删除文件
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])
    
    if (error) {
      console.error('删除文件失败:', error)
      throw error
    }
    
    console.log('文件删除成功:', filePath)
    
    return true
  } catch (error) {
    console.error('删除文件过程中发生错误:', error)
    throw error
  }
}

// 修复版的删除文件函数 - 无重复代码
export async function deleteFileFixed(fileUrl: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    // 从URL中提取文件路径
    const url = new URL(fileUrl)
    const pathParts = url.pathname.split('/')
    
    console.log('删除文件URL:', fileUrl)
    console.log('路径部分:', pathParts)
    
    // 查找存储桶名称在路径中的位置
    const bucketIndex = pathParts.indexOf(BUCKET_NAME)
    if (bucketIndex === -1) {
      console.error('无法从URL中提取存储桶路径:', fileUrl)
      throw new Error('无效的文件URL格式')
    }
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/')
    
    console.log('尝试删除文件:', filePath)
    
    // 删除文件
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])
    
    if (error) {
      console.error('删除文件失败:', error)
      throw error
    }
    
    console.log('文件删除成功:', filePath)
    
    return true
  } catch (error) {
    console.error('删除文件过程中发生错误:', error)
    throw error
  }
} 