"use client";

type MemberSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MemberSearch({ value, onChange }: MemberSearchProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search members..."
      className="w-full border rounded-lg p-3"
    />
  );
}
