import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                抱歉，出现了错误
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    错误代码: {error}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p>可能的解决方案：</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>检查网络连接</li>
                      <li>清除浏览器缓存</li>
                      <li>重新尝试登录</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  发生了未知错误，请稍后重试。
                </p>
              )}
              <div className="mt-6 flex gap-2">
                <Link 
                  href="/auth/login"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center justify-center"
                >
                  返回登录
                </Link>
                <Link 
                  href="/"
                  className="flex-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center justify-center"
                >
                  返回首页
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}