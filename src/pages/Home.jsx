import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

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
    <section id="home" className="relative min-h-[calc(100vh-80px)] flex items-center py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-emerald-400 text-sm font-medium backdrop-blur-sm animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Available for Remote Builds
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight animate-fade-in-up delay-100">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Poojan Anghan</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up delay-200">
              I help businesses ship scalable web applications remotely with strong engineering, clear communication, and reliable full-stack delivery.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up delay-300">
              <Link
                to="/experience"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                View Experience
                <ChevronRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Contact Me
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto lg:mx-0 animate-fade-in-up delay-500">
              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center backdrop-blur shadow-md hover:border-emerald-500/25 transition-all">
                <span className="block text-xl sm:text-2xl font-bold text-emerald-400 mb-1">3+ Years</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-450 font-medium">Production Coding</span>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center backdrop-blur shadow-md hover:border-emerald-500/25 transition-all">
                <span className="block text-xl sm:text-2xl font-bold text-emerald-400 mb-1">10+</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-450 font-medium">Delivered</span>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center backdrop-blur shadow-md hover:border-emerald-500/25 transition-all">
                <span className="block text-xl sm:text-2xl font-bold text-emerald-400 mb-1">Remote</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-450 font-medium">Global Work</span>
              </div>
            </div>
          </div>

          {/* Hero Terminal Console */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none animate-fade-in-up delay-200">
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
                    <span className="w-2 h-4 bg-emerald-400 animate-pulse ml-0.5"></span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
