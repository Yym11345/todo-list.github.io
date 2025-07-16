import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  
  if (!data?.user) {
    redirect("/auth/login");
  }
  
  return (
    <div className="flex-1 w-full flex flex-col">
      <div className="absolute top-4 right-4 z-50">
        <LogoutButton />
          </div>
          {children}
        </div>
  );
}
