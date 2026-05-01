import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";

type Enrollment = {
  unique_id: string;
  name: string;
  course: string;
  plan: string | null;
  application_status: string;
  payment_status: string;
  app_fee_status: string;
  created_at: string;
};

type Stage = "phone" | "otp" | "status";

const APP_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Under Review", color: "bg-slate-100 text-slate-700 border-slate-200" },
  screening: { label: "Screening", color: "bg-blue-100 text-blue-800 border-blue-200" },
  shortlisted: { label: "Shortlisted", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  selected: { label: "Selected ✓", color: "bg-teal-100 text-teal-800 border-teal-200" },
  enrolled: { label: "Enrolled ✓", color: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "Not Progressed", color: "bg-red-100 text-red-800 border-red-200" },
};

const PAYMENT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending Verification", color: "bg-amber-100 text-amber-800 border-amber-200" },
  verified: { label: "Verified ✓", color: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
};

const SESSION_KEY = "vz_candidate_session";

function loadSession(): { phone: string; token: string } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(phone: string, token: string) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ phone, token }));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export default function MyApplicationPage() {
  const [stage, setStage] = useState<Stage>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const session = loadSession();
    if (!session) return;
    setPhone(session.phone);
    setLoading(true);
    fetch("/api/candidate/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: session.phone, token: session.token }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.enrollment) {
          setEnrollment(d.enrollment);
          setStage("status");
        } else {
          clearSession();
        }
      })
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, []);

  async function sendOtp() {
    const p = phone.trim();
    if (!p) { setError("Please enter your registered phone number."); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/candidate/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: p }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Could not send OTP."); return; }
      setOtpSent(true);
      setStage("otp");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  async function verifyOtp() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/candidate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code: otp.trim() }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Verification failed."); return; }
      saveSession(phone.trim(), d.token);
      setEnrollment(d.enrollment);
      setStage("status");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  function logout() {
    clearSession();
    setStage("phone");
    setPhone("");
    setOtp("");
    setEnrollment(null);
    setError(null);
    setOtpSent(false);
  }

  return (
    <div>
      <PageHeader
        documentTitle="My Application"
        eyebrow="Candidate Portal"
        title="Check your application status"
        subtitle="Log in with your registered phone number to see where your application stands."
      />

      <section className="py-16">
        <div className="container-page max-w-lg mx-auto">
          {stage === "phone" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold text-brand-700">Login with Phone OTP</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the phone number you used when applying. We'll send a one-time code.
              </p>

              {error && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Registered Phone Number
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                  />
                </label>
                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending OTP…" : "Send OTP →"}
                </button>
              </div>
            </div>
          )}

          {stage === "otp" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold text-brand-700">Enter OTP</h2>
              <p className="mt-1 text-sm text-slate-500">
                A 6-digit code was sent to <span className="font-semibold text-brand-700">{phone}</span>.
                {" "}Check your SMS or email.
              </p>

              {error && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    6-Digit OTP
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-center text-xl font-mono font-bold tracking-[0.5em] text-slate-800 shadow-sm placeholder:text-slate-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                  />
                </label>
                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Verifying…" : "Verify & View Status →"}
                </button>
                <button
                  onClick={() => { setStage("phone"); setError(null); setOtp(""); }}
                  className="w-full text-center text-sm text-slate-500 hover:text-brand-600"
                >
                  ← Change phone number
                </button>
                {otpSent && (
                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full text-center text-sm text-accent-600 hover:text-accent-700"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {stage === "status" && enrollment && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent-600">Application Status</div>
                    <h2 className="mt-1 text-xl font-bold text-brand-700">{enrollment.name}</h2>
                    <div className="mt-0.5 text-sm text-slate-500">{enrollment.course}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-brand-700">{enrollment.unique_id}</div>
                    <div className="text-xs text-slate-400">Application ID</div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <StatusRow
                    label="Application"
                    status={enrollment.application_status}
                    map={APP_STATUS_LABELS}
                  />
                  <StatusRow
                    label="Application Fee (₹100)"
                    status={enrollment.app_fee_status}
                    map={PAYMENT_STATUS_LABELS}
                  />
                  <StatusRow
                    label="Course Fee"
                    status={enrollment.payment_status}
                    map={PAYMENT_STATUS_LABELS}
                  />
                </div>

                {(enrollment.application_status === "selected" || enrollment.application_status === "enrolled") &&
                  enrollment.payment_status === "pending" && (
                    <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-4">
                      <div className="text-sm font-semibold text-teal-800">Congratulations — you've been selected!</div>
                      <p className="mt-1 text-sm text-teal-700">
                        Please complete your course fee payment to secure your seat.
                        Use your Application ID <strong>{enrollment.unique_id}</strong> on the fee payment page.
                      </p>
                      <a
                        href="/fee-payment"
                        className="mt-3 inline-block rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                      >
                        Pay Course Fee →
                      </a>
                    </div>
                  )}

                <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
                  Applied: {new Date(enrollment.created_at.replace(" ", "T") + "Z").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Sign out
              </button>
            </div>
          )}

          {loading && stage === "phone" && (
            <div className="mt-4 text-center text-sm text-slate-500">Checking session…</div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusRow({
  label, status, map,
}: {
  label: string;
  status: string;
  map: Record<string, { label: string; color: string }>;
}) {
  const entry = map[status] || { label: status, color: "bg-slate-100 text-slate-700 border-slate-200" };
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-semibold ${entry.color}`}>
        {entry.label}
      </span>
    </div>
  );
}
