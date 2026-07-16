"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Member } from "@/types/member";
import {
  getMembers,
  addMember,
  addMembersBulk,
  toggleMemberActive,
  deleteMember,
  updateMember,
  deleteAllMembers,
} from "@/lib/services/members";
import { MemberForm } from "@/components/members/MemberForm";
import { MemberSearch } from "@/components/members/MemberSearch";
import { MemberTable } from "@/components/members/MemberTable";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editGender, setEditGender] = useState<"Male" | "Female">("Male");
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkEditedMembers, setBulkEditedMembers] = useState<{
    id: string;
    full_name: string;
    gender: "Male" | "Female";
  }[]>([]);
  const [error, setError] = useState("");

  async function loadMembers() {
    setLoading(true);
    setError("");
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (err) {
      setError("Failed to load members. Check your Supabase connection.");
      console.error("Error loading members:", err instanceof Error ? err.message : JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMembers();
  }, []);

  async function handleAdd(fullName: string, gender: "Male" | "Female") {
    setSaving(true);
    setError("");
    try {
      const newMember = await addMember(fullName, gender);
      setMembers((prev) =>
        [...prev, newMember].sort((a, b) =>
          a.full_name.localeCompare(b.full_name)
        )
      );
    } catch (err) {
      setError("Failed to save member.");
      console.error("Error adding member:", err instanceof Error ? err.message : JSON.stringify(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleBulkAdd() {
    setBulkSaving(true);
    setError("");

    const lines = bulkText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setError("Paste at least one member line.");
      setBulkSaving(false);
      return;
    }

    try {
      const membersToInsert: { full_name: string; gender: "Male" | "Female" }[] = lines.map((line, index) => {
        const parts = line.split(/[,\t]+/).map((part) => part.trim());
        const fullName = parts[0] || "";
        const rawGender = (parts[1] || "Bro").trim().toLowerCase();

        if (!fullName) {
          throw new Error(`Line ${index + 1}: missing full name.`);
        }

        if (!["bro", "sister", "male", "female"].includes(rawGender)) {
          throw new Error(
            `Line ${index + 1}: gender must be Bro, Sister, Male, or Female.`
          );
        }

        const gender = rawGender === "sister" || rawGender === "female" ? "Female" : "Male";

        return {
          full_name: fullName,
          gender,
        };
      });

      const newMembers = await addMembersBulk(membersToInsert);
      setMembers((prev) =>
        [...prev, ...newMembers].sort((a, b) => a.full_name.localeCompare(b.full_name))
      );
      setBulkText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import members.");
      console.error("Error importing members:", err instanceof Error ? err.message : JSON.stringify(err));
    } finally {
      setBulkSaving(false);
    }
  }

  async function handleToggleActive(id: string, active: boolean) {
    setError("");
    try {
      await toggleMemberActive(id, active);
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, active } : m))
      );
    } catch (err) {
      setError("Failed to update member.");
      console.error("Error toggling member active:", err instanceof Error ? err.message : JSON.stringify(err));
    }
  }

  async function handleDelete(id: string) {
    setError("");
    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError("Failed to delete member.");
      console.error("Error deleting member:", err instanceof Error ? err.message : JSON.stringify(err));
    }
  }

  function startBulkEdit() {
    setBulkEditMode(true);
    setBulkEditedMembers(
      filteredMembers.map((member) => ({
        id: member.id,
        full_name: member.full_name,
        gender: member.gender,
      }))
    );
    setError("");
  }

  function cancelBulkEdit() {
    setBulkEditMode(false);
    setBulkEditedMembers([]);
    setError("");
  }

  function handleBulkMemberChange(
    memberId: string,
    field: "full_name" | "gender",
    value: string
  ) {
    setBulkEditedMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? { ...member, [field]: value } as typeof member
          : member
      )
    );
  }

  async function handleSaveAllEdits() {
    if (bulkEditedMembers.length === 0) return;

    setEditSaving(true);
    setError("");

    try {
      const updatedMembers = await Promise.all(
        bulkEditedMembers.map(async (edited) => {
          const existing = members.find((member) => member.id === edited.id);
          if (!existing) return null;
          if (
            existing.full_name === edited.full_name &&
            existing.gender === edited.gender
          ) {
            return existing;
          }
          return await updateMember(edited.id, edited.full_name, edited.gender);
        })
      );

      setMembers((prev) =>
        prev
          .map((member) => {
            const updated = updatedMembers.find((u) => u?.id === member.id);
            return updated ?? member;
          })
          .sort((a, b) => a.full_name.localeCompare(b.full_name))
      );
      cancelBulkEdit();
    } catch (err) {
      setError("Failed to save bulk edits.");
      console.error("Error saving bulk edits:", err instanceof Error ? err.message : JSON.stringify(err));
    } finally {
      setEditSaving(false);
    }
  }

  function startEdit(member: Member) {
    setEditingMemberId(member.id);
    setEditFullName(member.full_name);
    setEditGender(member.gender);
    setError("");
  }

  function cancelEdit() {
    setEditingMemberId(null);
    setEditFullName("");
    setEditGender("Male");
  }

  async function handleSaveEdit() {
    if (!editingMemberId || !editFullName.trim()) return;

    setEditSaving(true);
    setError("");

    try {
      const updatedMember = await updateMember(
        editingMemberId,
        editFullName.trim(),
        editGender
      );

      setMembers((prev) =>
        prev
          .map((member) =>
            member.id === updatedMember.id ? updatedMember : member
          )
          .sort((a, b) => a.full_name.localeCompare(b.full_name))
      );
      cancelEdit();
    } catch (err) {
      setError("Failed to update member.");
      console.error("Error updating member:", err instanceof Error ? err.message : JSON.stringify(err));
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDeleteAll() {
    if (!confirm("Delete all members? This cannot be undone.")) {
      return;
    }

    setDeletingAll(true);
    setError("");

    try {
      await deleteAllMembers();
      setMembers([]);
      setSearch("");
    } catch (err) {
      setError("Failed to delete all members.");
      console.error("Error deleting all members:", err instanceof Error ? err.message : JSON.stringify(err));
    } finally {
      setDeletingAll(false);
    }
  }

  const filteredMembers = members.filter((m) =>
    m.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">👥 Members</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 p-3">
          {error}
        </div>
      )}

      <MemberForm onAdd={handleAdd} saving={saving} />

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Bulk Add Members (copy/paste)
        </h2>

        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder="Paste rows like: Full Name, Gender"
          className="w-full min-h-[150px] border rounded-lg p-3 mb-4"
        />

        <button
          onClick={handleBulkAdd}
          disabled={bulkSaving}
          className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {bulkSaving ? "Importing..." : "Import Members"}
        </button>

        <p className="mt-4 text-sm text-slate-500">
          Each row should contain a name and optional gender separated by commas or tabs. Example: <strong>Jane Doe, Sister</strong>.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <MemberSearch value={search} onChange={setSearch} />

        <div className="flex flex-col gap-3 sm:flex-row">
          {bulkEditMode ? (
            <>
              <button
                onClick={handleSaveAllEdits}
                disabled={editSaving}
                className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {editSaving ? "Saving all..." : "Save All Edits"}
              </button>
              <button
                onClick={cancelBulkEdit}
                className="rounded-lg bg-slate-500 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-600"
              >
                Cancel Bulk Edit
              </button>
            </>
          ) : (
            <button
              onClick={startBulkEdit}
              disabled={members.length === 0}
              className="rounded-lg bg-slate-700 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              Edit All Members
            </button>
          )}
          <button
            onClick={handleDeleteAll}
            disabled={deletingAll || members.length === 0 || bulkEditMode}
            className="rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deletingAll ? "Deleting all..." : "Delete All Members"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-slate-500">Loading members...</p>
      ) : (
        <MemberTable
          members={filteredMembers}
          onToggleActive={handleToggleActive}
          onDelete={handleDelete}
          onStartEdit={startEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={cancelEdit}
          editingMemberId={editingMemberId}
          editFullName={editFullName}
          editGender={editGender}
          onEditNameChange={setEditFullName}
          onEditGenderChange={setEditGender}
          editSaving={editSaving}
          bulkEditMode={bulkEditMode}
          bulkEditedMembers={bulkEditedMembers}
          onBulkEditChange={handleBulkMemberChange}
          onSaveAllEdits={handleSaveAllEdits}
          onCancelAllEdits={cancelBulkEdit}
          bulkSaving={editSaving}
        />
      )}
    </DashboardLayout>
  );
}
