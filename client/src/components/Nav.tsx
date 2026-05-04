import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/about", label: "About COE" },
  { to: "/program", label: "Program" },
  { to: "/curriculum", label: "Curriculum" },
  { to: "/career-path", label: "Career Path" },
  { to: "/admission", label: "Admission" },
  { to: "/fees", label: "Fees" },
  { to: "/oem-partners", label: "OEM" },
  { to: "/my-application", label: "My Application" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.avif"
            alt="Vizlogic"
            className="h-10 w-auto"
          />
          <div className="leading-tight">
            <div className="text-sm font-bold text-brand-700">VIZSHILA</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500">
              
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                "text-sm font-medium link-underline " +
                (isActive ? "text-brand-700" : "text-slate-700 hover:text-brand-600")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/apply" className="btn-primary px-4 py-2 text-sm">
            Apply Now
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-slate-700 md:hidden"
          aria-label="Toggle navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/apply"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
