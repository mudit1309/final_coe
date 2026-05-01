import { useCallback, useEffect, useMemo, useState } from "react";

type Enrollment = {
  id: number;
  unique_id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  course: string;
  plan: string | null;
  notes: string | null;
  payment_status: "pending" | "verified" | "rejected";
  payment_ref: string | null;
  payment_date: string | null;
  app_fee_status: "pending" | "verified" | "rejected";
  app_fee_ref: string | null;
  app_fee_date: string | null;
  application_status:
    | "new" | "screening" | "shortlisted" | "selected" | "enrolled" | "rejected";
  created_at: string;
  updated_at: string;
};

type Partner = {
  id: number;
  name: string;
  category: "oem" | "partner";
  description: string;
  logo_url: string;
  website_url: string;
  display_order: number;
};

type EmailSettings = {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  from_email: string;
  training_start_date: string;
  selected_email_subject: string;
  selected_email_body: string;
  rejected_email_subject: string;
  rejected_email_body: string;
};

type GuestLecture = {
  id: number;
  name: string;
  phone: string;
  email: string;
  place: string;
  topic: string | null;
  created_at: string;
};

const PAYMENT_STATUSES = ["pending", "verified", "rejected"] as const;
const APP_STATUSES = [
  "new", "screening", "shortlisted", "selected", "enrolled", "rejected",
] as const;

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"enrollments" | "email" | "mailing" | "guest-lectures" | "partners">("enrollments");
  const [rows, setRows] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/enrollments", { cache: "no-store" });
      if (!res.ok) { setError("Failed to load enrollments."); return; }
      const data = await res.json();
      setRows(data.enrollments as Enrollment[]);
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function update(id: number, patch: Partial<Enrollment>) {
    const prev = rows;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    const res = await fetch(`/api/admin/enrollments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      setRows(prev);
      const data = await res.json().catch(() => ({}));
      alert(data?.error || "Failed to update");
    } else {
      const data = await res.json().catch(() => ({}));
      if (data.email_sent) {
        alert("Status updated and email sent to candidate.");
      }
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "pending" && r.payment_status !== "pending") return false;
      if (filter === "verified" && r.payment_status !== "verified") return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.payment_ref || "").toLowerCase().includes(q) ||
        (r.unique_id || "").toLowerCase().includes(q)
      );
    });
  }, [rows, filter, search]);

  const stats = useMemo(() => ({
    total: rows.length,
    pending: rows.filter((r) => r.payment_status === "pending").length,
    verified: rows.filter((r) => r.payment_status === "verified").length,
    enrolled: rows.filter((r) => r.application_status === "enrolled").length,
  }), [rows]);

  const tabs = [
    { key: "enrollments", label: "Enrollments" },
    { key: "email", label: "Email & Batch" },
    { key: "mailing", label: "Mailing List" },
    { key: "guest-lectures", label: "Guest Lectures" },
    { key: "partners", label: "OEM & Partners" },
  ] as const;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={"rounded-md px-4 py-2 text-sm font-semibold " +
              (tab === t.key ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200")}
          >
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={handleLogout}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Sign out
        </button>
      </div>

      {tab === "enrollments" ? (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total applications" value={stats.total} />
            <StatCard label="Payments pending" value={stats.pending} accent />
            <StatCard label="Payments verified" value={stats.verified} />
            <StatCard label="Enrolled" value={stats.enrolled} />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex gap-1">
              {(["all", "pending", "verified"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={"rounded-md px-3 py-1.5 text-sm font-medium " +
                    (filter === f ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200")}
                >
                  {f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, UTR, App ID"
              className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
            />
            <button
              onClick={load}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="px-4 py-3">App ID</th>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">App Fee (₹100)</th>
                    <th className="px-4 py-3">Course Fee</th>
                    <th className="px-4 py-3">Application</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td className="px-4 py-6 text-slate-500" colSpan={7}>Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td className="px-4 py-6 text-slate-500" colSpan={7}>No applications match.</td></tr>
                  ) : (
                    filtered.map((r) => (
                      <tr key={r.id} className="border-t border-slate-100 align-top">
                        <td className="px-4 py-3">
                          <div className="font-mono text-sm font-bold text-brand-700">{r.unique_id || `#${r.id}`}</div>
                          <div className="text-xs text-slate-400">#{r.id}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-brand-700">{r.name}</div>
                          <div className="text-xs text-slate-500">{r.email}</div>
                          <div className="text-xs text-slate-500">{r.phone} • {r.country}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-700">{r.course}</div>
                          <div className="text-xs text-slate-500">Plan: {r.plan || "—"}</div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge kind="payment" status={r.app_fee_status || "pending"} label="App Fee" />
                          <div className="mt-1 text-xs text-slate-500">UTR: {r.app_fee_ref || "—"}</div>
                          <div className="text-xs text-slate-500">Date: {r.app_fee_date || "—"}</div>
                          <select
                            value={r.app_fee_status || "pending"}
                            onChange={(e) =>
                              update(r.id, { app_fee_status: e.target.value as Enrollment["app_fee_status"] })
                            }
                            className="mt-2 block w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                          >
                            {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge kind="payment" status={r.payment_status} label="Course Fee" />
                          <div className="mt-1 text-xs text-slate-500">UTR: {r.payment_ref || "—"}</div>
                          <div className="text-xs text-slate-500">Date: {r.payment_date || "—"}</div>
                          <select
                            value={r.payment_status}
                            onChange={(e) =>
                              update(r.id, { payment_status: e.target.value as Enrollment["payment_status"] })
                            }
                            className="mt-2 block w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                          >
                            {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge kind="app" status={r.application_status} />
                          <select
                            value={r.application_status}
                            onChange={(e) =>
                              update(r.id, { application_status: e.target.value as Enrollment["application_status"] })
                            }
                            className="mt-2 block w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                          >
                            {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {new Date(r.created_at.replace(" ", "T") + "Z").toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : tab === "email" ? (
        <EmailSettingsPanel />
      ) : tab === "mailing" ? (
        <MailingListPanel />
      ) : tab === "guest-lectures" ? (
        <GuestLecturesPanel />
      ) : (
        <PartnersPanel />
      )}
    </div>
  );
}

/* ─── Email Settings Panel ─── */
function EmailSettingsPanel() {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/email-settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => setMsg({ type: "err", text: "Failed to load email settings" }))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/email-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const d = await res.json();
        setSettings(d.settings);
        setMsg({ type: "ok", text: "Settings saved." });
      } else {
        setMsg({ type: "err", text: "Failed to save." });
      }
    } catch { setMsg({ type: "err", text: "Network error." }); }
    finally { setSaving(false); }
  }

  function upd(key: keyof EmailSettings, val: string | number) {
    setSettings((s) => s ? { ...s, [key]: val } : s);
  }

  if (loading) return <div className="text-slate-500 py-8">Loading email settings...</div>;
  if (!settings) return <div className="text-red-600 py-8">Could not load settings.</div>;

  const daysUntil = settings.training_start_date
    ? Math.ceil((new Date(settings.training_start_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // Format for display
  const displayDate = settings.training_start_date
    ? (() => {
        const d = new Date(settings.training_start_date);
        if (isNaN(d.getTime())) return null;
        const day = String(d.getUTCDate()).padStart(2, "0");
        const month = String(d.getUTCMonth() + 1).padStart(2, "0");
        const year = d.getUTCFullYear();
        return `${day}/${month}/${year}`;
      })()
    : null;

  return (
    <div className="space-y-8">
      {msg && (
        <div className={"rounded-md border px-3 py-2 text-sm " +
          (msg.type === "ok" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700")}>
          {msg.text}
        </div>
      )}

      {/* Batch Start Date — prominent section */}
      <div className="rounded-xl border-2 border-accent-300 bg-accent-50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-brand-700">Batch Start Date</h3>
        <p className="mt-1 text-sm text-slate-600">
          This date is displayed publicly on the Admission page as <strong>"Batch starts from DD/MM/YYYY"</strong> and is included in selection emails sent to candidates.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Batch Start Date</label>
            <input
              type="date"
              value={settings.training_start_date}
              onChange={(e) => upd("training_start_date", e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>
          {displayDate && (
            <div className="rounded-md border border-accent-300 bg-white px-4 py-2 text-sm">
              <span className="text-slate-500">Shown on site:</span>{" "}
              <span className="font-semibold text-brand-700">Batch starts from {displayDate}</span>
            </div>
          )}
          {daysUntil !== null && (
            <div className="rounded-md bg-white border border-brand-200 px-4 py-2 text-sm">
              <span className="font-semibold text-brand-700">{daysUntil > 0 ? daysUntil : 0}</span>
              <span className="text-slate-600"> days from today</span>
            </div>
          )}
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-md bg-accent-500 px-5 py-2 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Batch Date"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-brand-700">SMTP Configuration</h3>
        <p className="mt-1 text-sm text-slate-500">
          For Gmail: host = <b>smtp.gmail.com</b>, port = <b>587</b>, user = your Gmail address, password = your <b>App Password</b> (16 chars from Google Account → Security → App Passwords).
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="SMTP Host" value={settings.smtp_host} onChange={(v) => upd("smtp_host", v)} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" value={String(settings.smtp_port)} onChange={(v) => upd("smtp_port", Number(v) || 587)} placeholder="587" />
          <Field label="Your Gmail Address" value={settings.smtp_user} onChange={(v) => upd("smtp_user", v)} placeholder="you@gmail.com" />
          <Field label="App Password" value={settings.smtp_pass} onChange={(v) => upd("smtp_pass", v)} placeholder="xxxx xxxx xxxx xxxx" type="password" />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-brand-700">Selected Candidate Email</h3>
        <p className="mt-1 text-sm text-slate-500">
          Sent when a candidate is marked "selected". Available placeholders:{" "}
          {["{{name}}", "{{unique_id}}", "{{training_date}}", "{{days_until}}", "{{course}}"].map((p) => (
            <code key={p} className="bg-slate-100 px-1 rounded text-xs mr-1">{p}</code>
          ))}
        </p>
        <div className="mt-4 space-y-3">
          <Field label="Subject" value={settings.selected_email_subject} onChange={(v) => upd("selected_email_subject", v)} />
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email Body</label>
            <textarea
              value={settings.selected_email_body}
              onChange={(e) => upd("selected_email_body", e.target.value)}
              rows={12}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-brand-700">Rejected Candidate Email</h3>
        <p className="mt-1 text-sm text-slate-500">
          Sent automatically when a candidate's status is changed to "rejected". Placeholders:{" "}
          <code className="bg-slate-100 px-1 rounded text-xs">{"{{name}}"}</code>{" "}
          <code className="bg-slate-100 px-1 rounded text-xs">{"{{course}}"}</code>
        </p>
        <div className="mt-4 space-y-3">
          <Field label="Subject" value={settings.rejected_email_subject} onChange={(v) => upd("rejected_email_subject", v)} />
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email Body</label>
            <textarea
              value={settings.rejected_email_body}
              onChange={(e) => upd("rejected_email_body", e.target.value)}
              rows={10}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-md bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}

/* ─── Mailing List Panel ─── */
type MailEntry = { email: string; name: string; source: "auto" | "manual"; added_at: string };

function MailingListPanel() {
  const [list, setList] = useState<MailEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [sending, setSending] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/mailing-list");
      const d = await res.json();
      setList(d.list || []);
    } catch { setMsg({ type: "err", text: "Failed to load" }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addEntry() {
    if (!newEmail.includes("@")) { setMsg({ type: "err", text: "Enter a valid email" }); return; }
    setMsg(null);
    const res = await fetch("/api/admin/mailing-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, name: newName }),
    });
    const d = await res.json();
    if (res.ok) {
      setNewEmail(""); setNewName("");
      setMsg({ type: "ok", text: "Added." });
      load();
    } else { setMsg({ type: "err", text: d.error }); }
  }

  async function removeEntry(email: string) {
    if (!confirm(`Remove ${email} from mailing list?`)) return;
    const res = await fetch("/api/admin/mailing-list", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) load();
  }

  async function sendMail(email: string, name: string) {
    setSending(email);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/mailing-list/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const d = await res.json();
      if (res.ok) setMsg({ type: "ok", text: d.message });
      else setMsg({ type: "err", text: d.error });
    } catch { setMsg({ type: "err", text: "Network error" }); }
    finally { setSending(null); }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-brand-700">Mailing List</h3>
        <p className="mt-1 text-sm text-slate-500">
          Candidates are auto-added when marked "selected". You can also add manually. Click <b>Mail</b> to send the selection email.
        </p>

        {msg && (
          <div className={"mt-3 rounded-md border px-3 py-2 text-sm " +
            (msg.type === "ok" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700")}>
            {msg.text}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <input
              value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
              placeholder="candidate@example.com"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm w-64"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Name (optional)</label>
            <input
              value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="Candidate Name"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm w-48"
            />
          </div>
          <button
            onClick={addEntry}
            className="rounded-md bg-accent-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-600"
          >
            Add to List
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Added</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-slate-500">Loading...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-slate-500">No entries yet. Candidates are auto-added when selected.</td></tr>
            ) : (
              list.map((e) => (
                <tr key={e.email} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-brand-700">{e.email}</td>
                  <td className="px-4 py-3 text-slate-600">{e.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={"inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium " +
                      (e.source === "auto" ? "bg-teal-100 text-teal-800 border-teal-200" : "bg-blue-100 text-blue-800 border-blue-200")}>
                      {e.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{e.added_at}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => sendMail(e.email, e.name)}
                        disabled={sending === e.email}
                        className="rounded-md bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                      >
                        {sending === e.email ? "Sending..." : "Mail"}
                      </button>
                      <button
                        onClick={() => removeEntry(e.email)}
                        className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && list.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
            {list.length} {list.length === 1 ? "entry" : "entries"} total
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Guest Lectures Panel ─── */
function GuestLecturesPanel() {
  const [lectures, setLectures] = useState<GuestLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guest-lectures");
      const d = await res.json();
      setLectures(d.lectures || []);
    } catch { setMsg({ type: "err", text: "Failed to load guest lecture submissions" }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(id: number, name: string) {
    if (!confirm(`Remove submission from ${name}?`)) return;
    const res = await fetch(`/api/admin/guest-lectures/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMsg({ type: "ok", text: "Removed." });
      load();
    } else {
      setMsg({ type: "err", text: "Failed to remove." });
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-brand-700">Guest Lecture Submissions</h3>
            <p className="mt-1 text-sm text-slate-500">
              Teachers and professionals who expressed interest in giving a guest lecture via the floating widget on the site.
            </p>
          </div>
          <button
            onClick={load}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        {msg && (
          <div className={"mt-3 rounded-md border px-3 py-2 text-sm " +
            (msg.type === "ok" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700")}>
            {msg.text}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name / Contact</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Topic / Expertise</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-slate-500">Loading...</td></tr>
            ) : lectures.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-slate-500">
                No submissions yet. The floating "Give a Guest Lecture" button on the site collects these.
              </td></tr>
            ) : (
              lectures.map((l) => (
                <tr key={l.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">#{l.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-brand-700">{l.name}</div>
                    <div className="text-xs text-slate-500">{l.email}</div>
                    <div className="text-xs text-slate-500">{l.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{l.place}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{l.topic || <span className="text-slate-400">—</span>}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{l.created_at}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(l.id, l.name)}
                      className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && lectures.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
            {lectures.length} {lectures.length === 1 ? "submission" : "submissions"} total
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── OEM & Partners Panel ─── */
function PartnersPanel() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState<Omit<Partner, "id">>({
    name: "", category: "partner", description: "", logo_url: "", website_url: "", display_order: 99,
  });
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/partners");
      const d = await res.json();
      setPartners(d.partners || []);
    } catch { setMsg({ type: "err", text: "Failed to load" }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function startAdd() {
    setEditing(null);
    setForm({ name: "", category: "partner", description: "", logo_url: "", website_url: "", display_order: 99 });
    setShowForm(true);
  }

  function startEdit(p: Partner) {
    setEditing(p);
    setForm({ name: p.name, category: p.category, description: p.description, logo_url: p.logo_url, website_url: p.website_url, display_order: p.display_order });
    setShowForm(true);
  }

  async function save() {
    setMsg(null);
    if (!form.name.trim()) { setMsg({ type: "err", text: "Name is required." }); return; }
    try {
      const url = editing ? `/api/admin/partners/${editing.id}` : "/api/admin/partners";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) { setMsg({ type: "err", text: d.error || "Failed to save." }); return; }
      setMsg({ type: "ok", text: editing ? "Updated." : "Added." });
      setShowForm(false);
      load();
    } catch { setMsg({ type: "err", text: "Network error." }); }
  }

  async function remove(id: number, name: string) {
    if (!confirm(`Delete partner "${name}"?`)) return;
    const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "ok", text: "Deleted." }); load(); }
    else setMsg({ type: "err", text: "Failed to delete." });
  }

  const upd = (key: keyof typeof form, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-brand-700">OEM & Partners</h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage OEM manufacturers and industry partners displayed on the public OEM & Partners page.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Refresh</button>
            <button onClick={startAdd} className="rounded-md bg-accent-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-accent-600">+ Add Partner</button>
          </div>
        </div>

        {msg && (
          <div className={"mt-3 rounded-md border px-3 py-2 text-sm " +
            (msg.type === "ok" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700")}>
            {msg.text}
          </div>
        )}

        {showForm && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
            <h4 className="font-semibold text-brand-700">{editing ? "Edit Partner" : "Add New Partner"}</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name *" value={form.name} onChange={(v) => upd("name", v)} placeholder="e.g. Honeywell" />
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => upd("category", e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                >
                  <option value="oem">OEM (Manufacturer)</option>
                  <option value="partner">Partner (Channel / Industry)</option>
                </select>
              </div>
              <Field label="Logo URL" value={form.logo_url} onChange={(v) => upd("logo_url", v)} placeholder="https://example.com/logo.png" />
              <Field label="Website URL" value={form.website_url} onChange={(v) => upd("website_url", v)} placeholder="https://example.com" />
              <Field label="Display Order (lower = first)" value={String(form.display_order)} onChange={(v) => upd("display_order", Number(v) || 99)} placeholder="99" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => upd("description", e.target.value)}
                rows={2}
                placeholder="Brief description of this company…"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={save} className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                {editing ? "Save Changes" : "Add Partner"}
              </button>
              <button onClick={() => setShowForm(false)} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Links</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-slate-500">Loading...</td></tr>
            ) : partners.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-slate-500">No partners yet. Click "+ Add Partner" to get started.</td></tr>
            ) : (
              [...partners].sort((a, b) => a.display_order - b.display_order).map((p) => (
                <tr key={p.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 text-center text-sm font-mono text-slate-500">{p.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-brand-700">{p.name}</div>
                    {p.logo_url && <div className="mt-1 text-xs text-slate-400 truncate max-w-[140px]">{p.logo_url}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${
                      p.category === "oem"
                        ? "border-accent-200 bg-accent-50 text-accent-700"
                        : "border-brand-200 bg-brand-50 text-brand-600"
                    }`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[200px]">{p.description || <span className="text-slate-400">—</span>}</td>
                  <td className="px-4 py-3 text-xs">
                    {p.website_url ? (
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-accent-600 hover:underline">Website ↗</a>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(p)} className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">Edit</button>
                      <button onClick={() => remove(p.id, p.name)} className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && partners.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
            {partners.length} {partners.length === 1 ? "entry" : "entries"} total
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Reusable pieces ─── */
function Field({ label, value, onChange, placeholder, type }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        type={type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
      />
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={"rounded-xl border bg-white p-5 shadow-sm " +
      (accent ? "border-accent-300 ring-1 ring-accent-200" : "border-slate-200")}>
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-brand-700">{value}</div>
    </div>
  );
}

function StatusBadge({ kind, status, label }: { kind: "payment" | "app"; status: string; label?: string }) {
  const palette: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    verified: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    new: "bg-slate-100 text-slate-700 border-slate-200",
    screening: "bg-blue-100 text-blue-800 border-blue-200",
    shortlisted: "bg-indigo-100 text-indigo-800 border-indigo-200",
    selected: "bg-teal-100 text-teal-800 border-teal-200",
    enrolled: "bg-green-100 text-green-800 border-green-200",
  };
  const prefix = label ? label + ": " : kind === "payment" ? "Payment: " : "App: ";
  return (
    <span className={"inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize " +
      (palette[status] || "bg-slate-100 text-slate-700 border-slate-200")}>
      {prefix}{status}
    </span>
  );
}
