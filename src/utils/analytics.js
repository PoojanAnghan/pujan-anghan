// UUID Generator for sessionStorage session identity
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Simple User Agent Parsing (browser & device detection)
const getBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Chromium") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("MSIE") || ua.includes("Trident/")) return "IE";
  return "Other";
};

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua)) return "mobile";
  return "desktop";
};

// Session State Initialization
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('pa_analytics_session_id');
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem('pa_analytics_session_id', sessionId);
  }
  return sessionId;
};

const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  // Also check hash query params since this is a HashRouter website (e.g. #/about?utm_source=...)
  const hashSearch = window.location.hash.split('?')[1];
  const hashParams = new URLSearchParams(hashSearch || '');

  return {
    utm_source: params.get('utm_source') || hashParams.get('utm_source') || null,
    utm_medium: params.get('utm_medium') || hashParams.get('utm_medium') || null,
    utm_campaign: params.get('utm_campaign') || hashParams.get('utm_campaign') || null
  };
};

const getTrackingEndpoint = () => {
  return import.meta.env.VITE_ANALYTICS_ENDPOINT || 
    (import.meta.env.VITE_SUPABASE_URL ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track` : '');
};

// Safe POST wrapper that fails silently
const postEvent = async (payload) => {
  const endpoint = getTrackingEndpoint();
  if (!endpoint) return;

  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Include anon key if calling Supabase Edge Functions directly
    if (import.meta.env.VITE_SUPABASE_ANON_KEY && endpoint.includes('supabase.co')) {
      headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY;
      headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
    }

    await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      mode: 'cors'
    });
  } catch (error) {
    // Fail silently in production, log details in warning console
    console.warn('Analytics tracking failed silently:', error);
  }
};

export const trackPageView = (path) => {
  // Never track the admin page views to avoid skewing metrics
  if (path === '/admin') return;

  const utms = getUTMParams();
  postEvent({
    session_id: getSessionId(),
    type: 'pageview',
    path,
    referrer: document.referrer || 'Direct',
    device_type: getDeviceType(),
    browser: getBrowser(),
    ...utms
  });
};

export const trackEvent = (eventName, metadata = {}) => {
  postEvent({
    session_id: getSessionId(),
    type: 'conversion',
    event_name: eventName,
    metadata
  });
};
