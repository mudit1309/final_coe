import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

export default function ProgramPage() {
  return (
    <div>
      <PageHeader
        documentTitle="V-CSAP Program"
        eyebrow="Program"
        title="Vizlogic Certified Sales Automation Professional (V-CSAP)"
        subtitle="A job-oriented certification program that makes you placement-ready in 12 weeks."
      />

      <section className="py-16">
        <div className="container-page grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-brand-700">About the Program</h2>
            <p className="mt-4 text-slate-600">
              V-CSAP is a structured certification program designed to train
              candidates in the complete Sales Automation stack — DMS / SFA
              systems, field execution, distributor onboarding, data management
              and customer handling. Outcome: placement-ready candidates within
              8–12 weeks.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["DMS / SFA Systems", "Hands-on with distributor & sales-force automation platforms."],
                ["Field Execution", "Distributor onboarding and field rollout playbooks."],
                ["Data Management", "Master data validation, clean-up and reporting."],
                ["Customer Handling", "Communication, problem solving and escalations."],
              ].map(([t, d]) => (
                <div key={t} className="card">
                  <div className="text-sm font-semibold text-accent-600">{t}</div>
                  <p className="mt-1 text-sm text-slate-600">{d}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-2xl font-bold text-brand-700">Lab Setup</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div className="card">
                <div className="text-sm font-semibold text-accent-600">Digital Lab</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  <li>Simulated DMS/SFA environment</li>
                  <li>Real-life case scenarios</li>
                  <li>Role-based access: Admin, Distributor, Sales Rep</li>
                </ul>
              </div>
              <div className="card">
                <div className="text-sm font-semibold text-accent-600">Field Lab</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  <li>Exposure at distributor locations</li>
                  <li>Retail environment visits</li>
                  <li>Mock training sessions</li>
                </ul>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                Program Snapshot
              </div>
              <div className="mt-2 text-xl font-bold text-brand-700">V-CSAP • Batch 01</div>
              <dl className="mt-4 space-y-3 text-sm">
                <Meta k="Duration" v="12 Weeks" />
                <Meta k="Mode" v="In-person" />
                <Meta k="Batch Frequency" v="Monthly / Bi-Monthly" />
                <Meta k="Fee" v="₹30,000 +GST" />
                <Meta k="Payment" v="Full" />
                <Meta k="Eligibility" v="Diploma or Graduate preferred" />
                <Meta k="Outcome" v="Placement-ready certification" />
              </dl>
              <Link
                to="/apply"
                className="mt-6 block w-full rounded-md bg-accent-500 py-3 text-center text-sm font-semibold text-white hover:bg-accent-600"
              >
                Apply for V-CSAP →
              </Link>
              <p className="mt-3 text-center text-[11px] text-slate-500">
                Scholarships: Merit-based and Need-based.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container-page">
          <h2 className="section-title">What you'll walk away with</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Certification", "V-CSAP certificate recognized by the Sales Automation industry."],
              ["Placement Ready", "Simulated deployments, data validations, rollout playbooks."],
              ["Placement support", "Interviews with FMCG, Pharma, Dairy, Agri & Telecom companies."],
            ].map(([t, d]) => (
              <div key={t} className="card">
                <div className="text-lg font-semibold text-brand-700">{t}</div>
                <p className="mt-2 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2 last:border-0">
      <dt className="text-slate-500">{k}</dt>
      <dd className="text-right font-medium text-brand-700">{v}</dd>
    </div>
  );
}
