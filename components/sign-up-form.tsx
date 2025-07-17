"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, User, AlertCircle, CheckCircle, Check, X } from "lucide-react";
import { EnvVarWarning } from "./env-var-warning";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // 检查环境变量
  const hasEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 密码强度检查
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    hasLetter: false,
    hasNumber: false,
    match: false
  });

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

  // 检查密码强度
  useEffect(() => {
    setPasswordChecks({
      length: password.length >= 6,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /\d/.test(password),
      match: password === confirmPassword && password.length > 0
    });
  }, [password, confirmPassword]);

  const isPasswordValid = passwordChecks.length && passwordChecks.hasLetter && passwordChecks.hasNumber;
  const isFormValid = email.trim() && isPasswordValid && passwordChecks.match;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!isFormValid) {
      setError("请完善所有必填信息");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
      // 添加超时处理
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('请求超时，请检查网络连接')), 15000)
      );

      const signUpPromise = supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            email_confirm: false
          }
        },
      });

      const { error } = await Promise.race([signUpPromise, timeoutPromise]) as any;
      
      if (error) {
        // 友好的错误提示
        if (error.message.includes('User already registered')) {
          throw new Error('该邮箱已被注册，请使用其他邮箱或尝试登录');
        } else if (error.message.includes('Password should be')) {
          throw new Error('密码强度不足，请使用更复杂的密码');
        } else if (error.message.includes('Invalid email')) {
          throw new Error('邮箱格式不正确，请检查后重试');
        } else {
          throw new Error(error.message || '注册失败，请重试');
        }
      }

      setSuccess(true);
      
      // 延迟跳转
      setTimeout(() => {
        router.push("/auth/sign-up-success");
      }, 2000);
      
    } catch (error: unknown) {
      console.error('注册错误:', error);
      setError(error instanceof Error ? error.message : "注册失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordCheck = ({ check, text }: { check: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs ${check ? 'text-green-600' : 'text-muted-foreground'}`}>
      {check ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSignUp} className="space-y-6">
        {/* 邮箱输入 */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            邮箱地址 <span className="text-destructive">*</span>
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
          <Label htmlFor="password" className="text-sm font-medium">
            密码 <span className="text-destructive">*</span>
          </Label>
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
          
          {/* 密码强度指示 */}
          {password && (
            <div className="space-y-1 p-2 bg-muted/50 rounded-md">
              <PasswordCheck check={passwordChecks.length} text="至少6个字符" />
              <PasswordCheck check={passwordChecks.hasLetter} text="包含字母" />
              <PasswordCheck check={passwordChecks.hasNumber} text="包含数字" />
            </div>
          )}
        </div>

        {/* 确认密码输入 */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            确认密码 <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="请再次输入密码"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* 密码匹配检查 */}
          {confirmPassword && (
            <div className="p-2 bg-muted/50 rounded-md">
              <PasswordCheck check={passwordChecks.match} text="密码匹配" />
            </div>
          )}
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
            <span>注册成功！请查收验证邮件...</span>
          </div>
        )}

        {/* 注册按钮 */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              注册中...
            </>
          ) : (
            "注册账户"
          )}
        </Button>

        {/* 登录链接 */}
        <div className="text-center text-sm text-muted-foreground">
          已有账户？{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            立即登录
          </Link>
        </div>
      </form>
    </div>
  );
}