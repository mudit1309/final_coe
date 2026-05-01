import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { ApplyForm } from "../components/ApplyForm";

export type Plan = { id: string; label: string; price: string };

export const PLANS: Plan[] = [
  { id: "full", label: "Full Upfront", price: "₹30,000" },

];

type Stage =
  | { kind: "form" }
  | { kind: "done"; id: number; uniqueId: string };

export default function ApplyPage() {
  const [stage, setStage] = useState<Stage>({ kind: "form" });

  return (
    <div>
      <PageHeader
        documentTitle="Apply Now"
        eyebrow="Apply Now"
        title="Reserve your seat in the next V-CSAP batch."
        subtitle="Verify your contact details, fill the form, and you're done. Fee payment happens only after you clear all admission rounds."
      />

      <section className="py-16">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {stage.kind === "form" && (
              <ApplyForm
                onSubmitted={(id, uniqueId) => {
                  setStage({ kind: "done", id, uniqueId });
                }}
              />
            )}
            {stage.kind === "done" && (
              <div className="card text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-brand-700">Application Submitted!</h2>
                <p className="mt-2 text-slate-600">
                  Your application has been received. Our team will review it and be in touch shortly.
                </p>

                {/* Unique Application ID — prominent display */}
                <div className="mx-auto mt-6 max-w-sm rounded-xl border-2 border-accent-400 bg-accent-50 p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent-700">
                    Your Application ID
                  </div>
                  <div className="mt-2 text-4xl font-bold tracking-widest text-brand-700">
                    {stage.uniqueId}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Save this ID — you'll need it to pay your course fee after selection.
                  </p>
                </div>

                <div className="mt-6 rounded-lg bg-slate-50 p-4 text-left text-sm text-slate-600">
                  <div className="font-semibold text-brand-700 mb-2">What happens next?</div>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>Our team reviews your application within 48 hours.</li>
                    <li>If shortlisted, you'll be invited for an entrance test and interview.</li>
                    <li>Selected candidates receive a confirmation email with this Application ID.</li>
                    <li>Use your Application ID on the <Link to="/fee-payment" className="font-semibold text-accent-600 hover:underline">Fee Payment page</Link> to complete enrollment.</li>
                  </ol>
                </div>

                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link to="/fee-payment" className="btn-primary">
                    Pay Course Fee (after selection) →
                  </Link>
                  <Link to="/" className="btn-secondary">
                    Back to Home
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card">
              <div className="text-sm font-semibold text-accent-600">What happens next</div>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
                <li>Verify phone &amp; email with OTP.</li>
                <li>Submit the application form.</li>
                <li>Screening → Entrance Test → Interview.</li>
                <li>Selected candidates get an email with their Application ID.</li>
                <li>Use Application ID on the Fee Payment page to pay and enroll.</li>
              </ol>
            </div>
            <div className="card">
              <div className="text-sm font-semibold text-accent-600">No fee required now</div>
              <p className="mt-2 text-sm text-slate-600">
                Course fee is collected only after you clear all admission rounds. See{" "}
                <Link to="/fees" className="font-medium text-brand-700 hover:underline">Fees &amp; Scholarships</Link>.
              </p>
            </div>
            <div className="card">
              <div className="text-sm font-semibold text-accent-600">Questions?</div>
              <p className="mt-2 text-sm text-slate-600">
                Reach out to our admissions team at{" "}
                <span className="font-medium text-brand-700">vizshila@vizlogicinida.com</span>.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
