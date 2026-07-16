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
      <main className="p-8">{children}</main>
    </div>
  );
}
