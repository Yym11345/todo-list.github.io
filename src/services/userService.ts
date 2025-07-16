import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];
type SearchHistory = Database['public']['Tables']['search_history']['Row'];
type SearchHistoryInsert = Database['public']['Tables']['search_history']['Insert'];

class UserService {
  // 获取用户资料
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // 未找到记录
      }
      throw new Error(`获取用户资料失败: ${error.message}`);
    }

    return data;
  }

  // 创建用户资料
  async createUserProfile(profile: UserProfileInsert): Promise<UserProfile> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      throw new Error(`创建用户资料失败: ${error.message}`);
    }

    return data;
  }

  // 更新用户资料
  async updateUserProfile(userId: string, updates: UserProfileUpdate): Promise<UserProfile> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`更新用户资料失败: ${error.message}`);
    }

    return data;
  }

  // 保存搜索历史
  async saveSearchHistory(searchHistory: SearchHistoryInsert): Promise<SearchHistory> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('search_history')
      .insert(searchHistory)
      .select()
      .single();

    if (error) {
      throw new Error(`保存搜索历史失败: ${error.message}`);
    }

    return data;
  }

  // 获取用户搜索历史
  async getUserSearchHistory(userId: string, limit: number = 10): Promise<SearchHistory[]> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`获取搜索历史失败: ${error.message}`);
    }

    return data || [];
  }

  // 清除用户搜索历史
  async clearUserSearchHistory(userId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`清除搜索历史失败: ${error.message}`);
    }
  }
}

export const userService = new UserService();