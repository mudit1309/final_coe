import { useEffect } from "react";
import { Link } from "react-router-dom";

const stats = [
  { value: "200+", label: "Sales Automation platforms in India" },
  { value: "12", label: "Weeks to placement-ready" },
  { value: "5", label: "Industries: FMCG, Pharma, Dairy, Agri, Automobile & Telecom" },
  { value: "6", label: "Core training modules" },
];

const industries = [
  { name: "FMCG", tag: "Fast-moving consumer goods" },
  { name: "Pharma", tag: "Field force & distribution" },
  { name: "Dairy", tag: "Cold chain & route sales" },
  { name: "Agri / Tractor", tag: "Rural distribution" },
  { name: "Automobile", tag: "Dealership & vehicle sales" },
  { name: "Telecom", tag: "Network & subscriber management" },
];

const coePillars = [
  {
    title: "Implementation",
    body: "Proven experience in DMS / SFA rollout and governance across large enterprises and distributor ecosystems.",
  },
  {
    title: "Training & Adoption",
    body: "Standardized training framework that drives adoption by distributors and field teams from day one.",
  },
  {
    title: "IT Services & Support",
    body: "Support engineers, data validators and implementation coordinators — the talent industry actually needs.",
  },
];

const problemSolution = [
  { c: "Educated but unemployable", o: "Industry-ready professionals" },
  { c: "No direction", o: "Defined career path" },
  { c: "Theoretical knowledge", o: "Practical, lab-based exposure" },
  { c: "No confidence", o: "Field-ready workforce" },
];

const careerRoles = [
  "Implementation Executive",
  "Trainer",
  "Support Analyst",
  "Data Validator",
  "Project Coordinator",
];

export default function HomePage() {
  useEffect(() => {
    document.title =
      "Vizshila | Certified Sales Automation Professional (V-CSAP)";
  }, []);
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/michero.jpg')" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-brand-900/75"
        />
        <div className="container-page relative grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="eyebrow bg-white/10 text-accent-400">
              Vizlogic Centre of Excellence
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Become a{" "}
              <span className="text-accent-400">Certified Sales Automation</span>{" "}
              Professional
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-200">
              India's first structured COE for DMS / SFA talent. A 12 week
              job-oriented program that turns Gen Z into industry-ready
              professionals for FMCG, Pharma, Dairy, Agri, Automobile & Telecom.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/apply" className="btn-primary">
                Apply for Next Batch →
              </Link>
              <Link to="/program" className="btn-ghost">
                Explore V-CSAP Program
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2"><CheckIcon /> Placement-linked option</div>
              <div className="flex items-center gap-2"><CheckIcon /> Online + Hybrid labs</div>
              <div className="flex items-center gap-2"><CheckIcon /> Industry-issued certificate</div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent-400">
                Next Cohort
              </div>
              <div className="mt-1 text-2xl font-bold">V-CSAP • Batch 01</div>
              <div className="mt-4 space-y-3 text-sm">
                <Row k="Duration" v="12 weeks" />
                <Row k="Mode" v="In-person" />
                <Row k="Fee" v="₹30,000 +GST" />
                <Row k="Outcome" v="Placement-ready" />
                <Row k="Seats" v="Limited • First-come basis" />
              </div>
              <Link
                to="/apply"
                className="mt-6 block w-full rounded-md bg-accent-500 py-3 text-center text-sm font-semibold text-white hover:bg-accent-600"
              >
                Reserve a Seat
              </Link>
              <div className="mt-3 text-center text-[11px] text-slate-400">
                QR-based payment • Manual verification within 24 hrs
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-brand-700/50">
          <div className="container-page grid grid-cols-2 gap-4 py-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-white">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-slate-300">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRY FOCUS */}
      <section className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Industry Focus</span>
            <h2 className="section-title">Six industries. One critical skill gap.</h2>
            <p className="mt-4 text-slate-600">
              The demand for skilled professionals in Sales Automation (DMS /
              SFA) is rapidly increasing due to digital transformation across
              core sectors — but there is no standardized talent pipeline.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((i) => (
              <div
                key={i.name}
                className="card border-transparent bg-gradient-to-br from-brand-50 to-white"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 text-white">
                  <IndustryIcon />
                </div>
                <div className="mt-4 text-lg font-semibold text-brand-700">{i.name}</div>
                <div className="text-sm text-slate-500">{i.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY VIZLOGIC */}
      <section className="bg-slate-50 py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Why Vizlogic?</span>
            <h2 className="section-title">A COE, not just another training program.</h2>
            <p className="mt-4 text-slate-600">
              Vizlogic brings proven experience in large-scale DMS / SFA
              rollouts, distributor ecosystems, and digital transformation —
              converted into a structured talent factory for the industry.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="flex gap-3"><BulletIcon />Faster deployments via standardized modules</li>
              <li className="flex gap-3"><BulletIcon />Better adoption with field-ready field staff</li>
              <li className="flex gap-3"><BulletIcon />Lower failure rates via certified professionals</li>
              <li className="flex gap-3"><BulletIcon />Career path and growth to cut attrition</li>
            </ul>
          </div>
          <div className="grid gap-4">
            {coePillars.map((p) => (
              <div key={p.title} className="card">
                <div className="text-sm font-semibold uppercase tracking-wider text-accent-600">
                  {p.title}
                </div>
                <p className="mt-2 text-slate-600">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FROM → TO */}
      <section className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Employability Transformation</span>
            <h2 className="section-title">From → To</h2>
            <p className="mt-4 text-slate-600">
              We don't just teach tools. We transform candidates into a
              workforce industry can actually deploy on day one.
            </p>
          </div>
          <div className="mt-12 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-700 text-white">
                <tr>
                  <th className="w-1/2 px-6 py-4 font-semibold">Current State</th>
                  <th className="w-1/2 px-6 py-4 font-semibold">COE Outcome</th>
                </tr>
              </thead>
              <tbody>
                {problemSolution.map((row, i) => (
                  <tr key={row.c} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-6 py-4 text-slate-700">{row.c}</td>
                    <td className="px-6 py-4 font-medium text-brand-700">→ {row.o}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* COURSE STRUCTURE */}
      <section className="bg-brand-900 py-20 text-white">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow bg-white/10 text-accent-400">Course Structure</span>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Foundation → Technical → Implementation → Soft Skills → Simulation → Assessment
            </h2>
            <p className="mt-4 text-slate-300">
              Six modules over 12 weeks. Built with the real workflow of a
              sales automation program in mind.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Foundation", "Week 1–2", "FMCG, distribution, DMS/SFA basics"],
              ["Technical Training", "Week 3–5", "App, order lifecycle, schemes, dashboards"],
              ["Implementation", "Week 6–7", "Onboarding, master data, rollout"],
              ["Soft Skills", "Parallel", "Communication, problem solving, etiquette"],
              ["On-the-Job Simulation", "Week 8–9", "Live scenarios and issue resolution"],
              ["Assessment & Certification", "Final", "Practical, viva, certification"],
            ].map(([t, when, d]) => (
              <div key={t} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent-400">
                  {when}
                </div>
                <div className="mt-1 text-lg font-semibold">{t}</div>
                <p className="mt-2 text-sm text-slate-300">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/curriculum" className="btn-primary">
              See Full Curriculum →
            </Link>
          </div>
        </div>
      </section>

      {/* CAREER ROLES */}
      <section className="py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Career Path</span>
            <h2 className="section-title">Real roles. Real companies. Real deployments.</h2>
            <p className="mt-4 text-slate-600">
              Our graduates step directly into deployment-critical roles at
              FMCG, Pharma, Dairy, Agri, Automobile & Telecom companies — where DMS / SFA programs
              are live and scaling.
            </p>
            <Link to="/career-path" className="mt-6 inline-block btn-secondary">
              See Career Path
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {careerRoles.map((r) => (
              <div
                key={r}
                className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-brand-700 shadow-sm"
              >
                {r}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent-500 to-accent-700 py-16 text-white">
        <div className="container-page flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div>
            <h3 className="text-2xl font-bold sm:text-3xl">
              Ready to start your Sales Automation career?
            </h3>
            <p className="mt-2 text-white/90">
              Batches open monthly. Limited seats. Scholarships available.
            </p>
          </div>
          <Link
            to="/apply"
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-accent-700 shadow-sm hover:bg-slate-100"
          >
            Apply Now →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0 last:pb-0">
      <span className="text-slate-300">{k}</span>
      <span className="font-semibold text-white">{v}</span>
    </div>
  );
}
function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-accent-400" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
function BulletIcon() {
  return (
    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-100 text-accent-700">
      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}
function IndustryIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V8l9-5 9 5v13M9 21V12h6v9" />
    </svg>
  );
}
