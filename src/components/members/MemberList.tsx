import { Member } from "@/types/member";

type MemberListProps = {
  members: Member[];
};

export function MemberList({ members }: MemberListProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Members</h2>
      <div className="mt-4 space-y-3">
        {members.length === 0 ? (
          <p className="text-slate-500">No members found.</p>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{member.full_name}</p>
                  <p className="text-sm text-slate-500">{member.gender}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    member.active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {member.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
