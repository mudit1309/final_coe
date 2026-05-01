import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

const steps = [
  {
    n: "01",
    title: "Fee Structure",
    summary: "Transparent pricing with Full Upfront",
    body: `Choose the payment plan that suits you best:
• Full Upfront — ₹30,000 (priority batch allocation)

Merit-based scholarships up to 40% for top performers. Need-based waivers up to 50% available based on family income.`,
    cta: { label: "View Full Fee Details →", to: "/fees" },
  },
  {
    n: "02",
    title: "Application",
    summary: "Fill the Apply Now form with your basic details and course interest.",
    body: `Complete the online application form in under 3 minutes:
• Provide your name, contact details, and educational background
• Select your preferred course and payment plan
• Verify your phone number and email via OTP
• Receive your unique Application ID (e.g. VZ000001) instantly

Your Application ID is used for all future correspondence and fee payment.`,
    cta: { label: "Apply Now →", to: "/apply" },
  },
  {
    n: "03",
    title: "Screening",
    summary: "Resume review against basic eligibility — Diploma or Graduate preferred.",
    body: `Our admissions team reviews your application within 48 hours:
• Basic eligibility check: Diploma / Graduate in any discipline
• Basic computer and communication skills preferred
• Prior sales or CRM exposure is an advantage (not mandatory)
• You will be notified via email about screening outcome
• No documents required at this stage`,
  },
  {
    n: "04",
    title: "Entrance Test",
    summary: "Aptitude, logical reasoning and basic communication assessment.",
    body: `A short online test to assess your readiness:
• Duration: 45 minutes, conducted online at your convenience
• Sections: Numerical aptitude, logical reasoning, English comprehension
• Basic communication scenario questions
• Minimum passing score: 50% — top scorers may qualify for merit scholarships
• Test link sent to your registered email after screening clearance`,
  },
  {
    n: "05",
    title: "Interview",
    summary: "Motivation check and communication skills round with the V-CSAP team.",
    body: `A short video / telephonic interview with our admissions team:
• Duration: 20–30 minutes
• Topics: Career goals, motivation to join, basic communication assessment
• No technical knowledge required — we assess potential, not past experience
• Conducted within 3–5 business days of clearing the entrance test
• Interview slot booked via email / phone`,
  },
  {
    n: "06",
    title: "Selection",
    summary: "Offer letter issued to shortlisted candidates.",
    body: `Congratulations if you've reached here!
• Offer letter sent to your registered email within 2 business days
• Email includes your Application ID for fee payment
• The selection email contains batch start date and next steps
• You have 7 days to confirm your seat by completing fee payment
• Visit the Fee Payment page and enter your Application ID to proceed`,
  },
  {
    n: "07",
    title: "Admission",
    summary: "Documentation and program agreement signing for enrollment.",
    body: `Complete your enrollment formalities online:
• Upload basic documents: ID proof, educational certificates
• Sign the V-CSAP program agreement digitally
• Confirm batch preference
• Access granted to the pre-reading materials and orientation schedule
• All documentation verified within 24 hours of submission`,
  },
  {
    n: "08",
    title: "Fee Payment",
    summary: "Pay your course fee using your Application ID.",
    body: `Complete your fee payment to secure your seat:
• Visit the Fee Payment page: enter your Application ID (e.g. VZ000001)
• Scan the QR code or use the UPI ID: vizlo59196.ibz@icici
• Available plans: Full Upfront (one time payment)
• Submit your UPI reference / UTR number after payment
• Payment verified manually by our team within 24 hours`,
    cta: { label: "Pay Course Fee →", to: "/fee-payment" },
  },
  {
    n: "09",
    title: "Training Kickoff",
    summary: "Orientation — your V-CSAP journey begins.",
    body: `Welcome aboard — your transformation starts here!
• Meet your cohort and assigned mentor
• Receive the full curriculum schedule and assignment calendar
• Join the exclusive V-CSAP community on WhatsApp / Discord`,
  },
];

function TermsBody() {
  return (
    <div className="space-y-8 text-sm text-slate-600 leading-relaxed">

      {/* ── Terms and Conditions ── */}
      <div>
        <h3 className="text-base font-bold text-brand-700 mb-3">Terms and Conditions</h3>
        <p className="mb-3">
          Welcome to Vizshila, the Centre of Excellence by Vizlogic dedicated to transforming young
          talent into industry-ready professionals for the Sales Automation ecosystem. By accessing
          or using our website, training programs, and services, you agree to comply with and be
          bound by the following Terms and Conditions.
        </p>

        <PolicySection n="1" title="Acceptance of Terms">
          By using our website, registering for our programs, or availing any of our services, you
          confirm that you accept these Terms and Conditions and agree to comply with them.
        </PolicySection>

        <PolicySection n="2" title="Changes to Terms">
          Vizshila reserves the right to revise these Terms and Conditions at any time. Updated
          terms will be posted on this page, and your continued use of the website and services
          constitutes acceptance of those changes.
        </PolicySection>

        <PolicySection n="3" title="Use of the Website">
          <p className="mb-2">You agree that:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You will not use the website for any unlawful or unauthorized purpose.</li>
            <li>You will not misuse, disrupt, or attempt to gain unauthorized access to our systems.</li>
            <li>You will use the website and services in a manner that does not infringe the rights of others.</li>
          </ul>
        </PolicySection>

        <PolicySection n="4" title="Program Participation">
          <ul className="list-disc pl-5 space-y-1">
            <li>Admission to any Vizshila training program is subject to eligibility, screening, and selection criteria.</li>
            <li>Vizshila reserves the right to accept or reject applications without assigning any reason.</li>
            <li>Certification will be awarded only upon successful completion of the program, assessments, and compliance with attendance requirements.</li>
          </ul>
        </PolicySection>

        <PolicySection n="5" title="Intellectual Property">
          <p className="mb-2">
            All content on this website, including text, graphics, logos, videos, course material,
            training modules, assessments, and images are the exclusive property of Vizshila /
            Vizlogic and are protected under applicable copyright and intellectual property laws.
          </p>
          <p>No material may be copied, reproduced, distributed, or used without prior written permission.</p>
        </PolicySection>

        <PolicySection n="6" title="Placement Assistance Disclaimer">
          Vizshila provides placement assistance, interview preparation, and industry connections;
          however, job placement is not guaranteed and depends on individual performance, market
          conditions, and employer requirements.
        </PolicySection>

        <PolicySection n="7" title="Limitation of Liability">
          Vizshila shall not be liable for any indirect, incidental, consequential, or special
          damages arising from the use of our website, training services, or inability to
          participate in the program.
        </PolicySection>

        <PolicySection n="8" title="Contact Information">
          For any questions regarding these Terms and Conditions, please contact us at:{" "}
          <a href="mailto:info@vizshila.com" className="text-brand-600 underline">info@vizshila.com</a>
        </PolicySection>
      </div>

      <hr className="border-slate-200" />

      {/* ── Privacy Policy ── */}
      <div>
        <h3 className="text-base font-bold text-brand-700 mb-3">Privacy Policy</h3>
        <p className="mb-3">
          At Vizshila, we are committed to protecting your privacy and personal information. This
          Privacy Policy explains how we collect, use, and safeguard your data.
        </p>

        <PolicySection n="1" title="Information We Collect">
          <p className="font-semibold text-slate-700 mb-1">Personal Information</p>
          <p className="mb-2">We may collect: Full Name, Email Address, Phone Number, Educational Qualification, Resume / Profile Details, Payment Information, Address (if required).</p>
          <p className="font-semibold text-slate-700 mb-1">Usage Data</p>
          <p>We may collect: IP Address, Browser Type, Device Information, Website Usage Patterns, Pages Visited, Form Submission Data.</p>
        </PolicySection>

        <PolicySection n="2" title="How We Use Your Information">
          <ul className="list-disc pl-5 space-y-1">
            <li>Processing applications and admissions</li>
            <li>Managing your training enrollment</li>
            <li>Fee processing and account management</li>
            <li>Sending important program updates</li>
            <li>Placement assistance and employer coordination</li>
            <li>Improving our services and learning experience</li>
            <li>Customer support and grievance handling</li>
            <li>Promotional communication (only if opted in)</li>
          </ul>
        </PolicySection>

        <PolicySection n="3" title="Sharing Your Information">
          <p className="mb-2">We do not sell or trade your personal information. Your information may be shared only with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Trusted training partners</li>
            <li>Placement partners / hiring organizations</li>
            <li>Technology service providers</li>
            <li>Legal authorities where required by law</li>
          </ul>
        </PolicySection>

        <PolicySection n="4" title="Data Security">
          We implement reasonable administrative and technical security measures to protect your
          personal information. However, no online system is completely secure, and we cannot
          guarantee absolute security.
        </PolicySection>

        <PolicySection n="5" title="Your Rights">
          <ul className="list-disc pl-5 space-y-1">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data (subject to legal obligations)</li>
            <li>Withdraw consent for promotional communication</li>
          </ul>
        </PolicySection>

        <PolicySection n="6" title="Changes to Privacy Policy">
          Vizshila may update this Privacy Policy from time to time. Changes will be posted on this page.
        </PolicySection>

        <PolicySection n="7" title="Contact Us">
          For privacy-related concerns, please contact:{" "}
          <a href="mailto:vizshila@vizlogicindia.com" className="text-brand-600 underline">vizshila@vizlogicindia.com</a>
        </PolicySection>
      </div>

      <hr className="border-slate-200" />

      {/* ── Cancellation and Refund Policy ── */}
      <div>
        <h3 className="text-base font-bold text-brand-700 mb-3">Cancellation and Refund Policy</h3>
        <p className="mb-3">
          At Vizshila, we value transparency and fairness in our admissions and training process.
        </p>

        <PolicySection n="1" title="Cancellation Policy">
          <p className="mb-2">
            If you wish to cancel your enrollment, please contact us at:{" "}
            <a href="mailto:info@vizshila.com" className="text-brand-600 underline">info@vizshila.com</a>
          </p>
          <p className="mb-2">The following conditions apply:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A non-refundable portion of 15% of the total program fee is applicable in all cases.</li>
            <li>If a candidate withdraws before classes begin, they will receive a refund after deducting the non-refundable 15% registration and administrative fee.</li>
          </ul>
        </PolicySection>

        <PolicySection n="2" title="Refund Policy">
          <p className="font-semibold text-slate-700 mb-1">Eligible Refund Cases</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>If a batch is cancelled by Vizshila, candidates may choose a full refund or transfer to the next available batch.</li>
            <li>If a refund request is made before classes start: refund will be processed after deducting the non-refundable 15% fee.</li>
          </ul>
          <p className="font-semibold text-slate-700 mb-1">Non-Refundable Cases</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>No refunds after commencement of training beyond 1 week from batch start, or 5 training hours completed — whichever occurs first.</li>
            <li>No refunds if a candidate discontinues due to personal reasons, attendance issues, job commitments, or non-performance.</li>
            <li>No refunds for downloadable course content, digital resources, certifications, or completed assessments.</li>
          </ul>
        </PolicySection>

        <PolicySection n="3" title="Refund Process">
          <ul className="list-disc pl-5 space-y-1">
            <li>Refund requests must be submitted via official email only</li>
            <li>Proof of payment is mandatory</li>
            <li>Refund approvals are subject to internal verification</li>
            <li>Approved refunds will be processed within 7–10 business days</li>
          </ul>
        </PolicySection>

        <PolicySection n="4" title="Fee Transfer Policy">
          In special cases, batch transfer requests may be considered subject to management approval
          and applicable administrative charges.
        </PolicySection>

        <PolicySection n="5" title="Contact Us">
          For cancellations, refunds, or fee-related support:{" "}
          <a href="mailto:vizshila@vizlogicindia.com" className="text-brand-600 underline">vizshila@vizlogicindia.com</a>
        </PolicySection>
      </div>

    </div>
  );
}

function PolicySection({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="font-semibold text-slate-700 mb-1">{n}. {title}</p>
      <div className="pl-3 border-l-2 border-slate-100">{children}</div>
    </div>
  );
}

export default function AdmissionPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [batchDate, setBatchDate] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/batch-date")
      .then((r) => r.json())
      .then((d) => setBatchDate(d.date || null))
      .catch(() => null);
  }, []);

  function toggle(n: string) {
    setExpanded((prev) => (prev === n ? null : n));
  }

  return (
    <div>
      <PageHeader
        documentTitle="Admission Process"
        eyebrow="Admission"
        title="Ten simple steps from Apply Now to Day 1."
        subtitle="A transparent process designed to be fast, fair and focused on outcomes."
      />

      {batchDate && (
        <div className="bg-accent-500 py-3 text-center text-sm font-semibold text-white">
          Next batch starts from {batchDate} — Limited seats available. Apply today!
        </div>
      )}

      <section className="py-16">
        <div className="container-page">
          <ol className="relative border-l-2 border-accent-500/30 pl-6 sm:pl-8">
            {steps.map((s) => {
              const isOpen = expanded === s.n;
              return (
                <li key={s.n} className="mb-6 last:mb-0">
                  <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-[11px] font-bold text-white">
                    {s.n}
                  </span>
                  <div
                    className={
                      "rounded-xl border bg-white shadow-sm transition-shadow " +
                      (isOpen ? "border-accent-300 shadow-md" : "border-slate-200 hover:shadow-md")
                    }
                  >
                    <button
                      type="button"
                      onClick={() => toggle(s.n)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                    >
                      <div>
                        <div className="text-base font-semibold text-brand-700">
                          Step {s.n}: {s.title}
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">{s.summary}</p>
                      </div>
                      <svg
                        className={
                          "ml-4 h-5 w-5 flex-shrink-0 text-accent-500 transition-transform " +
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
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-600">
                          {s.body}
                        </pre>
                        {s.cta && (
                          <div className="mt-4">
                            <Link
                              to={s.cta.to}
                              className="inline-flex items-center rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
                            >
                              {s.cta.label}
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}

            {/* Step 10 — Terms & Conditions (custom rich body) */}
            <li className="mb-6 last:mb-0">
              <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-[11px] font-bold text-white">
                10
              </span>
              <div
                className={
                  "rounded-xl border bg-white shadow-sm transition-shadow " +
                  (expanded === "10" ? "border-accent-300 shadow-md" : "border-slate-200 hover:shadow-md")
                }
              >
                <button
                  type="button"
                  onClick={() => toggle("10")}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <div className="text-base font-semibold text-brand-700">
                      Step 10: Terms &amp; Conditions
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Terms of Use, Privacy Policy and Cancellation &amp; Refund Policy.
                    </p>
                  </div>
                  <svg
                    className={
                      "ml-4 h-5 w-5 flex-shrink-0 text-accent-500 transition-transform " +
                      (expanded === "10" ? "rotate-180" : "")
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
                </button>

                {expanded === "10" && (
                  <div className="border-t border-slate-100 px-5 pb-6 pt-5">
                    <TermsBody />
                  </div>
                )}
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="container-page text-center">
          <h2 className="section-title">Ready to apply?</h2>
          <p className="mt-3 text-slate-600">The application form takes under 3 minutes.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/fees" className="btn-secondary">See Fees &amp; Scholarships</Link>
            <Link to="/apply" className="btn-primary">Apply Now →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
