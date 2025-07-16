"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // 避免水合作用不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <button
      onClick={logout}
      className={`px-5 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
        isDark
          ? 'bg-gray-800 hover:bg-gray-700 text-white'
          : 'bg-white hover:bg-gray-50 text-gray-800 shadow-md'
      }`}
    >
      <LogOut className="w-4 h-4" />
      退出登录
    </button>
  );
}
