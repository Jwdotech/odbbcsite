"use client";

import { useState } from "react";

type MemberFormProps = {
  onAdd: (fullName: string, gender: "Male" | "Female") => void;
  saving?: boolean;
};

export function MemberForm({ onAdd, saving }: MemberFormProps) {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");

  function handleSubmit() {
    if (!fullName.trim()) return;
    onAdd(fullName.trim(), gender);
    setFullName("");
    setGender("Male");
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Add Member
      </h2>

      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
        className="w-full border rounded-lg p-3 mb-3"
      />

      <div className="flex gap-2 mb-3">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as "Male" | "Female")}
          className="flex-1 border rounded-lg p-3"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Member"}
      </button>
    </div>
  );
}
