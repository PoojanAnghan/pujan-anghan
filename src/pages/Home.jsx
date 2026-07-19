import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

const Home = () => {
  const [terminalLogs, setTerminalLogs] = useState([]);

  const fullLogs = [
    '$ ssh guest@poojan.dev',
    'Connection established (protocol: TLSv1.3)',
    'Initializing Software Engineer diagnostic...',
    'Loading active stack parameters...',
    'Role: Software Engineer (React.js & Python)',
    'Skills: Django, FastAPI, Flask, React.js, SQL, MongoDB, Docker',
    'Checking exhibits-database connection... OK',
    'Running system checks... 100% Operational',
    'Status: Available for Remote Global Collaboration.',
    'System ready.'
  ];

  useEffect(() => {
    setTerminalLogs([]);
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < fullLogs.length) {
        const logToAppend = fullLogs[currentIdx];
        if (logToAppend !== undefined) {
          setTerminalLogs((prev) => [...prev, logToAppend]);
        }
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <SEO
        title="Poojan Anghan — Software Engineer | React.js & Python Specialist"
        description="Portfolio of Poojan Anghan, a freelance Software Engineer specializing in React.js, Python (Django, FastAPI, Flask), and REST API design. Shipped 10+ scalable remote projects."
        keywords="Poojan Anghan, Software Engineer, React Developer, Python Developer, Django Developer, FastAPI Developer, Freelance Developer Surat"
      />
      {/* 1. Hero Section (Above the fold) */}
      <section id="home" className="relative min-h-[calc(100vh-80px)] flex items-center py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Text Content */}
            <div className="lg:text-left flex flex-col justify-center animate-fade-in-up order-2 lg:order-1">
              
              {/* Availability badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium backdrop-blur-sm w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Available for freelance projects
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                Hi, I'm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Poojan Anghan</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-slate-450 mb-10 leading-relaxed max-w-2xl">
                I enable companies to launch high-performance digital solutions spanning web and mobile, combining clean architecture, transparent updates, and on-time project execution.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mb-10 w-full sm:w-auto">
                <Link
                  to="/quote"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Get a Quote
                  <ChevronRight size={18} />
                </Link>
                <Link
                  to="/experience"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  View My Work
                </Link>
              </div>

              {/* Stack pills */}
              <div className="flex gap-3 flex-wrap items-center">
                <span className="text-slate-500 text-sm font-medium">Stack:</span>
                {["React", "Django", "FastAPI", "TypeScript", "PostgreSQL", "Tailwind CSS", "Docker"].map(t => (
                  <span key={t} className="text-slate-400 text-xs border border-slate-800 bg-slate-900/40 backdrop-blur-sm rounded-md px-3 py-1 font-medium hover:border-emerald-500/35 transition-colors">{t}</span>
                ))}
              </div>

            </div>

            {/* Right: Profile Photo */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                {/* Glow effect behind photo */}
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent rounded-full blur-2xl"></div>
                
                {/* Decorative ring */}
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 rounded-full opacity-20"></div>
                
                {/* Photo container */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-2xl shadow-emerald-900/20">
                  <img
                    src={`${import.meta.env.BASE_URL}profile.jpg`}
                    alt="Poojan Anghan - Full-Stack Web Developer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Floating accent dots */}
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-400 rounded-full animate-pulse shadow-lg shadow-teal-400/50" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. System Status & Metrics (Below the fold) */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Stats & Brief Info */}
            <div className="space-y-6">
              <div>
                <span className="text-emerald-400 font-bold text-xs tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-900/50">Metrics & Delivery</span>
                <h2 className="text-3xl font-bold text-white mt-4 mb-4">Remote Consulting Capacity</h2>
                <p className="text-slate-400 leading-relaxed text-base">
                  By tracking telemetry, building optimized databases, and deploying clean code within containers, I ensure that application infrastructure is robust and matches high production standards.
                </p>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center backdrop-blur shadow-md hover:border-emerald-500/25 transition-all">
                  <span className="block text-xl sm:text-2xl font-bold text-emerald-400 mb-1">3+ Years</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Production Coding</span>
                </div>
                <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center backdrop-blur shadow-md hover:border-emerald-500/25 transition-all">
                  <span className="block text-xl sm:text-2xl font-bold text-emerald-400 mb-1">10+</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Delivered</span>
                </div>
                <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center backdrop-blur shadow-md hover:border-emerald-500/25 transition-all">
                  <span className="block text-xl sm:text-2xl font-bold text-emerald-400 mb-1">Remote</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Global Work</span>
                </div>
              </div>
            </div>

            {/* Right: Terminal Console */}
            <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
              <div className="absolute inset-0 bg-emerald-600/5 rounded-2xl blur-xl"></div>
              
              {/* Terminal Window */}
              <div className="relative border border-slate-800 bg-slate-900/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <p className="font-mono text-[10px] text-slate-500">remote://diagnostic-console</p>
                  <div className="w-8"></div>
                </div>

                {/* Console Output */}
                <div className="p-5 font-mono text-xs sm:text-sm h-64 overflow-y-auto text-left flex flex-col justify-end space-y-1.5">
                  {terminalLogs.map((log, index) => {
                    if (!log || typeof log !== 'string') return null;
                    const isCmd = log.startsWith('$');
                    const isHighlight = log.includes('OK') || log.includes('Operational') || log.includes('ready');
                    return (
                      <p
                        key={index}
                        className={
                          isCmd
                            ? 'text-slate-400'
                            : isHighlight
                            ? 'text-emerald-400 font-semibold'
                            : 'text-slate-350'
                        }
                      >
                        {isCmd ? <span className="text-slate-500 mr-2">$</span> : null}
                        {isCmd ? log.substring(2) : log}
                      </p>
                    );
                  })}
                  {terminalLogs.length < fullLogs.length && (
                    <p className="text-emerald-400 font-semibold flex items-center">
                      <span className="text-slate-500 mr-2">$</span>
                      <span className="w-2.5 h-4 bg-emerald-400 animate-pulse ml-0.5"></span>
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
