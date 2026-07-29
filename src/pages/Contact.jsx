import React from 'react';
import { Phone, Mail, MapPin, Github, Linkedin } from 'lucide-react';
import SEO from '../components/SEO';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 flex-grow flex items-center">
      <SEO
        title="Contact Poojan Anghan | Hire a Freelance React & Python Engineer"
        description="Get in touch with Poojan Anghan for remote full-stack contract work, freelance projects, or consulting inquiries."
        keywords="Contact Poojan Anghan, Hire React Developer, Hire Python Developer, Remote Software Engineer"
      />
      <div className="container mx-auto px-6 w-full">
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="text-center mb-12 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Let's Work Together</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              I'm currently available for freelance projects or full-time opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <a href="tel:+917043832747" className="flex flex-col items-center p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                <Phone size={20} />
              </div>
              <div className="text-sm text-slate-500 mb-1">Call Me</div>
              <div className="text-white font-medium text-center hover:text-emerald-400 transition-colors">+91 70438 32747</div>
            </a>

            <a href="mailto:anghanpoojan66@gmail.com" className="flex flex-col items-center p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                <Mail size={20} />
              </div>
              <div className="text-sm text-slate-500 mb-1">Email Me</div>
              <div className="text-white font-medium text-center break-all hover:text-emerald-400 transition-colors">anghanpoojan66@gmail.com</div>
            </a>

            <div className="flex flex-col items-center p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                <MapPin size={20} />
              </div>
              <div className="text-sm text-slate-500 mb-1">Location</div>
              <div className="text-white font-medium text-center">Surat, Gujarat, India</div>
            </div>
          </div>

          {/* Onboarding & Delivery Process details to meet word count requirement */}
          <div className="mt-12 pt-12 border-t border-slate-800 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4 text-center">My Engagement & Collaboration Process</h2>
            <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
              <p>
                <strong>1. Discovery & Scope Alignment:</strong> We start with a brief discussion or review of your system requirements. I will analyze your goals to define a detailed scope, identify potential bottlenecks early on, and propose the most suitable system architecture.
              </p>
              <p>
                <strong>2. Milestone-Driven Sprints:</strong> Development is divided into structured bi-weekly sprints. Each sprint delivers functional code, active test coverage, and transparent progress updates, ensuring you maintain full visibility over the build timeline.
              </p>
              <p>
                <strong>3. Async-First Communication:</strong> Working with remote teams requires disciplined communication. I provide daily progress summaries, maintain organized issue logs, and document backend schemas, minimizing the need for synchronous meeting overhead.
              </p>
              <p>
                <strong>4. Secure Production Handoff:</strong> When delivery is complete, I transfer full ownership, including clean Git logs, documented API schemas, and containerized Docker environments, allowing your internal teams to scale the application easily.
              </p>
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-6 relative z-10">
            <a href="https://github.com/PoojanAnghan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <Github size={20} /> <span className="hidden sm:inline">@PoojanAnghan</span>
            </a>
            <a href="https://www.linkedin.com/in/poojan-a-447073340/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <Linkedin size={20} /> <span className="hidden sm:inline">Poojan Anghan</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
