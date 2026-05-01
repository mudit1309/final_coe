import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-brand-900 text-slate-200">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img
              src="/logo.avif"
              alt="Vizlogic"
              className="h-10 w-auto"
            />
            <div className="leading-tight">
              <div className="text-sm font-bold text-white">Vizshila</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400">
                
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            India's talent transformation engine for the DMS / SFA ecosystem.
            Converting raw potential into industry-ready professionals.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold text-white">Program</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li><Link className="hover:text-white" to="/program">V-CSAP Program</Link></li>
            <li><Link className="hover:text-white" to="/curriculum">Curriculum</Link></li>
            <li><Link className="hover:text-white" to="/career-path">Career Path</Link></li>
            <li><Link className="hover:text-white" to="/fees">Fees & Scholarships</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-white">Admission</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li><Link className="hover:text-white" to="/admission">Process</Link></li>
            <li><Link className="hover:text-white" to="/apply">Apply Now</Link></li>
            <li><Link className="hover:text-white" to="/about">About COE</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-white">Contact</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>vizshila@vizlogicindia.com</li>
            <li>Mon–Sat, 10am–6pm IST</li>
            <li>Vizshila, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Vizlogic. All rights reserved.</p>
          <p>Vizlogic Certified Sales Automation Professional (V-CSAP)</p>
        </div>
      </div>
    </footer>
  );
}
