import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative z-10 container mx-auto px-4 py-8">
      <div className="flex min-h-[80vh] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md p-6 rounded-2xl backdrop-blur-md dark:bg-white/10 bg-white/70 shadow-xl border dark:border-white/20 border-white/50">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r dark:from-purple-500 dark:to-pink-500 from-indigo-500 to-purple-500">
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                感谢您的注册！
              </h2>
              <p className="text-lg dark:text-gray-300 text-gray-600">
                请查收您的邮箱以确认账户
              </p>
            </div>
            
            <div className="w-full p-4 rounded-xl dark:bg-white/5 bg-white/50 dark:text-gray-300 text-gray-600 text-sm">
              <p className="mb-4">
                您已成功注册。请查收您的电子邮件以确认您的账户，然后再登录。
              </p>
              
              <div className="flex items-start gap-2 p-3 rounded-lg dark:bg-gray-800/50 bg-gray-100/80 mb-4">
                <AlertCircle className="w-5 h-5 dark:text-amber-400 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="dark:text-amber-300 text-amber-600 font-medium mb-1">没收到邮件？</p>
                  <ul className="list-disc list-inside space-y-1 dark:text-gray-400 text-gray-500">
                    <li>请检查您的垃圾邮件文件夹</li>
                    <li>邮件发送可能有延迟，请耐心等待几分钟</li>
                    <li>确保您输入的邮箱地址正确无误</li>
                  </ul>
                  <Link 
                    href="/auth/email-help"
                    className="inline-block mt-2 text-sm font-medium dark:text-purple-400 text-indigo-600 hover:underline"
                  >
                    查看更多帮助 →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
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
  );
}
