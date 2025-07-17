import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/header";
import { Suspense } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "超级Todo - 任务管理应用",
  description: "一个美观、实用的Todo任务管理应用",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen transition-all duration-500 bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-violet-900 from-blue-50 via-indigo-50 to-purple-50">
            {/* 动态背景装饰 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse dark:bg-purple-500 bg-blue-400"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-pulse delay-1000 dark:bg-pink-500 bg-indigo-400"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 animate-spin dark:bg-gradient-to-r dark:from-purple-500 dark:to-pink-500 bg-gradient-to-r from-blue-400 to-purple-400" style={{ animationDuration: '20s' }}></div>
            </div>
            
            <Header />
            <div className="pt-16">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }>
                {children}
              </Suspense>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
