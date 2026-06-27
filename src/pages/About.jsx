import React from 'react';
import { User, Cpu, Mail, GraduationCap } from 'lucide-react';

const About = () => {
  return (
    <>
      {/* About Section */}
      <section id="about" className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
              <User size={20} />
              <span>ABOUT ME</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Software Engineer for Remote Product Teams
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg mb-10">
              <p>
                I work with founders, agencies, and remote product teams to deliver scalable, high-performance web systems with clean architecture and long-term stability.
              </p>
              <p>
                Specializing in React.js and Python, I bring end-to-end ownership to product builds. My delivery process combines disciplined implementation, practical engineering decisions, and active async communication.
              </p>
              <p>
                Currently at ExhiByte Solution, I work across the full stack—building APIs, developing user interfaces, managing databases, and optimizing system performance, with hands-on experience contributing to real-world fleet management, ERP, healthcare, and booking platforms.
              </p>
            </div>

            {/* Delivery & Collaboration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              {/* Delivery Approach */}
              <div className="p-8 bg-slate-900/50 rounded-2xl border border-slate-800/80 shadow-lg hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                    <Cpu size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Delivery Approach</h3>
                </div>
                <ul className="space-y-4 text-slate-400 text-sm leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                    <span><strong>End-to-End Ownership:</strong> Managed software builds from initial database schemas to dockerized server deployment.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                    <span><strong>Maintainability First:</strong> Focusing on modular system structure, strict type safety, and clean SQL query execution.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                    <span><strong>Transparent Timelines:</strong> Delivering project objectives through milestone mapping and thorough code handoffs.</span>
                  </li>
                </ul>
              </div>

              {/* Remote Collaboration */}
              <div className="p-8 bg-slate-900/50 rounded-2xl border border-slate-800/80 shadow-lg hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                    <Mail size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Remote Collaboration</h3>
                </div>
                <ul className="space-y-4 text-slate-400 text-sm leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                    <span><strong>Clear Async Communication:</strong> Structured progress briefs, proactive issue logs, and daily status syncs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                    <span><strong>Milestone Delivery:</strong> Setting practical deliverables structured around bi-weekly client shipping sprints.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                    <span><strong>Self-Sufficient Execution:</strong> Resolving technical bottlenecks autonomously without administrative overhead.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Timeline */}
      <section id="education" className="py-24 bg-slate-950 border-t border-slate-900">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="text-blue-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Education</h2>
          </div>

          <div className="relative pl-8 border-l border-slate-800 space-y-12">
            <div className="relative">
              <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-blue-500 border-4 border-slate-950 shadow-lg shadow-blue-500/50"></div>
              <div className="mb-2">
                <span className="text-blue-400 font-bold text-xs tracking-wide uppercase px-2 py-0.5 rounded bg-blue-950/50 border border-blue-900/50">JUNE 2023 - APRIL 2026</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Bachelor of Computer Application (IT)</h3>
              <div className="text-slate-400 font-medium mb-2">Veer Narmad South Gujarat University • Surat</div>
              <div className="inline-block px-3 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">
                CGPA: 7.85
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-slate-700 border-4 border-slate-950"></div>
              <div className="mb-2">
                <span className="text-slate-500 font-bold text-xs tracking-wide uppercase px-2 py-0.5 rounded bg-slate-900/50 border border-slate-800">MARCH 2023</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Higher Secondary Certificate (H.S.C.)</h3>
              <div className="text-slate-400 font-medium mb-2">G.S.H.S.E.B</div>
              <div className="inline-block px-3 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">
                Percentage: 85.33%
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
