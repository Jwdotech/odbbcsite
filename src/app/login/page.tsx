export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          ODBBC
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Church Administration System
        </p>

        <div className="mt-8">

          <label className="block mb-2 font-semibold">
            Username
          </label>

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Enter username"
          />

        </div>

        <div className="mt-5">

          <label className="block mb-2 font-semibold">
            Password
          </label>

          <input
            type="password"
            className="w-full border rounded-lg p-3"
            placeholder="Enter password"
          />

        </div>

        <button
          className="mt-8 w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-bold"
        >
          Login
        </button>

      </div>
    </div>
  );
}