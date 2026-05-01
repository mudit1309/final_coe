import { useEffect } from "react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  documentTitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  documentTitle?: string;
}) {
  useEffect(() => {
    if (documentTitle) {
      document.title = `${documentTitle} | Vizshila COE`;
    }
  }, [documentTitle]);

  return (
    <section className="relative overflow-hidden bg-brand-900 text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-grid-slate [background-size:36px_36px] opacity-20"
      />
      <div
        aria-hidden
        className="absolute -top-16 right-10 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl"
      />
      <div className="container-page relative py-16 sm:py-20">
        {eyebrow && (
          <span className="eyebrow bg-white/10 text-accent-400">{eyebrow}</span>
        )}
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-slate-300">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
