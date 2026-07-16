"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Missionary } from "@/types/missionary";
import {
  getMissionaries,
  addMissionary,
  addMissionariesBulk,
  toggleMissionaryActive,
  deleteMissionary,
} from "@/lib/services/missionaries";

export default function MissionariesPage() {
  const [missionaries, setMissionaries] = useState<Missionary[]>([]);
  const [search, setSearch] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadMissionaries() {
    setLoading(true);
    setError("");
    try {
      const data = await getMissionaries();
      setMissionaries(data);
    } catch (err) {
      setError("Failed to load missionaries. Check your Supabase connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMissionaries();
  }, []);

  async function handleAdd() {
    if (!fullName.trim()) return;

    setSaving(true);
    setError("");
    try {
      const newMissionary = await addMissionary(fullName.trim(), location.trim());
      setMissionaries((prev) =>
        [...prev, newMissionary].sort((a, b) =>
          a.full_name.localeCompare(b.full_name)
        )
      );
      setFullName("");
      setLocation("");
    } catch (err) {
      setError("Failed to save missionary.");
      console.error(err);
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
      setError("Paste at least one missionary.");
      setBulkSaving(false);
      return;
    }

    try {
      const missionariesToInsert = lines.map((line, index) => {
        const parts = line.split(/[,\t]+/).map((part) => part.trim());
        const fullName = parts[0] || "";
        const location = parts[1] || "";

        if (!fullName) {
          throw new Error(`Line ${index + 1}: missing full name.`);
        }

        return {
          full_name: fullName,
          location: location || null,
          active: true,
        };
      });

      const newMissionaries = await addMissionariesBulk(missionariesToInsert);
      setMissionaries((prev) =>
        [...prev, ...newMissionaries].sort((a, b) =>
          a.full_name.localeCompare(b.full_name)
        )
      );
      setBulkText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import missionaries.");
      console.error(err);
    } finally {
      setBulkSaving(false);
    }
  }

  async function handleToggleActive(id: string, active: boolean) {
    try {
      await toggleMissionaryActive(id, active);
      setMissionaries((prev) =>
        prev.map((m) => (m.id === id ? { ...m, active } : m))
      );
    } catch (err) {
      setError("Failed to update missionary.");
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMissionary(id);
      setMissionaries((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError("Failed to delete missionary.");
      console.error(err);
    }
  }

  const filtered = missionaries.filter((m) =>
    m.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">🌍 Missionaries</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 p-3">{error}</div>
      )}

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Add Missionary
        </h2>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="w-full border rounded-lg p-3 mb-3"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location / Country (optional)"
          className="w-full border rounded-lg p-3 mb-3"
        />

        <button
          onClick={handleAdd}
          disabled={saving}
          className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Missionary"}
        </button>
      </div>

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Bulk Add Missionaries (copy/paste)
        </h2>

        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder="Paste rows like: Full Name, Location"
          className="w-full min-h-[150px] border rounded-lg p-3 mb-4"
        />

        <button
          onClick={handleBulkAdd}
          disabled={bulkSaving}
          className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {bulkSaving ? "Importing..." : "Import Missionaries"}
        </button>

        <p className="mt-4 text-sm text-slate-500">
          Each row should contain a name and optional location separated by commas or tabs. Example: <strong>Jane Doe, Kenya</strong>.
        </p>
      </div>

      <div className="mt-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search missionaries..."
          className="w-full border rounded-lg p-3"
        />
      </div>

      {loading ? (
        <p className="mt-4 text-slate-500">Loading missionaries...</p>
      ) : filtered.length === 0 ? (
        <p className="mt-4 text-slate-500">No missionaries found.</p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((missionary) => (
                <tr key={missionary.id} className="border-t">
                  <td className="p-4 font-medium">{missionary.full_name}</td>
                  <td className="p-4">{missionary.location || "—"}</td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        handleToggleActive(missionary.id, !missionary.active)
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        missionary.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {missionary.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(missionary.id)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
