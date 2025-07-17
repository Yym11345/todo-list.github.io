"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { EnvVarWarning } from "./env-var-warning";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // 检查环境变量
  const hasEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 预热连接
  useEffect(() => {
    if (hasEnvVars) {
      try {
        const client = createClient();
        client.auth.getSession().catch(() => {});
      } catch (error) {
        console.warn('预热连接失败:', error);
      }
    }
  }, []);

  // 如果环境变量未配置，显示警告
  if (!hasEnvVars) {
    return <EnvVarWarning />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      
      // 添加超时处理
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('请求超时，请检查网络连接')), 15000)
      );

      const loginPromise = supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      const { error } = await Promise.race([loginPromise, timeoutPromise]) as any;
      
      if (error) {
        // 友好的错误提示
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('邮箱或密码错误，请检查后重试');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('请先验证您的邮箱地址');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('登录尝试过于频繁，请稍后再试');
        } else {
          throw new Error(error.message || '登录失败，请重试');
        }
      }

      setSuccess(true);
      
      // 延迟跳转，让用户看到成功状态
      setTimeout(() => {
        router.push("/protected");
      }, 1000);
      
    } catch (error: unknown) {
      console.error('登录错误:', error);
      setError(error instanceof Error ? error.message : "登录失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleLogin} className="space-y-6">
        {/* 邮箱输入 */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            邮箱地址
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="请输入邮箱地址"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 密码输入 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              密码
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              忘记密码？
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="请输入密码"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 成功提示 */}
        {success && (
          <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>登录成功！正在跳转...</span>
          </div>
        )}

        {/* 登录按钮 */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !email.trim() || !password.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              登录中...
            </>
          ) : (
            "登录"
          )}
        </Button>

        {/* 注册链接 */}
        <div className="text-center text-sm text-muted-foreground">
          还没有账户？{" "}
          <Link
            href="/auth/sign-up"
            className="text-primary hover:underline font-medium"
          >
            立即注册
          </Link>
        </div>
      </form>
    </div>
  );
}