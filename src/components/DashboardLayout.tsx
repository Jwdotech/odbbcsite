"use client";

import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
