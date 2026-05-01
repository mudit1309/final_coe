import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

const roles = [
  { title: "Implementation Executive", level: "Entry → Mid",
    body: "Drive distributor onboarding, master data validation and rollout of DMS/SFA across territories." },
  { title: "Trainer", level: "Mid",
    body: "Train distributors and field staff. Build adoption playbooks and user enablement content." },
  { title: "Support Analyst", level: "Entry",
    body: "Resolve tickets, analyze issues and act as the bridge between field and product teams." },
  { title: "Data Validator", level: "Entry",
    body: "Validate and clean master data — products, pricing, distributors, routes — for rollouts." },
  { title: "Project Coordinator", level: "Mid",
    body: "Coordinate multi-territory rollouts, manage timelines and report progress to program owners." },
  { title: "Program Lead (long-term)", level: "Senior",
    body: "Own end-to-end DMS / SFA programs for an enterprise or distributor region." },
];

const sectors = ["FMCG", "Pharma", "Dairy", "Agri / Tractor", "Automobile", "Telecom"];

export default function CareerPathPage() {
  return (
    <div>
      <PageHeader
        documentTitle="Career Path"
        eyebrow="Career Path"
        title="From certification to deployment-critical roles."
        subtitle="V-CSAP opens doors across the 200+ Sales Automation platforms serving India's largest sectors."
      />

      <section className="py-16">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="section-title">Roles you can target</h2>
              <p className="mt-3 text-slate-600">
                Each role below maps directly to V-CSAP modules — so what you
                learn is exactly what employers hire for.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {roles.map((r) => (
                  <div key={r.title} className="card">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-brand-700">{r.title}</div>
                      <span className="chip">{r.level}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="card">
                <div className="text-sm font-semibold text-accent-600">Sectors hiring</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sectors.map((s) => (<span key={s} className="chip">{s}</span>))}
                </div>
              </div>
              <div className="card">
                <div className="text-sm font-semibold text-accent-600">Typical entry salary</div>
                <p className="mt-2 text-sm text-slate-600">
                  Entry-level roles in DMS/SFA start at ₹3 LPA (after 6 months of internship) and grow rapidly with deployment experience.
                </p>
              </div>
              <div className="card">
                <div className="text-sm font-semibold text-accent-600">Placement support</div>
                <p className="mt-2 text-sm text-slate-600">
                  Mock interviews, resume building and employer connects via Vizlogic's ecosystem partnerships.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container-page">
          <h2 className="section-title">Growth Trajectory</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {[
              ["0–1 yr", "Support Analyst / Data Validator"],
              ["1–3 yrs", "Implementation Executive / Trainer"],
              ["3–5 yrs", "project Coordinator / Team Lead"],
              ["5+ yrs", "Program Lead"],
            ].map(([when, role]) => (
              <div
                key={when}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-accent-600">{when}</div>
                <div className="mt-1 text-sm font-semibold text-brand-700">{role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page text-center">
          <Link to="/apply" className="btn-primary">Start your DMS/SFA career →</Link>
        </div>
      </section>
    </div>
  );
}
