"use client";

import Link from "next/link";

const menu = [
  { name: "Dashboard", href: "/dashboard", icon: "🏠" },
  { name: "Prayer Requests", href: "/prayer-requests", icon: "🙏" },
  { name: "Members", href: "/members", icon: "👥" },
  { name: "Missionaries", href: "/missionaries", icon: "🌍" },
  { name: "Activities", href: "/activities", icon: "📅" },
  { name: "History", href: "/history", icon: "📖" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  return (
    <aside className="w-full md:w-64 min-h-screen bg-blue-700 text-white flex flex-col">
      <div className="p-6 border-b border-blue-600">
        <h1 className="text-2xl font-bold">🙏 Prayer Request Manager</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-4 py-3 hover:bg-blue-600 transition"
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4">
        <button className="w-full rounded-lg bg-green-600 py-3 font-bold hover:bg-green-700">
          🚀 GO PRAY
        </button>
      </div>
    </aside>
  );
}