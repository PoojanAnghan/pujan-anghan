import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Loader2 } from 'lucide-react';

import Home from './pages/Home';
import About from './pages/About';
import Services from './components/ServicesSection';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import ProjectsSection from './components/ProjectsSection';
import TestimonialsSection from './components/TestimonialsSection';
import GetAQuote from './pages/GetAQuote';
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
import { trackPageView } from './utils/analytics';

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavigationLink = ({ to, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm font-medium transition-colors duration-300 hover:text-emerald-400 cursor-pointer ${
          isActive ? 'text-emerald-400 font-semibold' : 'text-slate-300'
        }`
      }
    >
      {label}
    </NavLink>
  );

  const MobileNavigationLink = ({ to, label, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block w-full text-left py-3 px-4 text-base font-medium border-l-2 transition-all cursor-pointer ${
          isActive
            ? 'border-emerald-400 text-emerald-400 bg-slate-800/50'
            : 'border-transparent text-slate-300 hover:bg-slate-800/30'
        }`
      }
    >
      {label}
    </NavLink>
  );

  const AnalyticsTracker = () => {
    const location = useLocation();
    useEffect(() => {
      trackPageView(location.pathname);
    }, [location]);
    return null;
  };

  return (
    <HashRouter>
      <ScrollToTop />
      <AnalyticsTracker />
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col">
        {/* Navigation */}
        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
            scrolled || isMenuOpen
              ? 'bg-slate-950/90 backdrop-blur-md border-slate-800 shadow-lg'
              : 'bg-transparent border-transparent'
          }`}
        >
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-900/20">
                PA
              </div>
              <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
                Poojan<span className="text-emerald-400">.Dev</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <NavigationLink to="/" label="Home" />
              <NavigationLink to="/about" label="About" />
              <NavigationLink to="/projects" label="Projects" />
              <NavigationLink to="/services" label="Services" />
              <NavigationLink to="/experience" label="Experience" />
              <NavigationLink to="/blog" label="Blog" />
              <NavigationLink to="/testimonials" label="Testimonials" />
              <Link
                to="/contact"
                className="px-5 py-2.5 rounded-lg bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/60 transition-all duration-300 font-medium text-sm cursor-pointer"
              >
                Contact Me
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
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
              <MobileNavigationLink to="/" label="Home" onClick={() => setIsMenuOpen(false)} />
              <MobileNavigationLink to="/about" label="About" onClick={() => setIsMenuOpen(false)} />
              <MobileNavigationLink to="/projects" label="Projects" onClick={() => setIsMenuOpen(false)} />
              <MobileNavigationLink to="/services" label="Services" onClick={() => setIsMenuOpen(false)} />
              <MobileNavigationLink to="/experience" label="Experience" onClick={() => setIsMenuOpen(false)} />
              <MobileNavigationLink to="/blog" label="Blog" onClick={() => setIsMenuOpen(false)} />
              <MobileNavigationLink to="/testimonials" label="Testimonials" onClick={() => setIsMenuOpen(false)} />
              <MobileNavigationLink to="/contact" label="Contact" onClick={() => setIsMenuOpen(false)} />
            </div>
          </div>
        </nav>

        {/* Main Page Container */}
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<ProjectsSection />} />
            <Route path="/services" element={<Services />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/testimonials" element={<TestimonialsSection />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<GetAQuote />} />
            <Route
              path="/blog"
              element={
                <Suspense fallback={
                  <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  </div>
                }>
                  <BlogList />
                </Suspense>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <Suspense fallback={
                  <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  </div>
                }>
                  <BlogPost />
                </Suspense>
              }
            />
            <Route 
              path="/admin" 
              element={
                <Suspense fallback={
                  <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  </div>
                }>
                  <AdminDashboard />
                </Suspense>
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-slate-600 text-sm">
          <div className="container mx-auto px-6">
            <p>&copy; 2026 Poojan Anghan. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default Portfolio;