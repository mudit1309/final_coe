import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { PaymentStep } from "../components/PaymentStep";
import type { Plan } from "./Apply";

type LookupResult = {
  status: "payment_due" | "already_paid";
  message?: string;
  enrollment?: {
    id: number;
    name: string;
    course: string;
    plan: string | null;
    unique_id: string;
    payment_status: string;
    application_status: string;
  };
};

const PLAN_MAP: Record<string, Plan> = {
  full: { id: "full", label: "Full Upfront", price: "₹30,000" },

};

type Stage =
  | { kind: "lookup" }
  | { kind: "payment"; result: LookupResult }
  | { kind: "paid_done" };

export default function FeeLookupPage() {
  const [uniqueId, setUniqueId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>({ kind: "lookup" });

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/fee-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unique_id: uniqueId.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setStage({ kind: "payment", result: data as LookupResult });
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        documentTitle="Fee Payment"
        eyebrow="Fee Payment"
        title="Complete your course fee payment."
        subtitle="Enter your Application ID to proceed with payment. Only selected candidates can pay."
      />

      <section className="py-16">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {stage.kind === "lookup" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-brand-700">Enter Your Application ID</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Your Application ID was shown after you submitted the application form, and it is also included in your selection email.
                </p>

                <form onSubmit={handleLookup} className="mt-6">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Application ID *
                    </span>
                    <input
                      required
                      type="text"
                      value={uniqueId}
                      onChange={(e) => setUniqueId(e.target.value.toUpperCase())}
                      className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-center font-mono text-xl font-bold tracking-widest text-brand-700 shadow-sm placeholder:text-slate-300 placeholder:font-normal placeholder:text-base placeholder:tracking-normal focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                      placeholder="VZ000001"
                      maxLength={10}
                    />
                  </label>

                  {error && (
                    <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !uniqueId.trim()}
                    className="btn-primary mt-5 w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Looking up…" : "Proceed to Payment →"}
                  </button>
                </form>

                <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="font-semibold text-brand-700 mb-1">Don't have your Application ID?</div>
                  <p>
                    Check the email you received after submitting your application, or the selection email from our admissions team. If you can't find it, contact{" "}
                    <span className="font-medium text-brand-700">admissions@vizlogic.in</span>.
                  </p>
                </div>
              </div>
            )}

            {stage.kind === "payment" && stage.result.status === "already_paid" && (
              <div className="card text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-brand-700">Payment Already Verified!</h2>
                <p className="mt-2 text-slate-600">
                  {stage.result.message || "Your fee payment has been verified and you are enrolled."}
                </p>
                {stage.result.enrollment && (
                  <div className="mx-auto mt-4 max-w-xs rounded-lg bg-slate-50 p-4 text-sm text-left">
                    <div><span className="font-semibold">Name:</span> {stage.result.enrollment.name}</div>
                    <div><span className="font-semibold">Course:</span> {stage.result.enrollment.course}</div>
                    <div><span className="font-semibold">Application ID:</span> {stage.result.enrollment.unique_id}</div>
                  </div>
                )}
                <Link to="/" className="btn-primary mt-6 inline-block">Back to Home</Link>
              </div>
            )}

            {stage.kind === "payment" && stage.result.status === "payment_due" && stage.result.enrollment && (
              <div>
                <div className="mb-4 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm">
                  <div className="font-semibold text-brand-700">
                    Welcome, {stage.result.enrollment.name}!
                  </div>
                  <div className="mt-1 text-slate-600">
                    Application ID: <span className="font-mono font-bold text-brand-700">{stage.result.enrollment.unique_id}</span> &nbsp;|&nbsp;
                    Course: {stage.result.enrollment.course}
                  </div>
                </div>
                <PaymentStep
                  enrollmentId={stage.result.enrollment.id}
                  plan={PLAN_MAP[stage.result.enrollment.plan || "full"] || PLAN_MAP.full}
                  onComplete={() => setStage({ kind: "paid_done" })}
                />
              </div>
            )}

            {stage.kind === "paid_done" && (
              <div className="card text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-brand-700">Payment Details Submitted!</h2>
                <p className="mt-2 text-slate-600">
                  Your payment reference has been recorded. Our team will verify it within 24 hours and confirm your enrollment via email.
                </p>
                <Link to="/" className="btn-primary mt-6 inline-block">Back to Home</Link>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card">
              <div className="text-sm font-semibold text-accent-600">Fee Plans</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><span className="font-semibold text-brand-700">Full Upfront</span> — ₹30,000</li>
              </ul>
              <Link to="/fees" className="mt-3 block text-xs font-medium text-accent-600 hover:underline">
                View all details →
              </Link>
            </div>
            <div className="card">
              <div className="text-sm font-semibold text-accent-600">Payment Process</div>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
                <li>Enter your Application ID above.</li>
                <li>Scan the UPI QR code to pay.</li>
                <li>Enter your UPI reference / UTR number.</li>
                <li>Our team verifies within 24 hours.</li>
                <li>Enrollment confirmation sent by email.</li>
              </ol>
            </div>
            <div className="card">
              <div className="text-sm font-semibold text-accent-600">Need help?</div>
              <p className="mt-2 text-sm text-slate-600">
                Contact us at{" "}
                <span className="font-medium text-brand-700">admissions@vizlogic.in</span>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
