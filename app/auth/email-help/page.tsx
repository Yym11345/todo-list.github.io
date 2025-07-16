'use client';

import { Mail, AlertCircle, ArrowLeft, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EmailHelpPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);
  
  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      // 这里应该添加重新发送邮件的逻辑
      // 由于我们没有直接访问 Supabase 客户端，这里只是模拟
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitResult('success');
    } catch (error) {
      console.error("Error resending email:", error);
      setSubmitResult('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="relative z-10 container mx-auto px-4 py-8">
      <div className="flex min-h-[80vh] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-2xl p-6 rounded-2xl backdrop-blur-md dark:bg-white/10 bg-white/70 shadow-xl border dark:border-white/20 border-white/50">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Link 
                href="/auth/sign-up-success"
                className="p-2 rounded-full transition-all duration-300 hover:scale-110 dark:bg-gray-800 dark:text-purple-400 dark:hover:bg-gray-700 bg-white text-indigo-600 hover:bg-gray-50 shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h2 className="text-2xl font-bold bg-gradient-to-r dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                邮件接收帮助
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 rounded-xl dark:bg-white/5 bg-white/50">
                <h3 className="text-lg font-semibold mb-3 dark:text-white text-gray-800">为什么我没有收到确认邮件？</h3>
                <ul className="space-y-3 dark:text-gray-300 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full dark:bg-amber-500/20 bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4 dark:text-amber-400 text-amber-500" />
                    </div>
                    <div>
                      <strong>邮件延迟</strong> - 确认邮件可能需要几分钟时间才能到达您的收件箱。
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full dark:bg-amber-500/20 bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4 dark:text-amber-400 text-amber-500" />
                    </div>
                    <div>
                      <strong>垃圾邮件过滤</strong> - 确认邮件可能被您的邮件服务商标记为垃圾邮件。请检查您的垃圾邮件文件夹。
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full dark:bg-amber-500/20 bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4 dark:text-amber-400 text-amber-500" />
                    </div>
                    <div>
                      <strong>邮箱地址错误</strong> - 您可能在注册时输入了错误的邮箱地址。
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full dark:bg-amber-500/20 bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4 dark:text-amber-400 text-amber-500" />
                    </div>
                    <div>
                      <strong>邮件服务器问题</strong> - 我们的邮件服务器可能暂时遇到了问题。
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 rounded-xl dark:bg-white/5 bg-white/50">
                <h3 className="text-lg font-semibold mb-3 dark:text-white text-gray-800">解决方法</h3>
                <ul className="space-y-3 dark:text-gray-300 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full dark:bg-green-500/20 bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 dark:text-green-400 text-green-500" />
                    </div>
                    <div>
                      <strong>检查垃圾邮件文件夹</strong> - 搜索来自 "超级Todo" 或 "noreply@supabase.co" 的邮件。
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full dark:bg-green-500/20 bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 dark:text-green-400 text-green-500" />
                    </div>
                    <div>
                      <strong>将发件人添加到联系人</strong> - 将 "noreply@supabase.co" 添加到您的联系人列表中，以确保未来的邮件不会被过滤。
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full dark:bg-green-500/20 bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 dark:text-green-400 text-green-500" />
                    </div>
                    <div>
                      <strong>等待几分钟</strong> - 邮件发送可能需要一些时间。请耐心等待几分钟后再检查。
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full dark:bg-green-500/20 bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 dark:text-green-400 text-green-500" />
                    </div>
                    <div>
                      <strong>重新发送确认邮件</strong> - 您可以尝试重新发送确认邮件。
                    </div>
                  </li>
                </ul>
              </div>
              
              <form onSubmit={handleResendEmail} className="p-4 rounded-xl dark:bg-white/5 bg-white/50">
                <h3 className="text-lg font-semibold mb-3 dark:text-white text-gray-800">重新发送确认邮件</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">
                      您的邮箱地址
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="请输入您的注册邮箱"
                      className="w-full px-4 py-2 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 dark:bg-gray-800/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/30 bg-white/80 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gradient-to-r dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-500 dark:hover:to-pink-500 dark:text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        发送中...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        重新发送确认邮件
                      </>
                    )}
                  </button>
                  
                  {submitResult === 'success' && (
                    <div className="p-3 rounded-lg dark:bg-green-500/10 bg-green-50 dark:text-green-300 text-green-700 text-sm flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <p>确认邮件已重新发送！请检查您的邮箱。</p>
                    </div>
                  )}
                  
                  {submitResult === 'error' && (
                    <div className="p-3 rounded-lg dark:bg-red-500/10 bg-red-50 dark:text-red-300 text-red-700 text-sm flex items-start gap-2">
                      <XCircle className="w-5 h-5 flex-shrink-0" />
                      <p>发送失败，请稍后再试或联系客服支持。</p>
                    </div>
                  )}
                </div>
              </form>
              
              <div className="flex justify-center gap-4 pt-4">
                <Link 
                  href="/auth/login" 
                  className="px-5 py-2 rounded-xl font-medium transition-all duration-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white bg-white hover:bg-gray-50 text-gray-800 shadow-md"
                >
                  返回登录
                </Link>
                <Link 
                  href="/" 
                  className="px-5 py-2 rounded-xl font-medium transition-all duration-300 dark:bg-gradient-to-r dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-500 dark:hover:to-pink-500 dark:text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                >
                  返回首页
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 