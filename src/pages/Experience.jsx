import React from 'react';
import { Briefcase } from 'lucide-react';
import SEO from '../components/SEO';

const Experience = () => {
  return (
    <section id="experience" className="py-24">
      <SEO
        title="Professional Experience | Poojan Anghan"
        description="Explore Poojan Anghan's professional career as a Software Engineer, spanning full-stack React and Python development."
        keywords="Poojan Anghan Career, Experience, Software Engineer Resume, Python Developer Surat"
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Briefcase className="text-emerald-400" size={28} />
          <h1 className="text-3xl font-bold text-white">Experience</h1>
        </div>

        <div className="relative pl-8 border-l border-slate-800 space-y-12">
          {/* ExhiByte Solution */}
          <div className="relative">
            <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-lg shadow-emerald-500/50"></div>
            <div className="mb-2">
              <span className="text-emerald-400 font-bold text-xs tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-900/50">AUG 2025 - PRESENT</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Software Engineer (React.js & Python)</h3>
            <div className="text-slate-400 font-medium mb-3">ExhiByte Solution • Surat, Gujarat</div>
            <div className="text-slate-400 text-sm leading-relaxed space-y-2">
              <p>Developing custom web solutions and enterprise business software using React.js, FastAPI, and Flask. Focus on high-performance SPAs, robust admin dashboards, database design, and system automation workflows.</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 mt-2">
                <li><strong>Full-Stack Ownership:</strong> Architected end-to-end web applications, ensuring reliable user flows and optimized server execution speed.</li>
                <li><strong>Frontend Excellence:</strong> Created responsive user interfaces with reusable React components, managing application state and visual interactions.</li>
                <li><strong>Robust Backend & APIs:</strong> Built high-throughput REST APIs and managed database querying logic to ensure low latency under load.</li>
                <li><strong>Business Impact:</strong> Contributed directly to fleet management, HR, booking platforms, and automation tools that reduced manual workflows.</li>
              </ul>
            </div>
          </div>

          {/* Tryon Infotech - Developer */}
          <div className="relative">
            <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-emerald-500/50 border-4 border-slate-950"></div>
            <div className="mb-2">
              <span className="text-emerald-400/80 font-bold text-xs tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-900/30">JULY 2023 - JULY 2025</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Python Developer</h3>
            <div className="text-slate-400 font-medium mb-3">Tryon Infotech • Surat, Gujarat</div>
            <div className="text-slate-400 text-sm leading-relaxed space-y-2">
              <p>Developed and maintained server-side systems and RESTful APIs using Django, Flask, and MySQL. Partnered with remote client teams to deliver custom ERP platforms and software modules.</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 mt-2">
                <li><strong>ERP Modules:</strong> Successfully shipped modular business systems across textile manufacturing, healthcare, and booking platforms, replacing manual spreadsheets for daily operations.</li>
                <li><strong>API Engineering:</strong> Developed secure, scalable REST APIs and integrated third-party payment, map, and data services.</li>
                <li><strong>Security & Database Optimization:</strong> Implemented secure authentication workflows (OAuth2, token-based), designed complex database schemas, and optimized SQL performance.</li>
              </ul>
            </div>
          </div>

          {/* Tryon Infotech - Intern */}
          <div className="relative">
            <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-slate-700 border-4 border-slate-950"></div>
            <div className="mb-2">
              <span className="text-slate-500 font-bold text-xs tracking-wide uppercase px-2 py-0.5 rounded bg-slate-900/50 border border-slate-800">MAY 2023 - JUNE 2023</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Python Intern</h3>
            <div className="text-slate-400 font-medium mb-2">Tryon Infotech • Surat, Gujarat</div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gained initial industry exposure, learning professional backend coding practices, REST principles, and assisting in the development of modular Python-based utilities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
