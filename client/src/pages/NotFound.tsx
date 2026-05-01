import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="container-page text-center">
        <div className="text-6xl font-extrabold text-brand-700">404</div>
        <h1 className="mt-4 text-2xl font-bold text-brand-700 sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-slate-600">
          The page you're looking for doesn't exist or was moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="btn-secondary">Back to Home</Link>
          <Link to="/apply" className="btn-primary">Apply Now →</Link>
        </div>
      </div>
    </section>
  );
}
