import { useEffect, useState } from "react";
import { AdminLogin } from "../components/AdminLogin";
import { AdminDashboard } from "../components/AdminDashboard";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    document.title = "Admin | Vizlogic COE";
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch("/api/admin/enrollments", { cache: "no-store" });
      setAuthed(res.status !== 401);
    } catch {
      setAuthed(false);
    }
  }

  return (
    <div className="bg-slate-50 py-10">
      <div className="container-page">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-700">Vizshila Admin</h1>
            <p className="text-sm text-slate-500">
              Review applications and verify payments.
            </p>
          </div>
        </div>
        {authed === null ? (
          <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            Loading...
          </div>
        ) : authed ? (
          <AdminDashboard onLogout={() => setAuthed(false)} />
        ) : (
          <AdminLogin onSuccess={() => setAuthed(true)} />
        )}
      </div>
    </div>
  );
}
