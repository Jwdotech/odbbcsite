"use client";

export default function Header() {
  return (
    <header className="bg-white border-b p-5 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome to ODBBC
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold">Administrator</p>
        <p className="text-sm text-gray-500">Church Admin</p>
      </div>
    </header>
  );
}