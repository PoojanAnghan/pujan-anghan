import React from 'react';
import { Code2, Terminal, Database, Cpu } from 'lucide-react';

const Services = () => {
  return (
    <>
      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-bold text-xs tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-900/50">Services</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4">Freelance Services for Remote Product Teams</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Delivery-focused engineering support for startups, agencies, and businesses that need consistent remote execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 hover:border-emerald-500/30 transition-all duration-300 shadow-lg group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Code2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Web App Development</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                React.js and Python product builds, admin dashboards, multi-tenant systems, and custom business platforms designed for modern web operations.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 hover:border-emerald-500/30 transition-all duration-300 shadow-lg group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Terminal size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Backend & API Engineering</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Secure server-side business logic, robust REST APIs (Django, FastAPI, Flask), token-based authentication workflows, and scalable data schema design.
              </p>
            </div>
          </div>

          {/* Engagement Models */}
          <div className="mt-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 max-w-5xl mx-auto shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-8 text-center sm:text-left">Flexible Engagement Models</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-emerald-400 font-bold text-base mb-2">Project-Based Freelance</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Defined scope, milestone-based delivery, predictable timelines, and fixed outcomes for startup MVPs or new features.
                </p>
              </div>
              <div>
                <h4 className="text-emerald-400 font-bold text-base mb-2">Long-Term Remote Support</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Ongoing feature updates and active technical development acting as your dedicated full-stack remote engineering partner.
                </p>
              </div>
              <div>
                <h4 className="text-emerald-400 font-bold text-base mb-2">MVP to Scale Journey</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Fast initial releases for market validation, followed by security hardening, database query optimization, and performance scaling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 relative bg-slate-900/30 border-t border-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technical Expertise</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              My technical toolbelt for building robust backend systems and intelligent applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Frontend & Web */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all hover:bg-slate-800/50 group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Code2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Frontend</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> React.js
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> JavaScript
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> HTML5 / CSS3
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Responsive UI Design
                </li>
              </ul>
            </div>

            {/* Backend & APIs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all hover:bg-slate-800/50 group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Terminal size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Backend</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Python
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Django (DRF)
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Flask / FastAPI
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> REST API Design
                </li>
              </ul>
            </div>

            {/* Databases & DevOps */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:bg-slate-800/50 group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Databases & Tools</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> SQL (MySQL / Postgres)
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> MongoDB
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> Docker
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> Git & GitHub
                </li>
              </ul>
            </div>

            {/* Concepts & Core */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-orange-500/30 transition-all hover:bg-slate-800/50 group">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Core Concepts</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Full-Stack Development
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> OOPS Concepts
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Database Design
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> System Optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
