import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

const plans = [
  {
    name: "Full Upfront", price: "₹30,000 +GST", tag: "Best value",
    highlights: ["One-time payment", "Priority batch allocation"],
    accent: true,
  },
];

export default function FeesPage() {
  return (
    <div>
      <PageHeader
        documentTitle="Course Fees"
        eyebrow="Course Fees"
        title="Transparent pricing. Real scholarships."
        subtitle=" Fees are due only after you are selected - not during application."
      />
      <section className="py-16">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((p) => (
              <div
                key={p.name}
                className={
                  "relative rounded-2xl border bg-white p-8 shadow-sm " +
                  (p.accent
                    ? "border-accent-500 ring-1 ring-accent-500"
                    : "border-slate-200")
                }
              >
                {p.accent && (
                  <span className="absolute right-4 top-4 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Popular
                  </span>
                )}
                <div className="text-xs font-semibold uppercase tracking-wider text-accent-600">{p.tag}</div>
                <div className="mt-1 text-xl font-bold text-brand-700">{p.name}</div>
                <div className="mt-4 text-4xl font-extrabold text-brand-900">{p.price}</div>
                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-accent-500" />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/fee-payment"
                  className={
                    "mt-8 block w-full rounded-md py-3 text-center text-sm font-semibold " +
                    (p.accent
                      ? "bg-accent-500 text-white hover:bg-accent-600"
                      : "border border-brand-500 text-brand-600 hover:bg-brand-50")
                  }
                >
                  Pay Fee (after selection)
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Apply first — select your payment plan on the fee payment page after you receive your selection letter.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Scholarships</h2>
            <p className="mt-3 text-slate-600">
              We believe talent should not be filtered by fee. Two scholarship
              tracks — both awarded batch-on-batch.
            </p>
            <div className="mt-6 space-y-4">
              <div className="card">
                <div className="text-sm font-semibold text-accent-600">Merit-based</div>
                <p className="mt-1 text-sm text-slate-600">
                  Based on entrance test performance. Up to 40% fee waiver for top candidates.
                </p>
              </div>
              <div className="card">
                <div className="text-sm font-semibold text-accent-600">Need-based</div>
                <p className="mt-1 text-sm text-slate-600">
                  Based on candidate family income and a short essay. Up to 50% fee waiver for selected candidates.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="section-title">Payment FAQ</h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-semibold text-brand-700">Do I need to pay to apply?</dt>
                <dd className="mt-1 text-slate-600">
                  A one-time 100 rupee application fee is charged at form submission to confirm serious intent.
                  The course fee is only due after you are selected.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-700">How does course fee payment work?</dt>
                <dd className="mt-1 text-slate-600">
                  After you receive your selection letter with your Application ID, visit the
                  Fee Payment page, enter your ID, choose a plan and pay via UPI QR.
                  Our team verifies within 24 hours.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-700">Refund policy</dt>
                <dd className="mt-1 text-slate-600">
                  Full refund within 7 days of batch start if you are not
                  satisfied after the Foundation module.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page text-center">
          <Link to="/apply" className="btn-primary">Apply now — fee payment comes later</Link>
        </div>
      </section>
    </div>
  );
}
