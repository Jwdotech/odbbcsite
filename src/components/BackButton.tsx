"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="fixed top-0 left-0 right-0 z-50 mx-auto flex h-12 w-full max-w-full items-center justify-center border-b border-slate-200/50 bg-white/80 px-3 shadow-sm backdrop-blur-sm transition hover:bg-white/90 dark:border-slate-700/50 dark:bg-slate-950/85 dark:text-white dark:hover:bg-slate-900/90"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <ArrowLeft className="h-4 w-4" />
        Back
      </div>
    </button>
  );
}
