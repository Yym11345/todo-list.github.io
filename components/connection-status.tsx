'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { getConnectionStatus, testConnection } from '@/lib/supabase/client';

export default function ConnectionStatus() {
  const [status, setStatus] = useState({
    hasEnvVars: false,
    clientCreated: false,
    connectionTest: false,
    testing: false,
  });

  useEffect(() => {
    const checkStatus = async () => {
      const connectionStatus = getConnectionStatus();
      setStatus(prev => ({
        ...prev,
        hasEnvVars: connectionStatus.hasEnvVars,
        clientCreated: connectionStatus.clientCreated,
      }));

      if (connectionStatus.hasEnvVars) {
        setStatus(prev => ({ ...prev, testing: true }));
        const testResult = await testConnection();
        setStatus(prev => ({
          ...prev,
          connectionTest: testResult,
          testing: false,
        }));
      }
    };

    checkStatus();
  }, []);

  const StatusItem = ({ 
    label, 
    success, 
    loading = false 
  }: { 
    label: string; 
    success: boolean; 
    loading?: boolean;
  }) => (
    <div className="flex items-center gap-2 text-sm">
      {loading ? (
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      ) : success ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <span className={success ? 'text-green-700' : 'text-red-700'}>
        {label}
      </span>
    </div>
  );

  const allGood = status.hasEnvVars && status.clientCreated && status.connectionTest;

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border ${
      allGood 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    } max-w-sm z-50`}>
      <div className="flex items-center gap-2 mb-3">
        {allGood ? (
          <Wifi className="w-5 h-5 text-green-600" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-600" />
        )}
        <h3 className="font-medium text-gray-900">
          Supabase 连接状态
        </h3>
      </div>
      
      <div className="space-y-2">
        <StatusItem 
          label="环境变量配置" 
          success={status.hasEnvVars} 
        />
        <StatusItem 
          label="客户端创建" 
          success={status.clientCreated} 
        />
        <StatusItem 
          label="连接测试" 
          success={status.connectionTest}
          loading={status.testing}
        />
      </div>

      {!allGood && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          请检查 .env.local 文件配置
        </div>
      )}
    </div>
  );
}