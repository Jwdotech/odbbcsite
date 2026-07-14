export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-6 shadow">
        <h1 className="text-3xl font-bold">🙏 Prayer Request Manager</h1>
        <p className="mt-1 text-sm">AI Powered Church Prayer Management System</p>
      </header>

      <div className="mx-auto max-w-7xl p-8">
        <h2 className="mb-6 text-2xl font-bold">Dashboard</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-xl font-semibold">👥 Members</h3>
            <p className="mt-2 text-gray-500">Manage church members.</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-xl font-semibold">🙏 Prayer Requests</h3>
            <p className="mt-2 text-gray-500">Paste Messenger prayer requests.</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-xl font-semibold">🌍 Missionaries</h3>
            <p className="mt-2 text-gray-500">Manage missionaries list.</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-xl font-semibold">📄 Generate PDF</h3>
            <p className="mt-2 text-gray-500">Generate the prayer booklet.</p>
          </div>
        </div>

        <div className="mt-10">
          <button className="rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white hover:bg-green-700">
            🚀 GO PRAY
          </button>
        </div>
      </div>
    </main>
  );
}
