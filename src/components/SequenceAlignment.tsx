import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AlignmentResult {
  id: string;
  sequences: {
    id: string;
    name: string;
    sequence: string;
  }[];
  alignmentResult: string;
  score: number;
  createdAt: string;
}

const SequenceAlignment: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AlignmentResult | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // 确保存储桶存在
    const createBucketIfNotExists = async () => {
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === 'sequence-files');
        
        if (!bucketExists) {
          const { error } = await supabase.storage.createBucket('sequence-files', {
            public: false,
            fileSizeLimit: 52428800, // 50MB
            allowedMimeTypes: ['text/plain', 'application/octet-stream']
          });
          
          if (error) throw error;
        }
      } catch (err) {
        console.error('创建存储桶失败:', err);
      }
    };

    createBucketIfNotExists();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // 检查文件格式
      if (!selectedFile.name.toLowerCase().endsWith('.fasta') && 
          !selectedFile.name.toLowerCase().endsWith('.fa')) {
        setError('请上传 FASTA 格式文件 (.fasta 或 .fa)');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('请选择要上传的文件');
      return;
    }

    if (!user) {
      setError('请先登录');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 读取文件内容
      const fileContent = await file.text();
      
      // 验证FASTA格式
      if (!fileContent.startsWith('>')) {
        throw new Error('无效的FASTA格式');
      }

      // 生成唯一的文件名
      const timestamp = Date.now();
      const fileName = `${user.id}/${timestamp}-${file.name}`;

      // 上传文件到Supabase存储
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sequence-files')
        .upload(fileName, file, {
          contentType: 'text/plain',
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // 获取文件的签名URL
      const { data: urlData } = await supabase.storage
        .from('sequence-files')
        .createSignedUrl(fileName, 3600); // 1小时有效期

      if (!urlData?.signedUrl) {
        throw new Error('获取文件URL失败');
      }

      // 调用序列比对API
      const response = await fetch('/api/sequence-alignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: urlData.signedUrl,
          userId: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '序列比对失败');
      }

      const alignmentResult = await response.json();
      setResult(alignmentResult);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">序列比对分析</h2>
        
        {/* 文件上传区域 */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <input
            type="file"
            accept=".fasta,.fa"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <span className="text-gray-600">
              {file ? file.name : '点击或拖拽上传FASTA文件'}
            </span>
            <span className="text-sm text-gray-500 mt-2">
              支持 .fasta 或 .fa 格式，最大50MB
            </span>
          </label>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* 上传按钮 */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              开始分析
            </>
          )}
        </button>

        {/* 结果显示 */}
        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                比对结果
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-1">序列信息</h4>
                  {result.sequences.map((seq) => (
                    <div key={seq.id} className="text-sm text-green-600">
                      <p className="font-medium">{seq.name}</p>
                      <p className="font-mono text-xs overflow-x-auto whitespace-pre">
                        {seq.sequence}
                      </p>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium text-green-700 mb-1">比对得分</h4>
                  <p className="text-green-600">{result.score}</p>
                </div>
                <div>
                  <h4 className="font-medium text-green-700 mb-1">比对时间</h4>
                  <p className="text-green-600">
                    {new Date(result.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SequenceAlignment; 