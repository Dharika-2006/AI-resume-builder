import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import TemplatesShowcase from '../components/landing/TemplatesShowcase';
import ATSShowcase from '../components/landing/ATSShowcase';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Dynamic Background Grid and Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40 z-0" />
      
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Landing Page Content Sections */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <TemplatesShowcase />
        <ATSShowcase />
        <Testimonials />
        <FAQ />
        <CTASection />
        <Footer />
      </div>

    </div>
  );
}
