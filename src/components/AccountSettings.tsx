import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  pageSize: number;
  notifications: boolean;
}

interface UserProfile {
  username: string;
  email: string;
  organization: string;
  role: string;
}

const AccountSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    language: 'zh',
    pageSize: 20,
    notifications: true
  });

  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    organization: '',
    role: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 加载用户配置
        const { data: prefsData, error: prefsError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (prefsError) throw prefsError;
        if (prefsData) setPreferences(prefsData as UserPreferences);

        // 加载用户档案
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;
        if (profileData) setProfile(profileData as UserProfile);
      }
    } catch (error) {
      console.error('加载用户设置失败:', error);
      setMessage({ type: 'error', text: '加载设置失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('未登录');

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences
        });

      if (error) throw error;
      setMessage({ type: 'success', text: '偏好设置已保存' });
    } catch (error) {
      console.error('保存偏好设置失败:', error);
      setMessage({ type: 'error', text: '保存失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('未登录');

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...profile
        });

      if (error) throw error;
      setMessage({ type: 'success', text: '个人资料已更新' });
    } catch (error) {
      console.error('保存个人资料失败:', error);
      setMessage({ type: 'error', text: '保存失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">账户设置</h1>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* 个人资料设置 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-6">个人资料</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              组织
            </label>
            <input
              type="text"
              value={profile.organization}
              onChange={(e) => setProfile(prev => ({ ...prev, organization: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              角色
            </label>
            <select
              value={profile.role}
              onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <option value="">选择角色</option>
              <option value="researcher">研究员</option>
              <option value="student">学生</option>
              <option value="professor">教授</option>
              <option value="other">其他</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={saveProfile}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存个人资料'}
          </button>
        </div>
      </div>

      {/* 偏好设置 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-6">偏好设置</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              主题
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' }))}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <option value="light">浅色</option>
              <option value="dark">深色</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              语言
            </label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value as 'zh' | 'en' }))}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              每页显示数量
            </label>
            <select
              value={preferences.pageSize}
              onChange={(e) => setPreferences(prev => ({ ...prev, pageSize: Number(e.target.value) }))}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              通知设置
            </label>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">启用通知</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={savePreferences}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存偏好设置'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 