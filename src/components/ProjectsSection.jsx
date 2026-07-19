import React, { useState } from 'react';
import { ExternalLink, Github, Globe, Cpu, Settings } from 'lucide-react';
import SEO from './SEO';

const projectsData = [
  {
    id: 1,
    title: "LogiTrack — Enterprise Fleet Management ERP",
    category: "Web app",
    problem: "Legacy spreadsheets and high API response times for vehicle telemetry led to coordination lag, causing average logistics delays of 14% across transit lanes.",
    outcome: "Improved real-time shipment monitoring accuracy to 99% and slashed delivery coordinate mapping latency by 74%.",
    metrics: ["99% Telemetry Accuracy", "↓ 74% Latency"],
    stack: ["React", "FastAPI", "PostgreSQL", "Tailwind CSS"],
    demoUrl: "https://github.com/PoojanAnghan",
    githubUrl: "https://github.com/PoojanAnghan"
  },
  {
    id: 2,
    title: "SecureDrop — Cryptographic File Sharing API",
    category: "API",
    problem: "Secure document sharing for contract bids needed client-side confidentiality without complex key management.",
    outcome: "Shipped a zero-knowledge file-sharing service using client-side AES-256 encryption and self-purging server logs.",
    metrics: ["100% Client Decrypted", "0% Plaintext Logs"],
    stack: ["JavaScript", "CryptoJS", "Vercel API", "Node.js"],
    demoUrl: "https://github.com/PoojanAnghan",
    githubUrl: "https://github.com/PoojanAnghan"
  },
  {
    id: 3,
    title: "TexFlow — Textile Inventory Automation Tool",
    category: "Tool",
    problem: "A local textile manufacturer needed to automate inventory tracking to replace manual spreadsheet errors.",
    outcome: "Shipped a custom inventory tracking engine integrated with real-time stock notifications.",
    metrics: ["↓ 60% manual work", "98% Stock Accuracy"],
    stack: ["Python", "Flask", "MySQL", "Docker"],
    demoUrl: "https://github.com/PoojanAnghan",
    githubUrl: "https://github.com/PoojanAnghan"
  }
];

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Web app", "API", "Tool"];

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Web app":
        return <Globe size={16} className="text-emerald-400" />;
      case "API":
        return <Cpu size={16} className="text-blue-400" />;
      case "Tool":
        return <Settings size={16} className="text-amber-400" />;
      default:
        return <Globe size={16} className="text-emerald-400" />;
    }
  };

  const getCategoryTagColor = (category) => {
    switch (category) {
      case "Web app":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "API":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "Tool":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    }
  };

  const filteredProjects = activeCategory === "All"
    ? projectsData
    : projectsData.filter(p => p.category === activeCategory);

  return (
    <section className="py-20 bg-slate-950 text-white border-t border-slate-900">
      <SEO
        title="Projects by Poojan Anghan | Software Engineer Portfolio"
        description="Explore software engineering projects and case studies built by Poojan Anghan, featuring custom enterprise ERPs, cryptographic sharing APIs, and backend automation."
        keywords="Software Engineering Projects, Case Studies, React Portfolio, Python Backend Projects, ERP Development"
      />
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-emerald-400 font-bold text-xs tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-900/50">
            Selected Work
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4">
            Projects & Case Studies
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Clean code, scalable backends, and robust frontend logic delivered remotely to global clients.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                activeCategory === cat
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CSS Grid */}
        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              data-tags={project.category}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 shadow-xl flex flex-col justify-between h-full group"
            >
              <div>
                {/* 1. Icon + category tag (top row) */}
                <div className="flex items-center gap-2 mb-4">
                  {getCategoryIcon(project.category)}
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryTagColor(project.category)}`}>
                    {project.category}
                  </span>
                </div>

                {/* 2. Project title */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>

                {/* 3. Problem — one sentence: what the client needed */}
                <div className="mb-4">
                  <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
                    Problem
                  </span>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {project.problem}
                  </p>
                </div>

                {/* 4. Divider */}
                <hr className="border-slate-800 my-4" />

                {/* 5. Outcome label + one sentence: what changed after the build */}
                <div className="mb-6">
                  <span className="block text-xs uppercase tracking-wider text-emerald-500 font-bold mb-1">
                    Outcome
                  </span>
                  <p className="text-sm text-slate-350 leading-relaxed font-medium">
                    {project.outcome}
                  </p>
                </div>
              </div>

              <div>
                {/* 6. Metric chips — 2 short stat badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.metrics.map(metric => (
                    <span
                      key={metric}
                      className="text-[11px] font-bold tracking-tight text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-md px-2.5 py-1 flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                      {metric}
                    </span>
                  ))}
                </div>

                {/* 7. Stack chips — tech used, listed last */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.stack.map(tech => (
                    <span
                      key={tech}
                      className="text-[10px] text-slate-400 border border-slate-800 bg-slate-950/40 rounded px-2 py-0.5 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* 8. Footer — "Live demo" and "Code" buttons
                <div className="flex items-center gap-3 pt-2">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      <ExternalLink size={12} />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 border border-slate-805 text-slate-350 hover:text-white transition-all"
                    >
                      <Github size={12} />
                      Code
                    </a>
                  )}
                </div> */}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
