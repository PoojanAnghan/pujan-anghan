import React from 'react';
import SEO from './SEO';

const testimonialsData = [
  {
    id: 1,
    quote: "Poojan delivered the project ahead of schedule and the code quality was excellent. He understood our requirements quickly and needed minimal back-and-forth. Would hire again without hesitation.",
    name: "Aarav Kumar",
    role: "Founder",
    company: "LogiTrack Solutions",
    initials: "AK"
  },
  {
    id: 2,
    quote: "The admin portal Poojan built replaced our entire manual workflow. Our team picked it up in a day with no training. Clean, fast, and exactly what we asked for.",
    name: "Rohit Sharma",
    role: "Product Manager",
    company: "MedSync Health",
    initials: "RS"
  },
  {
    id: 3,
    quote: "Poojan integrated our payment gateway and automated our subscription flow in under a week. Zero issues since launch. Highly recommend for any backend work.",
    name: "Meera Vyas",
    role: "Operations Lead",
    company: "TexFlow Garments",
    initials: "MV"
  }
];

const socialProofData = [
  "3+ years experience",
  "10+ projects delivered",
  "100% client satisfaction",
  "Available for remote work"
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-slate-950 text-white border-t border-slate-900">
      <SEO
        title="Testimonials & Client Feedback | Poojan Anghan"
        description="Read client testimonials and recommendations about Poojan Anghan's software engineering services, delivery speed, and clean code quality."
        keywords="Client Reviews, Testimonials, Software Engineer Reviews, Freelance Client Feedback"
      />
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-emerald-400 font-bold text-xs tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-900/50">
            Testimonials
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4">
            What Clients Say
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Feedback from remote engineering contracts, full-stack deliveries, and custom software builds.
          </p>
        </div>

        {/* 3-column responsive grid (desktop), 1-column (mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonialsData.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900 border border-slate-800/85 rounded-2xl p-6 hover:border-emerald-500/25 transition-all duration-300 shadow-xl flex flex-col justify-between h-full group"
            >
              <div>
                {/* 1. Star rating (5 stars, emerald colored) */}
                <div className="text-emerald-400 text-lg mb-4 select-none">
                  ★★★★★
                </div>

                {/* 2. Quote text — 2-3 sentences max */}
                <p className="text-sm text-slate-350 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div>
                {/* 3. Divider */}
                <hr className="border-slate-800/60 my-4" />

                {/* 4. Avatar initials circle + Name + Role + Company (bottom row) */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-white truncate">
                      {t.name}
                    </span>
                    <span className="block text-xs text-slate-500 truncate">
                      {t.role} • <span className="text-slate-400">{t.company}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Bar */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {socialProofData.map((proof, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-2 group"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 mb-3 group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                  {proof.split(" ").slice(0, 1).join(" ")}
                </span>
                <span className="text-xs text-slate-500 mt-1 font-medium">
                  {proof.split(" ").slice(1).join(" ")}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
