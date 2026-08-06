import React from 'react';
import { Terminal, Database, Shield, Zap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const itFaqs = [
  {
    question: "When should a business hire an IT consulting partner?",
    answer: "Hire an IT consultant when experiencing database slowness, technical debt, scaling bottlenecks, planning legacy system modernization, or needing independent architecture review before building new software."
  },
  {
    question: "What backend technologies do you specialize in for IT consulting?",
    answer: "I specialize in Python ecosystem backends (Django, Django REST Framework, FastAPI, Flask), PostgreSQL/MySQL database tuning, RESTful API design, Docker containerization, and cloud deployment."
  }
];

const ITConsulting = () => {
  return (
    <>
      <SEO
        title="Enterprise IT Consulting & Systems Architecture | Poojan Anghan"
        description="Strategic IT consulting, systems architecture design, database optimization, and cloud backend security audits for growing businesses and tech companies."
        keywords="Enterprise IT Consulting, Software Systems Architecture, Backend Engineering Consultant, Database Performance Audit, Python Django FastAPI Advisory"
        faq={itFaqs}
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
              IT Consulting & Solutions
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
              Enterprise IT Consulting & Systems Architecture
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
              Partnering with business leaders, CTOs, and product managers to design scalable backend architectures, optimize slow database engines, and secure enterprise software systems.
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

      {/* FAQ Section */}
      <section className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-emerald-400 font-bold text-xs tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-900/50">FAQ</span>
            <h2 className="text-3xl font-bold text-white mt-3 mb-3">IT Consulting FAQ</h2>
          </div>
          <div className="space-y-6">
            {itFaqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ITConsulting;
