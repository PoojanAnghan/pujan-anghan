import React from 'react';
import { Code2, Cpu, Globe, Rocket, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const WebDevelopment = () => {
  return (
    <>
      <SEO
        title="Full-Stack Web Application Development | Poojan Anghan"
        description="Professional custom web development services. Responsive React.js frontends, Python (FastAPI/Django) backend architectures, dashboard portals, and third-party integrations."
        keywords="Web Development Surat, React Developer India, Python Web Developer, Freelance Web Engineer"
      />
      <section className="py-20 bg-slate-950 text-white min-h-[calc(100vh-80px)] flex items-center">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back button */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>

          {/* Hero header */}
          <div className="mb-12">
            <span className="text-emerald-400 font-bold text-xs tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-900/50">
              Development Services
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
              Full-Stack Web Application Development
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
              I build production-grade web applications designed for performance, responsive interaction, and maintainable operations. From initial UI layouts to secure server endpoints, I handle the development lifecycle with precision.
            </p>
          </div>

          {/* Deep-dive sections */}
          <div className="space-y-12 mt-12">
            {/* Core Capability 1 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 hover:border-emerald-500/20 transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Globe size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Custom Web & Admin Dashboards</h2>
              </div>
              <div className="text-slate-400 text-sm md:text-base leading-relaxed space-y-3">
                <p>
                  I build modular Single Page Applications (SPAs) using React.js, Vite, and Tailwind CSS. My focus is on creating clean, intuitive interfaces that load quickly and adapt beautifully across mobile, tablet, and desktop viewports.
                </p>
                <p>
                  Specializing in dashboard structures, multi-tenant administrative systems, and telemetry panels, I write clean React component structures that optimize DOM updates and ensure smooth data rendering.
                </p>
              </div>
            </div>

            {/* Core Capability 2 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 hover:border-emerald-500/20 transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Cpu size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">RESTful & GraphQL API Integration</h2>
              </div>
              <div className="text-slate-400 text-sm md:text-base leading-relaxed space-y-3">
                <p>
                  Web apps rely on fast, structured backends. I develop and integrate RESTful APIs using Python frameworks such as Django REST Framework (DRF), FastAPI, or Flask.
                </p>
                <p>
                  By creating clear JSON structures, input validators, and secure token access layers, I establish a robust communication bridge between front-end components and server databases, reducing data payload overhead.
                </p>
              </div>
            </div>

            {/* Core Capability 3 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 hover:border-emerald-500/20 transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Rocket size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Third-Party Operations & Deployment</h2>
              </div>
              <div className="text-slate-400 text-sm md:text-base leading-relaxed space-y-3">
                <p>
                  Modern platforms require seamless integration with services like Stripe payment gateways, Supabase database storage, Google Analytics 4 (GA4), and Google AdSense.
                </p>
                <p>
                  I build these integrations following strict security patterns, using webhook authentication and secure environment values. Additionally, I deliver containerized environments (Docker) and setup pipelines for automated deployments (Vercel, GitHub Actions).
                </p>
              </div>
            </div>

            {/* CTA section */}
            <div className="mt-16 text-center py-10 bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-emerald-950/20 rounded-2xl border border-emerald-500/10">
              <h3 className="text-2xl font-bold text-white mb-3">Ready to Build Your Product?</h3>
              <p className="text-slate-400 max-w-xl mx-auto mb-6 text-sm md:text-base">
                Whether you need a fresh MVP build or ongoing feature enhancements, let's connect to map your requirements to code.
              </p>
              <Link
                to="/quote"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WebDevelopment;
