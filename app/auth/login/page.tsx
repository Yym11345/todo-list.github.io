import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="relative z-10 container mx-auto px-4 py-8">
      <div className="flex min-h-[80vh] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm p-6 rounded-2xl backdrop-blur-md dark:bg-white/10 bg-white/70 shadow-xl border dark:border-white/20 border-white/50">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            登录账户
          </h2>
        <LoginForm />
        </div>
      </div>
    </div>
  );
}
