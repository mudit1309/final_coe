import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { GuestLectureWidget } from "./components/GuestLectureWidget";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ProgramPage from "./pages/Program";
import CurriculumPage from "./pages/Curriculum";
import CareerPathPage from "./pages/CareerPath";
import AdmissionPage from "./pages/Admission";
import FeesPage from "./pages/Fees";
import ApplyPage from "./pages/Apply";
import FeeLookupPage from "./pages/FeeLookup";
import MyApplicationPage from "./pages/MyApplication";
import OemPartnersPage from "./pages/OemPartners";
import AdminPage from "./pages/Admin";
import NotFoundPage from "./pages/NotFound";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/career-path" element={<CareerPathPage />} />
          <Route path="/admission" element={<AdmissionPage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/fee-payment" element={<FeeLookupPage />} />
          <Route path="/my-application" element={<MyApplicationPage />} />
          <Route path="/oem-partners" element={<OemPartnersPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <GuestLectureWidget />
    </div>
  );
}
