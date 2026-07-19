import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Cpu, LayoutDashboard, Bug, ArrowRight, Check } from 'lucide-react';
import SEO from './SEO';

const servicesData = [
  {
    id: 1,
    title: "Custom Web App Development",
    description: "Full-stack web apps built from scratch — designed, developed, and deployed.",
    features: [
      "Responsive UI with React or Vanilla JS",
      "REST API or Django backend",
      "Deployed to Vercel, GitHub Pages, or your server"
    ],
    price: "₹15,000",
    isPopular: true
  },
  {
    id: 2,
    title: "API Development & Integration",
    description: "Connect your app to any third-party service or build your own backend API.",
    features: [
      "FastAPI or Django REST Framework",
      "Payment gateways (Razorpay, Stripe)",
      "Webhook handling and async tasks"
    ],
    price: "₹8,000",
    isPopular: false
  },
  {
    id: 3,
    title: "Admin Dashboard & Portals",
    description: "Internal tools your team can actually use — no dev required to operate.",
    features: [
      "Role-based access control",
      "Data tables, filters, and exports",
      "Azure AD / Auth integration"
    ],
    price: "₹12,000",
    isPopular: false
  },
  {
    id: 4,
    title: "Bug Fixes & Code Review",
    description: "One-time fixes, refactors, or a second pair of eyes on your codebase.",
    features: [
      "React, Django, FastAPI, TypeScript",
      "Performance and security review",
      "Delivered with clear documentation"
    ],
    price: "₹3,000",
    isPopular: false
  }
];

const ServicesSection = () => {
  const getServiceIcon = (id) => {
    switch (id) {
      case 1:
        return <Globe className="w-8 h-8 text-emerald-400" />;
      case 2:
        return <Cpu className="w-8 h-8 text-emerald-400" />;
      case 3:
        return <LayoutDashboard className="w-8 h-8 text-emerald-400" />;
      case 4:
        return <Bug className="w-8 h-8 text-emerald-400" />;
      default:
        return <Globe className="w-8 h-8 text-emerald-400" />;
    }
  };

  return (
    <section className="py-20 bg-slate-950 text-white border-t border-slate-900">
      <SEO
        title="Services & Pricing | Poojan Anghan - Software Engineer"
        description="View freelance services, contract engagement models, and transparent starting pricing for custom React, Django, and FastAPI projects."
        keywords="Freelance Services, React App Cost, API Development Price, Custom Dashboard Developer"
      />
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-emerald-400 font-bold text-xs tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-900/50">
            Services
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4">
            Freelance Services & Deliverables
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Professional development solutions focused on business outcomes, remote delivery, and reliable execution.
          </p>
        </div>

        {/* 2-column responsive grid on desktop, 1-column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className={`bg-slate-900 rounded-2xl p-8 flex flex-col justify-between relative transition-all duration-355 hover:-translate-y-1 ${
                service.isPopular
                  ? "border-2 border-emerald-500 shadow-[0_8px_32px_rgba(16,185,129,0.08)]"
                  : "border border-slate-800/80 hover:border-emerald-500/25"
              }`}
            >
              {service.isPopular && (
                <span className="absolute -top-3.5 right-6 bg-emerald-500 text-slate-950 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
                  Most popular
                </span>
              )}

              <div>
                {/* 1. Icon (top) */}
                <div className="mb-6 w-14 h-14 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                  {getServiceIcon(service.id)}
                </div>

                {/* 2. Service title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>

                {/* 3. One-line description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* 4. Feature list */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-300 leading-normal">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & CTA Button */}
              <div className="border-t border-slate-800/60 pt-6 mt-2">
                {/* 5. "Starting from ₹X" pricing line */}
                <div className="mb-4">
                  <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">
                    Investment
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-extrabold text-white">Starting from</span>
                    <span className="text-2xl font-extrabold text-emerald-400">{service.price}</span>
                  </div>
                </div>

                {/* 6. CTA button */}
                <Link
                  to="/quote"
                  className={`w-full py-3.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    service.isPopular
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  }`}
                >
                  Get a quote
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
