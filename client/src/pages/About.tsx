import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

const challenges = [
  "Lack of trained manpower",
  "High attrition at ground level",
  "Poor training quality",
  "Low adoption by distributors",
  "Inconsistent implementation quality",
  "No standardized certification framework",
];

const solutionMap: [string, string][] = [
  ["Skilled manpower shortage", "Structured training pipeline"],
  ["Poor implementation", "Certified professionals"],
  ["High attrition", "Career path & growth"],
  ["Low adoption", "Better trained field staff"],
  ["Quality inconsistency", "Standardized modules"],
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        documentTitle="About the COE"
        eyebrow="About the COE"
        title="India's talent transformation engine for Sales Automation"
        subtitle="Vision: convert raw Gen Z potential into industry-ready professionals for the DMS / SFA ecosystem."
      />

      <section className="py-16">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-brand-700">Our Vision</h2>
            <p className="mt-4 text-slate-600">
              To become India's leading talent transformation engine for the
              Sales Automation ecosystem by converting raw potential into
              industry-ready professionals.
            </p>
            <h2 className="mt-10 text-2xl font-bold text-brand-700">Why Vizlogic?</h2>
            <ul className="mt-4 space-y-3 text-slate-700">
              <li>• Proven experience in DMS / SFA rollout and governance</li>
              <li>• Worked with large enterprises and distributor ecosystems</li>
              <li>• Strong expertise in implementation, training & adoption, IT services</li>
              <li>• Established credibility in large-scale digital transformation programs</li>
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["200+", "Sales Automation apps"],
              ["4", "Core industries"],
              ["12", "Weeks to job-ready"],
              ["6", "Modules end-to-end"],
            ].map(([v, l]) => (
              <div
                key={l}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="text-3xl font-extrabold text-accent-600">{v}</div>
                <div className="mt-1 text-sm text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container-page">
          <h2 className="section-title">Industry challenges we solve</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            The 200+ Sales Automation platforms in India struggle with the same
            pain points. Vizshila is built around solving them
            systematically.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((c) => (
              <div
                key={c}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">!</span>
                  <p className="text-sm font-medium text-slate-800">{c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <h2 className="section-title">Our solution: a Talent Factory Model</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Centralized COE + structured pipeline that maps every industry
            challenge to a concrete COE intervention.
          </p>
          <div className="mt-10 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-700 text-white">
                <tr>
                  <th className="w-1/2 px-6 py-4 font-semibold">Challenge</th>
                  <th className="w-1/2 px-6 py-4 font-semibold">COE Solution</th>
                </tr>
              </thead>
              <tbody>
                {solutionMap.map(([c, s], i) => (
                  <tr key={c} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-6 py-4 text-slate-700">{c}</td>
                    <td className="px-6 py-4 font-medium text-brand-700">→ {s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-brand-900 py-16 text-white">
        <div className="container-page text-center">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Built for industry. Driven by outcomes.
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Candidates gain job-ready skills. Industry gets skilled manpower.
            Vizlogic builds a durable talent pipeline.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/program" className="btn-primary">Explore the Program</Link>
            <Link to="/apply" className="btn-ghost">Apply Now →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
