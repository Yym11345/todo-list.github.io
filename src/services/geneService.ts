import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export interface Gene {
  id: string;
  Entry: string;
  Reviewed: string;
  "Entry Name": string;
  "Protein names": string;
  "Gene Names": string | null;
  "EC number": string | null;
  Organism: string;
  Function: string | null;
  Sequence: string | null;
  Length: number | null;
  Domain: string | null;
  "Active site": string | null;
  "Catalytic activity": string | null;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  Reviewed?: string;
  organism?: string;
  function?: string;
  domain?: string;
}

export interface SearchResult {
  data: Gene[] | null;
  count: number;
  error: PostgrestError | null;
}

export const geneService = {
  async searchGenes(
    query: string,
    filters: SearchFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<SearchResult> {
    try {
      console.log('开始搜索基因，参数:', { query, filters, page, pageSize });
      
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      
      let queryBuilder = supabase
        .from('geness')
        .select('*', { count: 'exact' });

      // 添加搜索条件
      if (query) {
        queryBuilder = queryBuilder.or(
          `"Entry".ilike.%${query}%,"Entry Name".ilike.%${query}%,"Protein names".ilike.%${query}%,"Gene Names".ilike.%${query}%`
        );
      }

      // 添加过滤条件
      if (filters.Reviewed) {
        queryBuilder = queryBuilder.eq('Reviewed', filters.Reviewed);
      }

      if (filters.organism) {
        queryBuilder = queryBuilder.ilike('Organism', `%${filters.organism}%`);
      }

      if (filters.function) {
        queryBuilder = queryBuilder.ilike('Function', `%${filters.function}%`);
      }

      if (filters.domain) {
        queryBuilder = queryBuilder.ilike('Domain', `%${filters.domain}%`);
      }

      // 添加分页
      queryBuilder = queryBuilder.range(start, end);

      console.log('执行查询...');
      const { data, error, count } = await queryBuilder;

      if (error) {
        console.error('查询出错:', error);
        return { data: null, count: 0, error };
      }

      console.log(`查询成功，返回 ${data?.length} 条记录，总计 ${count} 条`);
      return { data, count: count || 0, error: null };
    } catch (error) {
      console.error('搜索基因时发生错误:', error);
      return { data: null, count: 0, error: error as PostgrestError };
    }
  },

  async getAllGenes(page: number = 1, pageSize: number = 20): Promise<SearchResult> {
    try {
      console.log('开始获取基因数据...', { page, pageSize });
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data, error, count } = await supabase
        .from('geness')
        .select('*', { count: 'exact' })
        .order('Entry')
        .range(start, end);

      if (error) {
        console.error('获取基因数据时发生错误:', error);
        throw error;
      }

      console.log(`成功获取基因数据! 总数: ${count}, 当前页数据: ${data?.length || 0}`);
      return {
        data,
        count: count || 0,
        error: null,
      };
    } catch (error) {
      console.error('获取基因数据时发生错误:', error);
      return {
        data: null,
        count: 0,
        error: error as PostgrestError,
      };
    }
  },

  async getGeneByEntry(entry: string): Promise<Gene | null> {
    try {
      console.log(`获取基因详情: ${entry}`);
      const { data, error } = await supabase
        .from('geness')
        .select('*')
        .eq('Entry', entry)
        .single();

      if (error) {
        console.error('获取基因详情失败:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('获取基因详情时发生错误:', error);
      return null;
    }
  },

  async getDistinctValues(column: keyof Gene): Promise<string[]> {
    try {
      console.log(`获取字段 ${column} 的唯一值`);
      const { data, error } = await supabase
        .from('geness')
        .select(column)
        .not(column, 'is', null);

      if (error) {
        console.error(`获取字段 ${column} 唯一值失败:`, error);
        throw error;
      }

      const values = Array.from(new Set(data.map((item: Record<string, any>) => item[column])));
      console.log(`字段 ${column} 共有 ${values.length} 个唯一值`);
      return values;
    } catch (error) {
      console.error(`获取字段 ${column} 唯一值时发生错误:`, error);
      return [];
    }
  }
};