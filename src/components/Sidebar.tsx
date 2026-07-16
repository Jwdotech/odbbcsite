"use client";

import Link from "next/link";

const menu = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Prayer Requests", href: "/prayer-requests" },
  { name: "Members", href: "/members" },
  { name: "Missionaries", href: "/missionaries" },
  { name: "Activities", href: "/activities" },
  { name: "History", href: "/history" },
  { name: "Settings", href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-full md:w-64 md:min-h-screen bg-blue-700 text-white flex flex-col">
      <div className="md:hidden sticky top-0 z-40 border-b border-blue-600 bg-blue-700/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">ODBBC</h1>
        </div>
        <div className="flex gap-2 px-3 pb-3 overflow-x-auto scrollbar-none">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-blue-500"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden md:block p-6 border-b border-blue-600">
        <h1 className="text-2xl font-bold">ODBBC</h1>
      </div>

      <nav className="hidden md:flex flex-1 flex-col p-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-4 py-3 hover:bg-blue-600 transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>

    </aside>
  );
}