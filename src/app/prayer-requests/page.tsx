"use client";

import { useEffect, useState } from "react";
import { parsePrayer, ParsedPrayer } from "@/lib/ai/parser";
import { getMembers, addMembersBulk } from "@/lib/services/members";

const DEFAULT_PRAYER_ENTRY: ParsedPrayer = {
  name: "SIS. BEL",
  requests: [
    "PASTOR JOSE - Wisdom and good health in leading the church.",
    "JEZREEL & MYKA - Ibless ni Lord ang Business Morpho Cafe and Studio, at Morpho Print and Design - more customers and ibless ni Lord. Maging tapat at matatag sa paglilingkod sa Panginoon.",
    "SHEMEA BEL - Wisdom and strength sa pagtuturo sa ODCA. Ibless ang kanyang business na MIYA PASTRIES.",
    "GOD’s PROVISION - Financial needs of the family, for tuition sa pagaaral ng M.A. in Music ni Jezreel sa UST at ni Mia sa pagaaral ng M.A. in Early Childhood Education sa TSU.",
    "MAM BEL - As PSDS in Nampicuan, maging blessing sa lahat ng mga school heads and teachers. Pagiingat sa laging pagbyahe at pag attend ng seminars.",
    "LOVED ONES - Pagiingat ng Panginoon kay Kuya Jhune sa Israel, Marissa in Singapore, Ate Vilma sa London, Kuya Ferdinand and family sa US, Patricia in London and to all relatives and in-laws. Praying also for their salvation and spiritual growth.",
    "MAGING BLESSING ang LEYBAG family sa MINISTRY.",
    "Church members - maging loyal sa Panginoon at sa church.",
  ],
  isUnknown: false,
  isSymbolMarked: false,
};

export default function PrayerRequestsPage() {
  function ensureDefaultPrayerEntry(entries: ParsedPrayer[]): ParsedPrayer[] {
    const hasDefault = entries.some(
      (entry) => entry.name.toLowerCase() === DEFAULT_PRAYER_ENTRY.name.toLowerCase()
    );
    return hasDefault ? entries : [DEFAULT_PRAYER_ENTRY, ...entries];
  }

  const [input, setInput] = useState("");
  const [preview, setPreview] = useState<ParsedPrayer[]>([]);
  const [staged, setStaged] = useState<ParsedPrayer[]>(() => {
    if (typeof window === "undefined") {
      return [DEFAULT_PRAYER_ENTRY];
    }

    try {
      const saved = localStorage.getItem("prayerRequestsStaged");
      if (saved) {
        const parsed = JSON.parse(saved) as ParsedPrayer[];
        if (Array.isArray(parsed)) {
          return ensureDefaultPrayerEntry(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load staged prayer requests:", err);
    }

    return [DEFAULT_PRAYER_ENTRY];
  });
  const [result, setResult] = useState("");
  const [knownNames, setKnownNames] = useState<string[]>([]);
  const [staging, setStaging] = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);
  const [error, setError] = useState("");
  const [addingMembers, setAddingMembers] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editRequests, setEditRequests] = useState<string>("");

  async function loadMembers() {
    try {
      const members = await getMembers();
      setKnownNames(members.map((m) => m.full_name));
    } catch (err) {
      console.error("Failed to load members:", err);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMembers();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("prayerRequestsStaged", JSON.stringify(staged));
    } catch (err) {
      console.error("Failed to save staged prayer requests:", err);
    }
  }, [staged]);

  function analyze() {
    setError("");

    if (!input.trim()) {
      setResult("⚠ No prayer requests found.");
      setPreview([]);
      return;
    }

    const parsed = parsePrayer(input, knownNames);
    setPreview(parsed);

    const lines = input
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l !== "");

    let members = 0;
    let prayers = 0;

    for (const line of lines) {
      if (
        line.startsWith("Bro") ||
        line.startsWith("Sis") ||
        line.startsWith("Ptr")
      ) {
        members++;
      } else {
        prayers++;
      }
    }

    const unknownCount = parsed.filter((p) => p.isUnknown).length;

    setResult(
`🤖 AI Assistant

✔ ${members} Members Found

✔ ${prayers} Prayer Requests

${
  unknownCount > 0
    ? `⚠ ${unknownCount} Unknown Member(s)`
    : "✔ All members recognized"
}

✓ Ready to stage requests`
    );
  }

  async function autoAddUnknownMembers() {
    const unknownMembers = preview.filter((p) => p.isUnknown);

    if (unknownMembers.length === 0) {
      setError("No unknown members to add.");
      return;
    }

    setAddingMembers(true);
    setError("");

    try {
      const unknownNames = unknownMembers.map((m) => m.name);

      // Detect genders for unknown members
      const res = await fetch("/api/detect-genders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: unknownNames }),
      });

      if (!res.ok) throw new Error("Failed to detect genders");

      const data = await res.json();
      const genders = data.genders as Record<string, "Male" | "Female">;

      // Prepare members to add
      const membersToAdd = unknownNames.map((name) => ({
        full_name: name,
        gender: genders[name] ?? ("Male" as const),
      }));

      // Add members to database
      await addMembersBulk(membersToAdd);

      // Reload members list
      await loadMembers();

      // Update preview to show all as known
      const updated = preview.map((member) => ({
        ...member,
        isUnknown: false,
      }));
      setPreview(updated);

      setResult(
        `✅ Successfully added ${unknownMembers.length} new member(s) with detected genders!`
      );
    } catch (err) {
      setError(`⚠ Failed to add members: ${err instanceof Error ? err.message : "Unknown error"}`);
      console.error(err);
    } finally {
      setAddingMembers(false);
    }
  }

  function stagePreview() {
    setError("");

    if (preview.length === 0) {
      setError("Nothing to stage. Analyze prayer requests first.");
      return;
    }

    setStaging(true);
    try {
      const merged = new Map<string, ParsedPrayer>();

      staged.forEach((item) => {
        merged.set(item.name, {
          ...item,
          requests: [...item.requests],
        });
      });

      preview.forEach((item) => {
        const existing = merged.get(item.name);
        if (existing) {
          const requests = [...existing.requests];
          for (const request of item.requests) {
            if (!requests.some((r) => r.toLowerCase() === request.toLowerCase())) {
              requests.push(request);
            }
          }
          merged.set(item.name, { ...existing, requests });
        } else {
          merged.set(item.name, {
            ...item,
            requests: [...item.requests],
          });
        }
      });

      setStaged(Array.from(merged.values()));
      setPreview([]);
      setResult("");
      setInput("");
    } finally {
      setStaging(false);
    }
  }

  function getExportFileName() {
    const now = new Date();
    const dateString = now
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    return `Prayer Request (${dateString}).docx`;
  }

  async function goDocx() {
    if (staged.length === 0) return;

    setDocxLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preview: staged }),
      });

      if (!res.ok) throw new Error("Request failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getExportFileName();
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("⚠ Failed to generate DOCX.");
      console.error(err);
    } finally {
      setDocxLoading(false);
    }
  }

  function startEdit(memberName: string, requests: string[]) {
    setEditingMember(memberName);
    setEditRequests(requests.join("\n"));
  }

  function saveEdit() {
    if (!editingMember) return;

    const newRequests = editRequests
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r !== "");

    const updated = staged.map((member) =>
      member.name === editingMember
        ? { ...member, requests: newRequests }
        : member
    );

    setStaged(updated);
    setEditingMember(null);
    setEditRequests("");
  }

  function cancelEdit() {
    setEditingMember(null);
    setEditRequests("");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-8 pt-4 overflow-x-hidden sm:px-6 md:px-8">
      <div className="mx-auto w-full max-w-screen-md">
        <h1 className="text-3xl font-bold">Prayer Request Workspace</h1>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-5 rounded mb-6 break-words">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> Use <code className="bg-blue-100 px-2 py-1 rounded">@ Member Name</code> to mark the start of a member prayer request section.
            Example: <code className="bg-blue-100 px-2 py-1 rounded">@ John Smith</code> → their prayer requests follow on next lines.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
          <section className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full min-h-[260px] rounded-lg border p-4 text-sm sm:text-base break-words"
              placeholder={`Paste Messenger conversation here...

Example:
@ John Smith
- Healing prayer
- Safe travels

@ Mary Jane
- Protection for family
- Good health`}
            />

            <button
              onClick={analyze}
              className="w-full bg-blue-700 text-white px-5 py-4 rounded-lg text-sm font-medium sm:text-base"
            >
              Submit
            </button>

            {preview.some((p) => p.isUnknown) && (
              <button
                onClick={autoAddUnknownMembers}
                disabled={addingMembers}
                className="w-full bg-green-600 text-white px-5 py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition text-sm font-medium sm:text-base"
              >
                {addingMembers ? "Adding members..." : "➕ Auto-Add Unknown Members"}
              </button>
            )}

            <button
              onClick={stagePreview}
              disabled={preview.length === 0 || staging}
              className="w-full bg-slate-800 text-white px-5 py-4 rounded-lg disabled:opacity-50 text-sm font-medium sm:text-base"
            >
              {staging ? "Staging..." : "Add to Compilation"}
            </button>
          </section>

          <section className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 text-red-700 p-3 break-words">
                {error}
              </div>
            )}

            <div className="bg-white rounded-xl shadow p-5 sm:p-6 whitespace-pre-line break-words">
              {result || "Waiting for AI..."}
            </div>

            <div className="bg-white rounded-xl shadow p-5 sm:p-6 break-words">
              <h2 className="text-xl font-semibold mb-4">AI Preview</h2>
              {preview.length === 0 ? (
                <p className="text-gray-500">AI preview of the current submission will appear here.</p>
              ) : (
                preview.map((member) => (
                  <div key={member.name} className="mb-5 last:mb-0">
                    <h3
                      className={`font-bold text-lg ${member.isUnknown ? "text-red-600" : ""} break-words`}
                    >
                      {member.name}
                      {member.isUnknown && (
                        <span className="ml-2 text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          ⚠ Unknown
                        </span>
                      )}
                    </h3>
                    <ul className="list-disc ml-6 mt-2 space-y-2 break-words">
                      {member.requests.map((request, index) => (
                        <li key={index} className="break-words">{request}</li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white rounded-xl shadow p-5 sm:p-6 break-words">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Staged Compilation</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Review all staged prayer requests before going to prayer.
                  </p>
                </div>
                <button
                  onClick={() => setStaged([])}
                  disabled={staged.length === 0}
                  className="text-sm text-blue-700 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>

              {staged.length === 0 ? (
                <p className="mt-4 text-gray-500">
                  No requests staged yet. Import a parsed batch to build the compilation.
                </p>
              ) : (
                <div className="mt-4 space-y-5">
                  <p className="text-sm text-slate-600 break-words">
                    {staged.length} people staged, {staged.reduce(
                      (count, item) => count + item.requests.length,
                      0
                    )} prayer requests total.
                  </p>
                  {staged.map((member) => (
                    <div key={member.name} className="border rounded-lg p-4 bg-slate-50 break-words">
                      {editingMember === member.name ? (
                        <div>
                          <h3 className="font-semibold mb-3 break-words">{member.name}</h3>
                          <textarea
                            value={editRequests}
                            onChange={(e) => setEditRequests(e.target.value)}
                            className="w-full border rounded-lg p-3 mb-3 font-mono text-sm break-words"
                            rows={6}
                            placeholder="One prayer request per line..."
                          />
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              onClick={saveEdit}
                              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                              ✓ Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex-1 bg-slate-400 text-white px-3 py-2 rounded-lg hover:bg-slate-500 transition"
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 break-words">
                              <h3 className="font-semibold break-words">{member.name}</h3>
                              {member.isUnknown && (
                                <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                  ⚠ Unknown
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => startEdit(member.name, member.requests)}
                              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                            >
                              ✏ Edit
                            </button>
                          </div>
                          <ul className="list-disc ml-6 text-sm text-slate-700 space-y-1 break-words">
                            {member.requests.map((request, index) => (
                              <li key={index} className="break-words">{request}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={goDocx}
                disabled={staged.length === 0 || docxLoading}
                className="flex-1 bg-blue-600 text-white px-5 py-4 rounded-xl text-lg font-bold disabled:opacity-50 hover:bg-blue-700 transition"
              >
                {docxLoading ? "Generating DOCX..." : "EXPORT"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
