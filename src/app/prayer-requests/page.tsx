export default function PrayerRequestsPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Prayer Requests</h1>
        <p className="mb-6 text-slate-600">Manage and review prayer requests from your church community.</p>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Requests</h2>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              + New Request
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="font-medium text-slate-900">Healing for grandmother recovering from surgery</p>
              <p className="mt-1 text-sm text-slate-500">Submitted 2 hours ago • Family Care</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="font-medium text-slate-900">Guidance for new job opportunity</p>
              <p className="mt-1 text-sm text-slate-500">Submitted 5 hours ago • Personal Growth</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="font-medium text-slate-900">Protection for missionary trip next week</p>
              <p className="mt-1 text-sm text-slate-500">Submitted yesterday • Mission Work</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
