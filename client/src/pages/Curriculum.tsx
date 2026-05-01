import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

/*
 * ──────────────────────────────────────────────────────────────
 *  SYLLABUS DATA — edit the `details` array inside each module
 *  to update the weekly breakdown shown when a card is expanded.
 * ──────────────────────────────────────────────────────────────
 */
const modules = [
  {
    n: "01", when: "Week 1–2", title: "Foundation",
    topics: ["Basics of FMCG / Distribution", "Sales Automation overview", "DMS & SFA concepts"],
    details: [
      "Week 1: Introduction to FMCG, Pharma, Dairy, Agri, Automobile & Telecom industries — supply chain, distribution network, channel structure",
      "Week 1: What is Sales Automation? — DMS (Distributor Management System) & SFA (Sales Force Automation) explained",
      "Week 1: Overview of major platforms used in India — market landscape and key players",
      "Week 2: Distribution hierarchy — company → super stockist → distributor → retailer → consumer",
      "Week 2: Understanding beats, routes, outlet classification, and territory mapping",
      "Week 2: Key business metrics — primary vs secondary sales, fill rates, outlet coverage",
    ],
  },
  {
    n: "02", when: "Week 3–5", title: "Technical Training",
    topics: ["Application navigation", "Order lifecycle", "Scheme management", "Reporting dashboards"],
    details: [
      "Week 3: Hands-on application navigation — login, dashboard overview, menu structure, user roles",
      "Week 3: Master data setup — product catalog, price lists, distributor profiles, route configuration",
      "Week 4: Order lifecycle — order booking → approval → dispatch → invoicing → delivery → returns",
      "Week 4: Scheme management — trade schemes, consumer promotions, discount slabs, combo offers",
      "Week 5: Reporting dashboards — daily sales reports, coverage analytics, target vs achievement",
      "Week 5: Data validation techniques — identifying mismatches, duplicate entries, data hygiene",
    ],
  },
  {
    n: "03", when: "Week 6–7", title: "Implementation Skills",
    topics: ["Distributor onboarding", "Master data validation", "Field rollout process", "Training distributors"],
    details: [
      "Week 6: Distributor onboarding workflow — documentation, system registration, configuration checklist",
      "Week 6: Master data validation — product hierarchy, pricing accuracy, geo-tagging outlets",
      "Week 7: Field rollout planning — timelines, territory sequencing, go-live readiness checklist",
      "Week 7: Training distributors and field staff — creating training material, conducting sessions, ITIL framework",
      "Week 7: Handling resistance and change management — common objections and how to address them, Driving Adoption",
    ],
  },
  {
    n: "04", when: "Parallel", title: "Soft Skills",
    topics: ["Communication", "Problem solving", "Field etiquette"],
    details: [
      "Professional email and call communication for client interactions",
      "Problem-solving frameworks — root cause analysis, escalation matrix",
      "Field etiquette — distributor visit protocol, warehouse interactions, punctuality",
      "Presentation skills — status updates, demo walkthroughs, training delivery",
      "Team collaboration — working with implementation, support, and product teams",
      "Management — stake holder management and basics of project management."

    ],
  },
  {
    n: "05", when: "Week 8–9", title: "On-the-Job Simulation",
    topics: ["Live scenarios", "Mock implementations", "Issue resolution drills"],
    details: [
      "Week 8: Simulate a full distributor onboarding — from scratch to first order placed",
      "Week 8: Mock rollout scenario — multi-territory go-live with parallel tracks",
      "Week 9: Issue resolution drills — order sync failures, pricing errors, stock mismatches",
      "Week 9: Live field scenario — handle distributor complaints and trainer queries in real time",
      "Week 9: End-to-end case study — complete deployment for a sample FMCG / Pharma company",
    ],
  },
  {
    n: "06", when: "Final", title: "Assessment & Certification",
    topics: ["Practical test", "Viva", "V-CSAP certification"],
    details: [
      "Practical test — execute a mock deployment end-to-end in the digital lab",
      "Viva — defend your design decisions in front of industry practitioners",
      "Written assessment — MCQs and scenario-based questions covering all modules",
      "Vizlogic Certified Sales Automation Professional covocation — industry-recognized credential shared with hiring partners",
    ],
  },
];

export default function CurriculumPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(n: string) {
    setExpanded((prev) => (prev === n ? null : n));
  }

  return (
    <div>
      <PageHeader
        documentTitle="Curriculum"
        eyebrow="Curriculum"
        title="Six modules. Eight to ten weeks. One job-ready professional."
        subtitle="Click on any module to see the detailed weekly syllabus."
      />

      <section className="py-16">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-2">
            {modules.map((m) => {
              const isOpen = expanded === m.n;
              return (
                <article
                  key={m.n}
                  onClick={() => toggle(m.n)}
                  className={
                    "relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-8 shadow-sm transition-all duration-300 " +
                    (isOpen
                      ? "border-accent-500 ring-1 ring-accent-500 lg:col-span-2"
                      : "border-slate-200 hover:border-accent-300 hover:shadow-md")
                  }
                >
                  <div className="absolute right-5 top-5 text-5xl font-extrabold text-slate-100">
                    {m.n}
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                        {m.when}
                      </div>
                      <h3 className="mt-1 text-2xl font-bold text-brand-700">
                        {m.title}
                      </h3>
                    </div>
                    <svg
                      className={
                        "mt-1 h-5 w-5 flex-none text-slate-400 transition-transform duration-300 " +
                        (isOpen ? "rotate-180" : "")
                      }
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {m.topics.map((t) => (
                      <li
                        key={t}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-accent-500" />
                        {t}
                      </li>
                    ))}
                  </ul>

                  {isOpen && (
                    <div className="mt-6 border-t border-slate-200 pt-6">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-700">
                        Detailed Syllabus
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {m.details.map((d, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-600"
                          >
                            <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container-page">
          <h2 className="section-title">Assessment & Certification</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Our assessment is practical, not theoretical. Candidates must
            demonstrate deployment-ready skills to earn V-CSAP certification.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              ["Practical Test", "Execute a mock deployment end-to-end in the digital lab."],
              ["Viva", "Defend your design decisions in front of industry practitioners."],
              ["V-CSAP Certificate", "Industry-recognized credential shared with hiring partners."],
            ].map(([t, d]) => (
              <div key={t} className="card">
                <div className="text-lg font-semibold text-brand-700">{t}</div>
                <p className="mt-2 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page text-center">
          <h3 className="text-2xl font-bold text-brand-700 sm:text-3xl">Next batch starts soon.</h3>
          <p className="mt-2 text-slate-600">Limited seats across online + hybrid tracks.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/admission" className="btn-secondary">View Admission Process</Link>
            <Link to="/apply" className="btn-primary">Apply Now →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
