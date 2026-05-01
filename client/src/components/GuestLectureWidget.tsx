import { useState } from "react";

type Stage = "idle" | "open" | "submitting" | "done" | "error";

export function GuestLectureWidget() {
  const [stage, setStage] = useState<Stage>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    place: "",
    topic: "",
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStage("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/guest-lecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          place: form.place.trim(),
          topic: form.topic.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
        setStage("error");
      } else {
        setStage("done");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStage("error");
    }
  }

  function reset() {
    setStage("idle");
    setServerError(null);
    setForm({ name: "", phone: "", email: "", place: "", topic: "" });
  }

  if (stage === "idle") {
    return (
      <button
        onClick={() => setStage("open")}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-800 transition-all"
        aria-label="Guest Lecture Interest"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span>Give a Guest Lecture</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-end sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => { if (stage !== "submitting") reset(); }}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-brand-700 px-5 py-4">
          <div>
            <div className="text-sm font-bold text-white">Guest Lecture Interest</div>
            <div className="text-xs text-brand-200">Share your details and we'll be in touch</div>
          </div>
          <button
            onClick={reset}
            disabled={stage === "submitting"}
            className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {stage === "done" ? (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <svg className="h-7 w-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-bold text-brand-700">Thank you!</h3>
              <p className="mt-2 text-sm text-slate-600">
                We've received your interest in giving a guest lecture. Our team will reach out to you soon.
              </p>
              <button
                onClick={reset}
                className="mt-4 rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <p className="text-sm text-slate-600">
                Are you an expert willing to share your knowledge with our V-CSAP students? Drop your details below.
              </p>

              <GlField label="Full Name *">
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputCls}
                  placeholder="Your full name"
                  maxLength={120}
                />
              </GlField>

              <GlField label="Phone *">
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputCls}
                  placeholder="+91 98xxxxxxxx"
                />
              </GlField>

              <GlField label="Email *">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputCls}
                  placeholder="you@example.com"
                  maxLength={200}
                />
              </GlField>

              <GlField label="City / Location *">
                <input
                  required
                  type="text"
                  value={form.place}
                  onChange={(e) => update("place", e.target.value)}
                  className={inputCls}
                  placeholder="e.g. Hyderabad, India"
                  maxLength={200}
                />
              </GlField>

              <GlField label="Topic / Area of Expertise (optional)">
                <input
                  type="text"
                  value={form.topic}
                  onChange={(e) => update("topic", e.target.value)}
                  className={inputCls}
                  placeholder="e.g. Salesforce, CRM Strategy, Sales Automation"
                  maxLength={500}
                />
              </GlField>

              {(stage === "error" && serverError) && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={stage === "submitting"}
                className="w-full rounded-md bg-accent-500 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-60"
              >
                {stage === "submitting" ? "Submitting…" : "Submit Interest →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

function GlField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
