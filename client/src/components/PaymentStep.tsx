import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Plan } from "../pages/Apply";

const FIXED_PLAN: Plan = { id: "full", label: "Course Fee", price: "₹30,000" };

const COURSE_FEE_UPI_URL =
  "upi://pay?pa=vizlo59196.ibz@icici&pn=Vizlogic%20COE&am=30000.00&cu=INR&tn=Course%20Fee";

export function PaymentStep({
  enrollmentId,
  onComplete,
}: {
  enrollmentId: number;
  plan?: Plan;
  onComplete: () => void;
  showPlanSelector?: boolean;
}) {
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!paymentDate) { setError("Please enter the date of payment."); return; }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: enrollmentId, paymentRef, paymentDate }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Could not record payment. Please try again.");
        return;
      }
      onComplete();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* QR Side */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Scan & Pay via UPI
          </div>
          <h2 className="mt-1 text-xl font-bold text-brand-700">Course Fee Payment</h2>
          <p className="mt-2 text-sm text-slate-600">
            Pay{" "}
            <span className="font-semibold text-brand-700">{FIXED_PLAN.price}</span>{" "}
            via any UPI app by scanning the QR below.
          </p>
          <div className="mt-4 flex justify-center rounded-lg border border-slate-200 bg-slate-50 p-4">
            <QRCodeSVG
              value={COURSE_FEE_UPI_URL}
              size={200}
              level="M"
              bgColor="#ffffff"
              fgColor="#0b1437"
            />
          </div>
          <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-1.5">
            Amount is pre-filled as <strong>₹30,000</strong> — do not change it in your UPI app.
          </p>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <div><span className="text-slate-500">UPI ID: </span><span className="font-mono font-semibold text-brand-700">vizlo59196.ibz@icici</span></div>
            <div><span className="text-slate-500">Payee: </span><span className="font-semibold text-brand-700">Vizlogic COE</span></div>
            <div><span className="text-slate-500">Amount: </span><span className="font-semibold text-brand-700">{FIXED_PLAN.price}</span></div>
          </div>
        </div>

        {/* UTR + Date Form */}
        <form onSubmit={onSubmit}>
          <div className="rounded-lg bg-slate-50 p-5 space-y-4">
            <div>
              <div className="text-sm font-semibold text-brand-700">After Payment</div>
              <p className="mt-1 text-sm text-slate-600">
                Enter the details from your UPI payment confirmation.
              </p>
            </div>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                UPI Reference / UTR Number *
              </span>
              <input
                required
                type="text"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className={inputCls + " mt-1.5"}
                placeholder="e.g. 402512345678"
                maxLength={80}
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Date of Payment *
              </span>
              <input
                required
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className={inputCls + " mt-1.5"}
                max={new Date().toISOString().split("T")[0]}
              />
            </label>
          </div>

          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Payment Details →"}
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-500">
            Our team verifies payments manually within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";
