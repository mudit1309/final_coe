import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";

type Partner = {
  id: number;
  name: string;
  category: "oem" | "partner";
  description: string;
  logo_url: string;
  website_url: string;
  display_order: number;
};

export default function OemPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partners")
      .then((r) => r.json())
      .then((d) => setPartners(d.partners || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const oems = partners.filter((p) => p.category === "oem").sort((a, b) => a.display_order - b.display_order);
  const partnerList = partners.filter((p) => p.category === "partner").sort((a, b) => a.display_order - b.display_order);

  return (
    <div>
      <PageHeader
        documentTitle="OEM & Partners"
        eyebrow="OEM & Partners"
        title="Our Technology Partners & OEM Network"
        subtitle="Vizlogic COE collaborates with leading OEM manufacturers and channel partners to deliver industry-relevant, hands-on training."
      />

      <section className="py-16">
        <div className="container-page">
          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading partners…</div>
          ) : partners.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              Partner listings are being updated. Check back soon.
            </div>
          ) : (
            <div className="space-y-16">
              {oems.length > 0 && (
                <div>
                  <div className="mb-8 text-center">
                    <div className="text-xs font-semibold uppercase tracking-widest text-accent-600">Technology Partners</div>
                    <h2 className="mt-1 text-2xl font-bold text-brand-700">OEM Manufacturers</h2>
                    <p className="mt-2 text-slate-500 text-sm max-w-xl mx-auto">
                      We are authorized training partners with these leading manufacturers.
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {oems.map((p) => (
                      <PartnerCard key={p.id} partner={p} />
                    ))}
                  </div>
                </div>
              )}

              {partnerList.length > 0 && (
                <div>
                  <div className="mb-8 text-center">
                    <div className="text-xs font-semibold uppercase tracking-widest text-accent-600">Channel Network</div>
                    <h2 className="mt-1 text-2xl font-bold text-brand-700">Industry Partners</h2>
                    <p className="mt-2 text-slate-500 text-sm max-w-xl mx-auto">
                      Companies and organizations we collaborate with for placements and projects.
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {partnerList.map((p) => (
                      <PartnerCard key={p.id} partner={p} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  const content = (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {partner.logo_url ? (
        <div className="mb-4 flex h-16 items-center">
          <img
            src={partner.logo_url}
            alt={partner.name}
            className="max-h-14 max-w-[160px] object-contain"
          />
        </div>
      ) : (
        <div className="mb-4 flex h-16 items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-xl font-bold text-brand-600">
            {partner.name.charAt(0)}
          </div>
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-start gap-2">
          <h3 className="font-bold text-brand-700">{partner.name}</h3>
          <span className={`mt-0.5 flex-none rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
            partner.category === "oem"
              ? "border-accent-200 bg-accent-50 text-accent-700"
              : "border-brand-200 bg-brand-50 text-brand-600"
          }`}>
            {partner.category === "oem" ? "OEM" : "Partner"}
          </span>
        </div>
        {partner.description && (
          <p className="mt-2 text-sm text-slate-600">{partner.description}</p>
        )}
      </div>
      {partner.website_url && (
        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-accent-600 font-medium">
          Visit website →
        </div>
      )}
    </div>
  );

  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}
