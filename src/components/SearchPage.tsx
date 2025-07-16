import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Link, Navigate } from 'react-router-dom';
import GeneList from './GeneList';
import { SearchFilters, geneService } from '../services/geneService';
import { useAuth } from '../contexts/AuthContext';

interface SearchHistory {
  id: number;
  query: string;
  created_at: string;
}

const SearchPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    Reviewed: undefined,
    organism: undefined,
    function: undefined,
    domain: undefined
  });
  const [organisms, setOrganisms] = useState<string[]>([]);
  const [functions, setFunctions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // 如果未登录，重定向到登录页面
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 加载过滤器选项
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // 点击外部关闭历史记录
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 加载搜索历史
  const loadSearchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSearchHistory(data || []);
    } catch (error) {
      console.error('加载搜索历史失败:', error);
    }
  };

  // 保存搜索历史
  const saveSearchHistory = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const { error } = await supabase
        .from('search_history')
        .upsert({
          user_id: user.id,
          query: query.trim(),
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      await loadSearchHistory();
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  };

  // 删除搜索历史
  const deleteSearchHistory = async (id: number) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadSearchHistory();
    } catch (error) {
      console.error('删除搜索历史失败:', error);
    }
  };

  // 清空所有搜索历史
  const clearAllSearchHistory = async () => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setSearchHistory([]);
    } catch (error) {
      console.error('清空搜索历史失败:', error);
    }
  };

  // 处理搜索
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
    if (query.trim()) {
      await saveSearchHistory(query);
    }
  };

  // 加载过滤器选项
  const loadFilterOptions = async () => {
    setLoading(true);
    try {
      const [organismValues, functionValues] = await Promise.all([
        geneService.getDistinctValues('Organism'),
        geneService.getDistinctValues('Function'),
      ]);

      setOrganisms(organismValues);
      setFunctions(functionValues);
    } catch (err) {
      console.error('加载过滤选项失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">基因数据库</h1>
      
      {/* 搜索框 */}
      <div className="mb-8" ref={searchBoxRef}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              loadSearchHistory();
              setShowHistory(true);
            }}
            placeholder="搜索基因..."
            className="w-full p-4 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-mono pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              title="清除搜索"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* 搜索历史下拉框 */}
          {showHistory && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-blue-200 rounded-lg shadow-lg">
              <div className="p-2 border-b border-blue-100 flex justify-between items-center">
                <span className="text-sm text-gray-600">搜索历史</span>
                {searchHistory.length > 0 && (
                  <button
                    onClick={clearAllSearchHistory}
                    className="text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    清空历史
                  </button>
                )}
              </div>
              {searchHistory.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  暂无搜索历史
                </div>
              ) : (
                <ul className="max-h-60 overflow-y-auto">
                  {searchHistory.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between px-4 py-2 hover:bg-blue-50 cursor-pointer group"
                    >
                      <button
                        onClick={() => handleSearch(item.query)}
                        className="flex-grow text-left text-gray-700 hover:text-blue-600"
                      >
                        {item.query}
                      </button>
                      <button
                        onClick={() => deleteSearchHistory(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 过滤器组 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 审核状态过滤器 */}
        <div className="filter-group">
          <label className="block text-sm font-mono text-blue-700 mb-2">
            审核状态
          </label>
          <select
            value={filters.Reviewed || ''}
            onChange={(e) => handleFilterChange('Reviewed', e.target.value || undefined)}
            className="w-full p-3 bg-white border border-blue-200 rounded-lg text-blue-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <option value="">全部状态</option>
            <option value="reviewed">已审查</option>
            <option value="unreviewed">未审查</option>
          </select>
        </div>

        {/* 物种过滤器 */}
        <div className="filter-group">
          <label className="block text-sm font-mono text-blue-700 mb-2">
            物种
          </label>
          <select
            value={filters.organism || ''}
            onChange={(e) => handleFilterChange('organism', e.target.value || undefined)}
            className="w-full p-3 bg-white border border-blue-200 rounded-lg text-blue-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <option value="">全部物种</option>
            {organisms.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
        </div>

        {/* 功能过滤器 */}
        <div className="filter-group">
          <label className="block text-sm font-mono text-blue-700 mb-2">
            功能
          </label>
          <select
            value={filters.function || ''}
            onChange={(e) => handleFilterChange('function', e.target.value || undefined)}
            className="w-full p-3 bg-white border border-blue-200 rounded-lg text-blue-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <option value="">全部功能</option>
            {functions.map((func) => (
              <option key={func} value={func}>
                {func}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 重置过滤器按钮 */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => {
            setFilters({
              Reviewed: undefined,
              organism: undefined,
              function: undefined,
              domain: undefined
            });
            setSearchQuery('');
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-mono"
        >
          重置过滤器
        </button>
      </div>

      {/* 基因列表 */}
      <GeneList
        query={searchQuery}
        filters={filters}
      />
    </div>
  );
};

export default SearchPage;