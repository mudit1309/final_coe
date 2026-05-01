import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const APP_FEE_UPI_URL =
  "upi://pay?pa=vizlo59196.ibz@icici&pn=Vizlogic%20COE&am=100.00&cu=INR&tn=Application%20Fee";

const COURSES = [
  "V-CSAP (Full Program)",
  "Foundation Module Only",
  "Technical Training Only",
  "Implementation Specialist Track",
];

const COUNTRIES = [
  "India", "United States", "United Kingdom", "United Arab Emirates",
  "Singapore", "Canada", "Australia", "Other",
];

type OTPState = {
  sent: boolean; code: string; verified: boolean;
  loading: boolean; error: string | null; token: string | null;
};
function initOTP(): OTPState {
  return { sent: false, code: "", verified: false, loading: false, error: null, token: null };
}

type Stage = "form" | "fee";

export function ApplyForm({
  onSubmitted,
}: {
  onSubmitted: (id: number, uniqueId: string) => void;
}) {
  const [stage, setStage] = useState<Stage>("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneOTP, setPhoneOTP] = useState<OTPState>(initOTP());
  const [emailOTP, setEmailOTP] = useState<OTPState>(initOTP());

  // ₹100 form fee fields
  const [appFeeRef, setAppFeeRef] = useState("");
  const [appFeeDate, setAppFeeDate] = useState("");

  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    country: "India", course: COURSES[0], notes: "",
  });

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "phone") setPhoneOTP(initOTP());
    if (k === "email") setEmailOTP(initOTP());
  }

  async function sendOTP(type: "phone" | "email") {
    const identifier = type === "phone" ? form.phone.trim() : form.email.trim();
    if (!identifier) return;
    const setter = type === "phone" ? setPhoneOTP : setEmailOTP;
    setter((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`/api/otp/send-${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(type === "phone" ? { phone: identifier } : { email: identifier }),
      });
      const data = await res.json();
      if (!res.ok) setter((s) => ({ ...s, loading: false, error: data.error || "Failed to send OTP." }));
      else setter((s) => ({ ...s, loading: false, sent: true, error: null }));
    } catch {
      setter((s) => ({ ...s, loading: false, error: "Network error. Please try again." }));
    }
  }

  async function verifyOTP(type: "phone" | "email") {
    const identifier = type === "phone" ? form.phone.trim() : form.email.trim();
    const otp = type === "phone" ? phoneOTP : emailOTP;
    const setter = type === "phone" ? setPhoneOTP : setEmailOTP;
    if (!otp.code || otp.code.length !== 6) { setter((s) => ({ ...s, error: "Enter the 6-digit OTP." })); return; }
    setter((s) => ({ ...s, loading: true, error: null }));
    try {
      const body = type === "phone" ? { phone: identifier, code: otp.code } : { email: identifier, code: otp.code };
      const res = await fetch(`/api/otp/verify-${type}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) setter((s) => ({ ...s, loading: false, error: data.error || "Incorrect OTP." }));
      else setter((s) => ({ ...s, loading: false, verified: true, token: data.token, error: null }));
    } catch {
      setter((s) => ({ ...s, loading: false, error: "Network error. Please try again." }));
    }
  }

  const bothVerified = phoneOTP.verified && emailOTP.verified;

  function proceedToFee(e: React.FormEvent) {
    e.preventDefault();
    if (!bothVerified) {
      setError("Please verify both your phone number and email address before proceeding.");
      return;
    }
    setError(null);
    setStage("fee");
  }

  async function onSubmitWithFee(e: React.FormEvent) {
    e.preventDefault();
    if (!appFeeRef.trim() || appFeeRef.trim().length < 4) {
      setError("Please enter a valid UTR/reference number (min 4 characters).");
      return;
    }
    if (!appFeeDate) { setError("Please enter the date of payment."); return; }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          plan: null,
          phone_otp_token: phoneOTP.token,
          email_otp_token: emailOTP.token,
          app_fee_ref: appFeeRef.trim(),
          app_fee_date: appFeeDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data?.error || "Something went wrong. Please try again."); return; }
      onSubmitted(Number(data.id), String(data.unique_id || ""));
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Stage: Application Details Form ── */
  if (stage === "form") {
    return (
      <form
        onSubmit={proceedToFee}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <h2 className="text-xl font-bold text-brand-700">Application Form</h2>
        <p className="mt-1 text-sm text-slate-500">All fields marked * are required.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Full name *">
            <input required type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
              className={inputCls} placeholder="Priya Sharma" maxLength={120} />
          </Field>

          {/* Phone + OTP */}
          <Field label="Phone *">
            <div className="flex gap-2">
              <input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                className={inputCls + " flex-1"} placeholder="+91 98xxxxxxxx" disabled={phoneOTP.verified} />
              {!phoneOTP.verified ? (
                <button type="button" onClick={() => sendOTP("phone")}
                  disabled={phoneOTP.loading || !form.phone.trim()}
                  className="flex-shrink-0 rounded-md bg-brand-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
                  {phoneOTP.loading && !phoneOTP.sent ? "Sending…" : phoneOTP.sent ? "Resend" : "Send OTP"}
                </button>
              ) : <VerifiedBadge />}
            </div>
            {phoneOTP.sent && !phoneOTP.verified && (
              <>
                <div className="mt-2 flex gap-2">
                  <input type="text" inputMode="numeric" maxLength={6} value={phoneOTP.code}
                    onChange={(e) => setPhoneOTP((s) => ({ ...s, code: e.target.value.replace(/\D/g, "") }))}
                    className={inputCls + " flex-1"} placeholder="6-digit OTP" />
                  <button type="button" onClick={() => verifyOTP("phone")} disabled={phoneOTP.loading}
                    className="flex-shrink-0 rounded-md bg-accent-500 px-3 py-2.5 text-xs font-semibold text-white hover:bg-accent-600 disabled:opacity-50">
                    {phoneOTP.loading ? "…" : "Verify"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">OTP sent. Valid for 10 minutes.</p>
              </>
            )}
            {phoneOTP.error && <p className="mt-1 text-xs text-red-600">{phoneOTP.error}</p>}
          </Field>

          {/* Email + OTP */}
          <Field label="Email *">
            <div className="flex gap-2">
              <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                className={inputCls + " flex-1"} placeholder="you@example.com" maxLength={200} disabled={emailOTP.verified} />
              {!emailOTP.verified ? (
                <button type="button" onClick={() => sendOTP("email")}
                  disabled={emailOTP.loading || !form.email.trim()}
                  className="flex-shrink-0 rounded-md bg-brand-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
                  {emailOTP.loading && !emailOTP.sent ? "Sending…" : emailOTP.sent ? "Resend" : "Send OTP"}
                </button>
              ) : <VerifiedBadge />}
            </div>
            {emailOTP.sent && !emailOTP.verified && (
              <>
                <div className="mt-2 flex gap-2">
                  <input type="text" inputMode="numeric" maxLength={6} value={emailOTP.code}
                    onChange={(e) => setEmailOTP((s) => ({ ...s, code: e.target.value.replace(/\D/g, "") }))}
                    className={inputCls + " flex-1"} placeholder="6-digit OTP" />
                  <button type="button" onClick={() => verifyOTP("email")} disabled={emailOTP.loading}
                    className="flex-shrink-0 rounded-md bg-accent-500 px-3 py-2.5 text-xs font-semibold text-white hover:bg-accent-600 disabled:opacity-50">
                    {emailOTP.loading ? "…" : "Verify"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">Check your inbox (and spam folder).</p>
              </>
            )}
            {emailOTP.error && <p className="mt-1 text-xs text-red-600">{emailOTP.error}</p>}
          </Field>

          <Field label="Country *">
            <select value={form.country} onChange={(e) => update("country", e.target.value)} className={inputCls}>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Course *" className="sm:col-span-2">
            <select value={form.course} onChange={(e) => update("course", e.target.value)} className={inputCls}>
              {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Notes (optional)" className="sm:col-span-2">
            <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)}
              className={inputCls} rows={3} placeholder="Anything you'd like the admissions team to know?" maxLength={1000} />
          </Field>
        </div>

        {!bothVerified && (
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Please verify your phone number and email via OTP to proceed.
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <button type="submit" disabled={!bothVerified}
          className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60">
          Proceed to Application Fee →
        </button>
        <p className="mt-3 text-center text-[11px] text-slate-500">
          A ₹100 application fee is required to submit. Course fee is paid only after selection.
        </p>
      </form>
    );
  }

  /* ── Stage: ₹100 Application Fee Payment ── */
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <button onClick={() => { setStage("form"); setError(null); }}
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back to form
      </button>

      <h2 className="text-xl font-bold text-brand-700">Application Fee — ₹100</h2>
      <p className="mt-2 text-sm text-slate-600">
        A one-time, non-refundable application processing fee of <strong>₹100</strong> is required to complete your application.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {/* QR */}
        <div>
          <div className="text-sm font-semibold text-brand-700 mb-3">Scan & Pay ₹100</div>
          <div className="flex justify-center rounded-lg border border-slate-200 bg-slate-50 p-4">
            <QRCodeSVG
              value={APP_FEE_UPI_URL}
              size={200}
              level="M"
              bgColor="#ffffff"
              fgColor="#0b1437"
            />
          </div>
          <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-1.5">
            Amount is pre-filled as <strong>₹100</strong> — do not change it in your UPI app.
          </p>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <div><span className="text-slate-500">UPI ID: </span><span className="font-mono font-semibold text-brand-700">vizlo59196.ibz@icici</span></div>
            <div><span className="text-slate-500">Payee: </span><span className="font-semibold text-brand-700">Vizlogic COE</span></div>
            <div><span className="text-slate-500">Amount: </span><span className="font-semibold text-brand-700">₹100</span></div>
          </div>
        </div>

        {/* UTR + Date */}
        <form onSubmit={onSubmitWithFee} className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            After paying ₹100, enter the payment details below to submit your application.
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              UPI Reference / UTR *
            </span>
            <input required type="text" value={appFeeRef}
              onChange={(e) => setAppFeeRef(e.target.value)}
              className={inputCls + " mt-1.5"} placeholder="e.g. 402512345678" maxLength={80} />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Date of Payment *
            </span>
            <input required type="date" value={appFeeDate}
              onChange={(e) => setAppFeeDate(e.target.value)}
              className={inputCls + " mt-1.5"}
              max={new Date().toISOString().split("T")[0]} />
          </label>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <button type="submit" disabled={submitting}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Submitting Application…" : "Submit Application →"}
          </button>
          <p className="text-center text-[11px] text-slate-500">
            By submitting, you agree to Vizlogic's admission terms.
          </p>
        </form>
      </div>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  );
}


const inputCls =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={"block " + className}>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
