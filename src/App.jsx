import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Code2, 
  Database, 
  Terminal, 
  Cpu, 
  GraduationCap, 
  Briefcase,
  User,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      setActiveSection(id);
    }
  };

  const NavLink = ({ id, label }) => (
    <button
      onClick={() => scrollToSection(id)}
      className={`text-sm font-medium transition-colors duration-300 hover:text-emerald-400 ${
        activeSection === id ? 'text-emerald-400' : 'text-slate-300'
      }`}
    >
      {label}
    </button>
  );

  const MobileNavLink = ({ id, label }) => (
    <button
      onClick={() => scrollToSection(id)}
      className={`block w-full text-left py-3 px-4 text-base font-medium border-l-2 transition-all ${
        activeSection === id 
          ? 'border-emerald-400 text-emerald-400 bg-slate-800/50' 
          : 'border-transparent text-slate-300 hover:bg-slate-800/30'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled || isMenuOpen 
            ? 'bg-slate-950/90 backdrop-blur-md border-slate-800 shadow-lg' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-900/20">
              P
            </div>
            <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
              Pujan<span className="text-emerald-400">.Dev</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink id="home" label="Home" />
            <NavLink id="about" label="About" />
            <NavLink id="skills" label="Skills" />
            <NavLink id="projects" label="Projects" />
            <NavLink id="experience" label="Experience" />
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-5 py-2.5 rounded-lg bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/60 transition-all duration-300 font-medium text-sm"
            >
              Contact Me
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <div 
          className={`md:hidden absolute w-full bg-slate-900 border-b border-slate-800 shadow-xl transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-2">
            <MobileNavLink id="home" label="Home" />
            <MobileNavLink id="about" label="About" />
            <MobileNavLink id="skills" label="Skills" />
            <MobileNavLink id="projects" label="Projects" />
            <MobileNavLink id="experience" label="Experience" />
            <MobileNavLink id="contact" label="Contact" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-emerald-400 text-sm font-medium backdrop-blur-sm animate-fade-in-up">
              Backend Developer & AI Enthusiast
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight animate-fade-in-up delay-100">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Pujan Anghan</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Building scalable server-side applications and intelligent solutions with Python. 
              Specializing in Django, Flask, and Computer Vision technologies.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <button 
                onClick={() => scrollToSection('projects')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 flex items-center justify-center gap-2"
              >
                View My Work
                <ChevronRight size={18} />
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold transition-all flex items-center justify-center gap-2"
              >
                Contact Me
              </button>
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-6 text-slate-400 animate-fade-in-up delay-500">
              <a href="#" className="hover:text-emerald-400 transition-colors p-2 hover:bg-slate-800 rounded-full">
                <Github size={24} />
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors p-2 hover:bg-slate-800 rounded-full">
                <Linkedin size={24} />
              </a>
              <a href="mailto:anghanpoojan66@gmail.com" className="hover:text-emerald-400 transition-colors p-2 hover:bg-slate-800 rounded-full">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-square rounded-2xl overflow-hidden relative z-10 bg-slate-800 border border-slate-700 shadow-2xl group">
                {/* Abstract visual since no photo was provided, replacing with code-themed graphic */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-700">
                    <Terminal size={120} strokeWidth={1} />
                </div>
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                
                {/* Floating cards */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Experience</span>
                    <span className="text-slate-500 text-xs">Since 2023</span>
                  </div>
                  <div className="text-sm text-slate-300">
                    Intern Backend Developer at <span className="text-white font-medium">ExhiByte Solutions</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-emerald-500/20 rounded-2xl -z-0"></div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
                <User size={20} />
                <span>ABOUT ME</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Driven IT Undergraduate & <br/>Backend Specialist
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed text-lg">
                <p>
                  I am a driven and detail-oriented IT undergraduate at Veer Narmad South Gujarat University with a solid foundation in Python programming and backend development.
                </p>
                <p>
                  Skilled in building and optimizing server-side applications, database management, and API integration. I have experience using robust frameworks like Flask and Django, coupled with strong analytical and problem-solving abilities.
                </p>
                <p>
                  My goal is to contribute to scalable, high-performance solutions in a dynamic, forward-thinking environment while continuously enhancing my backend engineering skills.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="block text-2xl font-bold text-white mb-1">3+</span>
                  <span className="text-sm text-slate-400">Languages (Eng/Hin/Guj)</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="block text-2xl font-bold text-white mb-1">85%</span>
                  <span className="text-sm text-slate-400">H.S.C Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technical Expertise</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              My technical toolbelt for building robust backend systems and intelligent applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Backend */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all hover:bg-slate-800/50 group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Terminal size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Backend</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Python
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Django [DRF]
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Flask
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> FastAPI
                </li>
              </ul>
            </div>

            {/* AI / ML */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all hover:bg-slate-800/50 group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI & ML</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> OpenCV
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> TensorFlow
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> YOLOv8
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> CNN
                </li>
              </ul>
            </div>

            {/* Database */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:bg-slate-800/50 group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Database</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> MySQL
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> PostgreSQL
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> Database Mgmt
                </li>
              </ul>
            </div>

            {/* Frontend & Core */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-orange-500/30 transition-all hover:bg-slate-800/50 group">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                <Code2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Core & Web</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> OOPS Concepts
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> HTML5
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> CSS3
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> JavaScript
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Projects</h2>
              <p className="text-slate-400 max-w-xl">
                Showcasing my ability to integrate complex ML models with web technologies.
              </p>
            </div>
            <a href="#" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              View Github Profile <ExternalLink size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project 1 */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group">
              <div className="h-48 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
                 {/* Decorative background for project */}
                 <div className="absolute inset-0 flex items-center justify-center text-slate-800">
                    <div className="grid grid-cols-4 gap-2 opacity-20">
                        {[...Array(16)].map((_, i) => <div key={i} className="w-8 h-4 border border-emerald-500 rounded-sm"></div>)}
                    </div>
                 </div>
                 <div className="absolute bottom-4 left-6 z-20">
                    <h3 className="text-xl font-bold text-white">Number Plate Detection</h3>
                 </div>
              </div>
              <div className="p-6">
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                  Developed a web application for detecting vehicle number plates from uploaded images using a custom-trained YOLOv8 model. Integrated with Flask backend and OpenCV to perform detection and display bounding boxes on the result image.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 text-xs font-medium border border-emerald-800/50">Python</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 text-xs font-medium border border-emerald-800/50">YOLOv8</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 text-xs font-medium border border-emerald-800/50">Flask</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 text-xs font-medium border border-emerald-800/50">OpenCV</span>
                </div>
                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-emerald-400 transition-colors">
                  View Project <ChevronRight size={16} />
                </a>
              </div>
            </div>

            {/* Project 2 */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group">
              <div className="h-48 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
                 {/* Decorative background for project */}
                 <div className="absolute inset-0 flex items-center justify-center text-slate-800">
                    <div className="grid grid-cols-3 gap-2 opacity-20">
                        {[...Array(9)].map((_, i) => <div key={i} className="w-12 h-12 border border-blue-500 rounded-lg"></div>)}
                    </div>
                 </div>
                 <div className="absolute bottom-4 left-6 z-20">
                    <h3 className="text-xl font-bold text-white">CIFAR-10 Image Classification</h3>
                 </div>
              </div>
              <div className="p-6">
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                  Designed and trained a Convolutional Neural Network (CNN) to classify images from the CIFAR-10 dataset. Deployed the model on a web interface allowing users to upload images and receive real-time class predictions.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs font-medium border border-blue-800/50">TensorFlow</span>
                  <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs font-medium border border-blue-800/50">CNN</span>
                  <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs font-medium border border-blue-800/50">Flask</span>
                </div>
                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors">
                  View Project <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience & Education */}
      <section id="experience" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Experience Column */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="text-emerald-400" size={28} />
                <h2 className="text-3xl font-bold text-white">Experience</h2>
              </div>
              
              <div className="relative pl-8 border-l border-slate-800 space-y-12">
                <div className="relative">
                  <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-lg shadow-emerald-500/50"></div>
                  <div className="mb-2">
                    <span className="text-emerald-400 font-bold text-sm tracking-wide">AUG 2025 - PRESENT</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Intern Backend Developer</h3>
                  <div className="text-slate-400 font-medium mb-4">ExhiByte Solutions • Surat, Gujarat</div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Working on backend optimization, database management, and API integration. Gaining hands-on industry experience contributing to scalable, high-performance solutions.
                  </p>
                </div>
              </div>
            </div>

            {/* Education Column */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="text-blue-400" size={28} />
                <h2 className="text-3xl font-bold text-white">Education</h2>
              </div>
              
              <div className="relative pl-8 border-l border-slate-800 space-y-12">
                <div className="relative">
                  <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-blue-500 border-4 border-slate-950 shadow-lg shadow-blue-500/50"></div>
                  <div className="mb-2">
                    <span className="text-blue-400 font-bold text-sm tracking-wide">2023 - PRESENT</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Bachelor's of Computer Applications</h3>
                  <div className="text-slate-400 font-medium mb-2">Veer Narmad South Gujarat University</div>
                  <div className="inline-block px-3 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">
                    CGPA: 7.91 (5th Sem)
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-slate-700 border-4 border-slate-950"></div>
                  <div className="mb-2">
                    <span className="text-slate-500 font-bold text-sm tracking-wide">MARCH 2023</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Higher Secondary (H.S.C)</h3>
                  <div className="text-slate-400 font-medium mb-2">G.S.H.S.E.B</div>
                  <div className="inline-block px-3 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">
                    Percentage: 85.33%
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="text-center mb-12 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Let's Work Together</h2>
              <p className="text-slate-400">
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

            <div className="mt-12 flex justify-center gap-6 relative z-10">
              <a href="#" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <Github size={20} /> <span className="hidden sm:inline">@PoojanAnghan</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <Linkedin size={20} /> <span className="hidden sm:inline">Pujan Anghan</span>
              </a>
            </div>
          </div>
          
          <div className="text-center mt-12 text-slate-600 text-sm">
            <p>&copy; 2026 Pujan Anghan. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;