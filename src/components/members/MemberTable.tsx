"use client";

import { Member } from "@/types/member";

type MemberTableProps = {
  members: Member[];
  onToggleActive: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  onStartEdit: (member: Member) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  editingMemberId: string | null;
  editFullName: string;
  editGender: "Male" | "Female";
  onEditNameChange: (value: string) => void;
  onEditGenderChange: (value: "Male" | "Female") => void;
  editSaving: boolean;
  bulkEditMode: boolean;
  bulkEditedMembers: {
    id: string;
    full_name: string;
    gender: "Male" | "Female";
  }[];
  onBulkEditChange: (
    memberId: string,
    field: "full_name" | "gender",
    value: string
  ) => void;
  onSaveAllEdits: () => void;
  onCancelAllEdits: () => void;
  bulkSaving: boolean;
};

export function MemberTable({
  members,
  onToggleActive,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  editingMemberId,
  editFullName,
  editGender,
  onEditNameChange,
  onEditGenderChange,
  editSaving,
  bulkEditMode,
  bulkEditedMembers,
  onBulkEditChange,
  onSaveAllEdits,
  onCancelAllEdits,
  bulkSaving,
}: MemberTableProps) {
  if (members.length === 0) {
    return <p className="text-slate-500 mt-4">No members found.</p>;
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Gender</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
                      return (
              <tr key={member.id} className="border-t">
                <td className="p-4 font-medium">
                  {bulkEditMode ? (
                    <input
                      value={bulkEditedMembers.find((m) => m.id === member.id)?.full_name ?? member.full_name}
                      onChange={(e) => onBulkEditChange(member.id, "full_name", e.target.value)}
                      className="w-full rounded-lg border p-2"
                    />
                  ) : editingMemberId === member.id ? (
                    <input
                      value={editFullName}
                      onChange={(e) => onEditNameChange(e.target.value)}
                      className="w-full rounded-lg border p-2"
                    />
                  ) : (
                    member.full_name
                  )}
                </td>
                <td className="p-4">
                  {bulkEditMode ? (
                    <select
                      value={bulkEditedMembers.find((m) => m.id === member.id)?.gender ?? member.gender}
                      onChange={(e) => onBulkEditChange(member.id, "gender", e.target.value)}
                      className="rounded-lg border p-2"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : editingMemberId === member.id ? (
                    <select
                      value={editGender}
                      onChange={(e) => onEditGenderChange(e.target.value as "Male" | "Female")}
                      className="rounded-lg border p-2"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    member.gender
                  )}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onToggleActive(member.id, !member.active)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      member.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {member.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-4 space-x-2">
                  {bulkEditMode ? (
                    <button
                      disabled={bulkSaving}
                      className="rounded-lg bg-slate-300 px-3 py-1 text-sm text-slate-700"
                    >
                      Bulk edit active
                    </button>
                  ) : editingMemberId === member.id ? (
                    <>
                      <button
                        onClick={onSaveEdit}
                        disabled={editSaving}
                        className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={onCancelEdit}
                        disabled={editSaving}
                        className="rounded-lg bg-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-300 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onStartEdit(member)}
                        className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(member.id)}
                        className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
