import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Gene, SearchFilters, geneService } from '../services/geneService';
import { Navigate } from 'react-router-dom';
import { Copy, Check, Database } from 'lucide-react';

interface GeneListProps {
  query?: string;
  filters?: SearchFilters;
}

interface CopiedState {
  geneId: string;
  field: 'entry' | 'entryName' | 'proteinNames' | 'geneNames' | 'organism' | 'sequence' | 'activeSite' | 'catalyticActivity' | 'ecNumber';
}

const GeneList: React.FC<GeneListProps> = ({ query = '', filters = {} }) => {
  const { user } = useAuth();
  const [genes, setGenes] = useState<Gene[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [copiedState, setCopiedState] = useState<CopiedState | null>(null);
  const pageSize = 20;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const loadGenes = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = query
        ? await geneService.searchGenes(query, filters, page, pageSize)
        : await geneService.getAllGenes(page, pageSize);

      if (result.error) {
        setError(`加载数据时发生错误: ${result.error.message || '未知错误'}`);
        setGenes([]);
        setTotalCount(0);
        return;
      }

      if (!result.data || result.data.length === 0) {
        setGenes([]);
        setTotalCount(0);
        return;
      }

      setGenes(result.data);
      setTotalCount(result.count);
    } catch (err) {
      console.error('加载基因数据时发生错误:', err);
      setError('加载数据时发生错误，请稍后重试');
      setGenes([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenes();
  }, [query, page, JSON.stringify(filters)]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const copyToClipboard = async (text: string, geneId: string, field: CopiedState['field']) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState({ geneId, field });
      setTimeout(() => setCopiedState(null), 2000);
    } catch (err) {
      console.error('复制到剪贴板失败:', err);
      setError('复制失败，请手动复制');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (genes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">没有找到匹配的基因数据</p>
      </div>
    );
  }

  const renderCopyButton = (text: string | null, geneId: string, field: CopiedState['field'], title: string) => {
    if (!text) return null;
    return (
      <button
        onClick={() => copyToClipboard(text, geneId, field)}
        className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-blue-100 transition-all"
        title={`复制${title}`}
      >
        {copiedState?.geneId === geneId && copiedState?.field === field ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-blue-500" />
        )}
      </button>
    );
  };

  return (
    <div className="overflow-x-auto bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-lg">
      <div className="min-w-[1800px]"> {/* Set minimum width to prevent squeezing */}
        <div className="border-b border-gray-200 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="grid grid-cols-11 py-4 px-6 gap-4">
            <div className="text-sm font-medium text-gray-600 w-28">Entry</div>
            <div className="text-sm font-medium text-gray-600 w-24">Reviewed</div>
            <div className="text-sm font-medium text-gray-600 w-48">Entry Name</div>
            <div className="text-sm font-medium text-gray-600 w-64">Protein names</div>
            <div className="text-sm font-medium text-gray-600 w-48">Gene Names</div>
            <div className="text-sm font-medium text-gray-600 w-48">Organism</div>
            <div className="text-sm font-medium text-gray-600 w-24">Length</div>
            <div className="text-sm font-medium text-gray-600 w-48">Sequence</div>
            <div className="text-sm font-medium text-gray-600 w-48">Active site</div>
            <div className="text-sm font-medium text-gray-600 w-96">Catalytic activity</div>
            <div className="text-sm font-medium text-gray-600 w-32">EC number</div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {genes.map((gene) => (
            <div key={gene.id} className="grid grid-cols-11 py-4 px-6 gap-4 hover:bg-blue-50/30 transition-colors">
              <div className="group w-28">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">{gene.Entry}</span>
                  {renderCopyButton(gene.Entry, gene.id, 'entry', 'Entry')}
                </div>
              </div>
              <div className="w-24">
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">
                  {gene.Reviewed === 'reviewed' ? '已审查' : '未审查'}
                </span>
              </div>
              <div className="group w-48">
                <div className="flex items-center">
                  <span className="text-gray-900 break-words">{gene['Entry Name']}</span>
                  {renderCopyButton(gene['Entry Name'], gene.id, 'entryName', 'Entry Name')}
                </div>
              </div>
              <div className="group w-64">
                <div className="flex items-center">
                  <span className="text-gray-900 break-words">{gene['Protein names']}</span>
                  {renderCopyButton(gene['Protein names'], gene.id, 'proteinNames', '蛋白质名称')}
                </div>
              </div>
              <div className="group w-48">
                <div className="flex items-center">
                  <span className="text-gray-900 break-words">{gene['Gene Names']}</span>
                  {renderCopyButton(gene['Gene Names'], gene.id, 'geneNames', '基因名称')}
                </div>
              </div>
              <div className="group w-48">
                <div className="flex items-center">
                  <span className="text-gray-900 break-words">{gene.Organism}</span>
                  {renderCopyButton(gene.Organism, gene.id, 'organism', '物种')}
                </div>
              </div>
              <div className="w-24 text-gray-900">{gene.Length || '-'}</div>
              <div className="group w-48">
                {gene.Sequence ? (
                  <div className="flex items-center">
                    <span className="text-gray-900 break-words" title={gene.Sequence}>
                      {gene.Sequence}
                    </span>
                    {renderCopyButton(gene.Sequence, gene.id, 'sequence', '序列')}
                  </div>
                ) : (
                  <span className="text-gray-400">暂无序列数据</span>
                )}
              </div>
              <div className="group w-48">
                <div className="flex items-center">
                  <span className="text-gray-900 break-words">{gene['Active site'] || '-'}</span>
                  {renderCopyButton(gene['Active site'], gene.id, 'activeSite', 'Active site')}
                </div>
              </div>
              <div className="group w-96">
                <div className="flex items-center">
                  <span className="text-gray-900 break-words whitespace-pre-wrap">{gene['Catalytic activity'] || '-'}</span>
                  {renderCopyButton(gene['Catalytic activity'], gene.id, 'catalyticActivity', 'Catalytic activity')}
                </div>
              </div>
              <div className="group w-32">
                <div className="flex items-center">
                  <span className="text-gray-900 break-words">{gene['EC number'] || '-'}</span>
                  {renderCopyButton(gene['EC number'], gene.id, 'ecNumber', 'EC number')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 py-6 bg-gray-50/50 backdrop-blur-sm border-t border-gray-200">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            上一页
          </button>
          <span className="text-sm text-gray-700">
            第 {page} 页，共 {totalPages} 页
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default GeneList; 