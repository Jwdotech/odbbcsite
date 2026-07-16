"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { BackButton } from "@/components/BackButton";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBackButton = pathname !== "/login" && pathname !== "/dashboard";

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-100">
      {showBackButton && <BackButton />}
      <Sidebar />
      <main className={`flex-1 ${showBackButton ? "pt-16" : ""}`}>{children}</main>
    </div>
  );
}
