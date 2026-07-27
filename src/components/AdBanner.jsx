import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Sparkles, Code, Server, ArrowRight } from 'lucide-react';

const AdBanner = ({ 
  layout = 'horizontal', // 'horizontal' or 'card'
  slot = '', 
  format = 'auto', 
  fullWidthResponsive = 'true',
  style = {},
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const adRef = useRef(null);
  const pushAttempted = useRef(false);

  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || '';
  const defaultSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID || '';
  const currentSlot = slot || defaultSlotId;

  // Live ad units require both a Client ID and a Slot ID
  const isAdSenseEnabled = !!clientId && !!currentSlot;

  useEffect(() => {
    if (!isAdSenseEnabled) return;

    // Call AdSense push logic once the component mounts
    const initAd = () => {
      if (pushAttempted.current) return;
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushAttempted.current = true;
          setIsLoaded(true);
        } else {
          // If script hasn't loaded yet, check back shortly
          setTimeout(initAd, 300);
        }
      } catch (err) {
        console.warn('AdSense push failed:', err);
      }
    };

    initAd();
  }, [isAdSenseEnabled]);

  // If AdSense is configured, render the standard Google Ads container
  if (isAdSenseEnabled) {
    return (
      <div 
        ref={adRef} 
        className={`w-full overflow-hidden my-6 mx-auto ${
          layout === 'horizontal' ? 'max-w-4xl py-2' : 'max-w-md h-full'
        } ${className}`}
        style={style}
      >
        <div className="text-[10px] text-slate-600 uppercase tracking-wider text-center mb-1">
          Advertisement
        </div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '250px', ...style }}
          data-ad-client={clientId}
          data-ad-slot={currentSlot}
          data-ad-format={format}
          data-full-width-responsive={fullWidthResponsive}
        />
      </div>
    );
  }

  // Beautiful Sponsored Mock Ads Fallback (when no credentials loaded or in development)
  if (layout === 'horizontal') {
    return (
      <div className={`w-full max-w-4xl my-10 relative group rounded-2xl overflow-hidden border border-emerald-500/10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/20 p-6 md:p-8 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-950/10 ${className}`}>
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
              <Sparkles size={10} />
              Sponsored Partner
            </div>
            <h4 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Looking for a Production-Grade Web App or API?
            </h4>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Hire <span className="text-emerald-400 font-medium">Poojan Anghan</span> for scalable React interfaces, fast Python (Django/FastAPI) backend microservices, and reliable custom integrations. Shipped 10+ projects globally.
            </p>
          </div>
          
          <Link
            to="/quote"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all hover:scale-[1.02] shadow-md shadow-emerald-900/15"
          >
            Get a Free Quote
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // Card Layout (for grid list)
  return (
    <div className={`group relative bg-slate-900/60 border border-emerald-500/10 rounded-2xl overflow-hidden p-6 hover:border-emerald-500/30 transition-all duration-500 shadow-lg hover:shadow-emerald-900/10 flex flex-col justify-between min-h-[400px] ${className}`}>
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2"></div>

      <div className="space-y-4">
        {/* Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
            <Sparkles size={10} />
            Sponsored
          </div>
          <span className="text-[10px] text-slate-500">Ad</span>
        </div>

        {/* Dynamic Graphic Container */}
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 border border-slate-800 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.08),rgba(255,255,255,0))]"></div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Code size={20} />
            </div>
            <span className="text-slate-600 font-bold text-lg">+</span>
            <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Server size={20} />
            </div>
          </div>
        </div>

        {/* Title & Copy */}
        <div>
          <h4 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors leading-snug">
            Enterprise React & Python Backend Solutions
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Need a reliable software contractor? I specialize in building secure database systems, robust REST APIs, and responsive frontends tailored for businesses.
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="pt-4 mt-auto">
        <Link
          to="/contact"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/25 hover:border-emerald-500/40 text-xs font-semibold transition-all"
        >
          Consult Now
          <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
};

export default AdBanner;
