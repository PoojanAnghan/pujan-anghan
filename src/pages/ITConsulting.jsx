import React from 'react';
import { Terminal, Database, Shield, Zap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ITConsulting = () => {
  return (
    <>
      <SEO
        title="IT Consulting & Systems Architecture Services | Poojan Anghan"
        description="Professional freelance IT consulting and system architecture services. Specializing in Python backends, FastAPI/Django systems design, Postgres database tuning, and API security audits."
        keywords="IT Consulting Surat, Software Architecture, Database Optimization, Django Developer, FastAPI Consultant"
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
              Technical Advisory
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
              IT Consulting & Technical Systems Architecture
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
              I partner with product founders, CTOs, and technical managers to plan, structure, and optimize backend systems. My advisory focuses on building reliable foundations that sustain active business growth without technical debt.
            </p>
          </div>

          {/* Deep-dive sections */}
          <div className="space-y-12 mt-12">
            {/* Core Capability 1 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 hover:border-emerald-500/20 transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Terminal size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">System Architecture & Tech Stack Strategy</h2>
              </div>
              <div className="text-slate-400 text-sm md:text-base leading-relaxed space-y-3">
                <p>
                  Choosing the correct tech stack and layout is critical. I evaluate system requirements to recommend frameworks (FastAPI, Django, Flask) and data flows that fit project scope.
                </p>
                <p>
                  By evaluating data complexity, user throughput, and performance targets, we establish clean separation of concerns. This ensures your microservices or modular monoliths scale predictably while minimizing infrastructure costs.
                </p>
              </div>
            </div>

            {/* Core Capability 2 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 hover:border-emerald-500/20 transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Database size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Database Design & Query Tuning</h2>
              </div>
              <div className="text-slate-400 text-sm md:text-base leading-relaxed space-y-3">
                <p>
                  Slow databases represent the number-one bottleneck in web platforms. I audit relational structures, construct optimal indexes, and refactor slow SQL queries inside Django ORM, SQLAlchemy, or raw SQL pipelines.
                </p>
                <p>
                  Whether implementing connection pools, setting up read replicas, or partitioning large tables, my database optimization audits restore milliseconds to client API times and lower CPU consumption on databases.
                </p>
              </div>
            </div>

            {/* Core Capability 3 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 hover:border-emerald-500/20 transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Shield size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Security Audits & Authentication Workflow</h2>
              </div>
              <div className="text-slate-400 text-sm md:text-base leading-relaxed space-y-3">
                <p>
                  Web system security requires strict token authentication and request boundaries. I design robust OAuth2/JWT workflows, role-based access control (RBAC), and review backend handlers to prevent vulnerabilities.
                </p>
                <p>
                  From configuring CORS headers correctly to adding secure environment secret management, I ensure that client databases and server communication channels comply with modern web security practices.
                </p>
              </div>
            </div>

            {/* CTA section */}
            <div className="mt-16 text-center py-10 bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-emerald-950/20 rounded-2xl border border-emerald-500/10">
              <h3 className="text-2xl font-bold text-white mb-3">Need Technical Guidance?</h3>
              <p className="text-slate-400 max-w-xl mx-auto mb-6 text-sm md:text-base">
                Let's schedule a session to review your system topology, find backend bottlenecks, or audit your database schema.
              </p>
              <Link
                to="/quote"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ITConsulting;
