'use client';

import Link from "next/link";
import { Home, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // 避免水合作用不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  const isHome = pathname === '/';
  const isDark = mounted && theme === 'dark';

  return (
    <header className={`w-full py-4 px-6 ${
      isDark 
        ? 'bg-gray-900/70 text-white border-b border-white/10' 
        : 'bg-white/70 text-gray-800 border-b border-gray-200/50'
      } backdrop-blur-md fixed top-0 z-50`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!isHome && (
            <Link href="/" className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              isDark 
                ? 'bg-gray-800 text-purple-400 hover:bg-gray-700' 
                : 'bg-white text-indigo-600 hover:bg-gray-50 shadow-sm'
            }`}>
              <Home className="w-5 h-5" />
            </Link>
          )}
          <Link href="/">
            <h1 className={`text-xl font-bold bg-gradient-to-r ${
              isDark 
                ? 'from-purple-400 via-pink-400 to-indigo-400' 
                : 'from-indigo-600 via-purple-600 to-pink-600'
            } bg-clip-text text-transparent flex items-center gap-2`}>
              <Sparkles className="w-5 h-5" />
              超级Todo
            </h1>
          </Link>
        </div>
        
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
            isDark 
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
              : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
} 