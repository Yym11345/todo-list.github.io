import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

export function EnvVarWarning() {
  return (
    <div className="flex flex-col gap-4 items-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        <Badge variant="outline" className="font-normal text-yellow-700 border-yellow-300">
          需要配置 Supabase 环境变量
        </Badge>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-yellow-700">
          请在 <code className="bg-yellow-100 px-1 rounded">.env.local</code> 文件中配置 Supabase 环境变量
        </p>
        <div className="text-xs text-yellow-600 space-y-1">
          <div>NEXT_PUBLIC_SUPABASE_URL=your_project_url</div>
          <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled className="text-yellow-700 border-yellow-300">
          登录
        </Button>
        <Button size="sm" variant="default" disabled className="bg-yellow-600 hover:bg-yellow-700">
          注册
        </Button>
      </div>
      
      <p className="text-xs text-yellow-600 text-center">
        配置完成后请重启开发服务器
      </p>
    </div>
  );
}