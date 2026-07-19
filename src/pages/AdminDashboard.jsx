import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../utils/supabase';
import SEO from '../components/SEO';
import { BarChart3, Users, Clock, Target, MapPin, Globe, Compass, ArrowRight, ShieldAlert, LogOut, Loader2, Calendar } from 'lucide-react';

// Coordinates mapping on a 200x100 SVG grid for simple dot map
const COUNTRY_COORDINATES = {
  'United States': { x: 45, y: 35 },
  'Canada': { x: 40, y: 25 },
  'United Kingdom': { x: 96, y: 28 },
  'India': { x: 138, y: 48 },
  'Germany': { x: 102, y: 30 },
  'France': { x: 98, y: 32 },
  'Australia': { x: 172, y: 78 },
  'Japan': { x: 165, y: 38 },
  'Brazil': { x: 68, y: 68 },
  'South Africa': { x: 110, y: 72 },
  'Netherlands': { x: 100, y: 29 },
  'Singapore': { x: 145, y: 58 },
  'United Arab Emirates': { x: 122, y: 45 },
  'Spain': { x: 95, y: 36 },
  'Italy': { x: 102, y: 35 }
};

// 40x20 Dot Matrix World Map grid
const MAP_GRID = [
  "........................................",
  "........................................",
  "........xx..............................",
  "...xxxx.xxx........xxxx.xxxxx.xxxx......",
  "..xxxxxxxxxx......xxxxxxxxxxxxxxxxx.....",
  ".xxxxxxxxxxxx.....xxxxxxxxxxxxxxxxxx.x..",
  "..xxxxxxxxxxx......xxxxxxxxxxxxxxxxx.xx.",
  "....xxxxxxx........xxxxxxxxxxxxxx.x.....",
  ".....xxxxxx.........xxxxxxxxxxx.........",
  ".....xxxxx..........xxxxxxxx.x..........",
  "......xxxx...........xxxxxx.............",
  "......xxx.............xxxx..............",
  "......xx..............xxx...............",
  "......x...............x.................",
  "..................................xxx...",
  ".................................xxxxx..",
  "..................................xxx...",
  "........................................",
  "........................................",
  "........................................"
];

// Fallback random coordinate generator based on country name seed
const getCountryCoords = (country) => {
  if (COUNTRY_COORDINATES[country]) return COUNTRY_COORDINATES[country];
  // Simple deterministic hash to distribute other countries reasonably on the map
  let hash = 0;
  for (let i = 0; i < country.length; i++) {
    hash = country.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = 50 + (Math.abs(hash) % 120); // Keep within safe boundaries
  const y = 20 + (Math.abs(hash >> 2) % 60);
  return { x, y };
};

const AdminDashboard = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Filter States
  const [dateRange, setDateRange] = useState('7d'); // 'today', '7d', '30d', 'custom'
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  // Raw Database Data
  const [sessions, setSessions] = useState([]);
  const [pageEvents, setPageEvents] = useState([]);
  const [conversionEvents, setConversionEvents] = useState([]);

  // Check auth session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data when session or date range filters update
  useEffect(() => {
    if (!session) return;
    fetchAnalyticsData();
  }, [session, dateRange, customStart, customEnd]);

  const fetchAnalyticsData = async () => {
    setDataLoading(true);
    try {
      let filterStart = new Date();
      let filterEnd = new Date();

      if (dateRange === 'today') {
        filterStart.setHours(0, 0, 0, 0);
      } else if (dateRange === '7d') {
        filterStart.setDate(filterStart.getDate() - 7);
      } else if (dateRange === '30d') {
        filterStart.setDate(filterStart.getDate() - 30);
      } else if (dateRange === 'custom') {
        if (customStart) filterStart = new Date(customStart);
        if (customEnd) {
          filterEnd = new Date(customEnd);
          filterEnd.setHours(23, 59, 59, 999);
        }
      }

      const isoStart = filterStart.toISOString();
      const isoEnd = filterEnd.toISOString();

      const [sessionsRes, pageEventsRes, conversionsRes] = await Promise.all([
        supabase.from('sessions').select('*').gte('first_seen', isoStart).lte('first_seen', isoEnd),
        supabase.from('page_events').select('*').gte('timestamp', isoStart).lte('timestamp', isoEnd),
        supabase.from('conversion_events').select('*').gte('timestamp', isoStart).lte('timestamp', isoEnd)
      ]);

      if (sessionsRes.error) throw sessionsRes.error;
      if (pageEventsRes.error) throw pageEventsRes.error;
      if (conversionsRes.error) throw conversionsRes.error;

      setSessions(sessionsRes.data || []);
      setPageEvents(pageEventsRes.data || []);
      setConversionEvents(conversionsRes.data || []);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      setLoginError(err.message || 'Authentication failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Aggregated Metrics Calculations
  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalViews = pageEvents.length;

    // Unique Visitors (unique session IDs)
    const uniqueVisitors = totalSessions;

    // Average Session Duration
    let totalDurationMs = 0;
    sessions.forEach(s => {
      const diff = new Date(s.last_seen) - new Date(s.first_seen);
      totalDurationMs += Math.max(0, diff);
    });
    const avgDurationSeconds = totalSessions > 0 ? Math.round((totalDurationMs / totalSessions) / 1000) : 0;
    const formattedDuration = avgDurationSeconds > 60 
      ? `${Math.floor(avgDurationSeconds / 60)}m ${avgDurationSeconds % 60}s`
      : `${avgDurationSeconds}s`;

    // Conversion Count
    const totalConversions = conversionEvents.length;

    // Group page views by path
    const pageViewsMap = {};
    pageEvents.forEach(e => {
      pageViewsMap[e.path] = (pageViewsMap[e.path] || 0) + 1;
    });
    const topPages = Object.entries(pageViewsMap)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Group referrers
    const referrersMap = {};
    sessions.forEach(s => {
      const ref = s.referrer || 'Direct';
      referrersMap[ref] = (referrersMap[ref] || 0) + 1;
    });
    const topReferrers = Object.entries(referrersMap)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Group countries and cities
    const locationsMap = {};
    sessions.forEach(s => {
      const key = s.country || 'Unknown';
      if (!locationsMap[key]) {
        locationsMap[key] = { country: key, count: 0, cities: {} };
      }
      locationsMap[key].count += 1;
      if (s.city) {
        locationsMap[key].cities[s.city] = (locationsMap[key].cities[s.city] || 0) + 1;
      }
    });
    const topLocations = Object.values(locationsMap)
      .sort((a, b) => b.count - a.count);

    // Group device types
    const devicesMap = { desktop: 0, mobile: 0, tablet: 0 };
    sessions.forEach(s => {
      const type = s.device_type || 'desktop';
      devicesMap[type] = (devicesMap[type] || 0) + 1;
    });

    // Group browsers
    const browsersMap = {};
    sessions.forEach(s => {
      const browser = s.browser || 'Other';
      browsersMap[browser] = (browsersMap[browser] || 0) + 1;
    });
    const browserStats = Object.entries(browsersMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Funnel events
    const funnel = {
      sessions: totalSessions,
      projectClicks: 0,
      quoteClicks: 0
    };

    // Track active conversion sessions
    const projectClickSessions = new Set();
    const quoteClickSessions = new Set();

    conversionEvents.forEach(e => {
      if (e.event_name === 'project_click') {
        projectClickSessions.add(e.session_id);
      }
      if (e.event_name === 'quote_click' || e.event_name === 'quote_submit') {
        quoteClickSessions.add(e.session_id);
      }
    });

    funnel.projectClicks = projectClickSessions.size;
    funnel.quoteClicks = quoteClickSessions.size;

    // Group by Day for Timeline Chart
    const dailyMap = {};
    sessions.forEach(s => {
      const dateStr = new Date(s.first_seen).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!dailyMap[dateStr]) dailyMap[dateStr] = { date: dateStr, visitors: 0, views: 0 };
      dailyMap[dateStr].visitors += 1;
    });

    pageEvents.forEach(e => {
      const dateStr = new Date(e.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!dailyMap[dateStr]) dailyMap[dateStr] = { date: dateStr, visitors: 0, views: 0 };
      dailyMap[dateStr].views += 1;
    });

    // Sort timeline chronological
    const timelineData = Object.values(dailyMap).reverse().slice(-14); // Last 14 days active

    return {
      totalSessions,
      totalViews,
      uniqueVisitors,
      avgDuration: formattedDuration,
      totalConversions,
      topPages,
      topReferrers,
      topLocations,
      devices: devicesMap,
      browsers: browserStats,
      funnel,
      timelineData
    };
  }, [sessions, pageEvents, conversionEvents]);

  if (!session) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950 px-6 py-20">
        <SEO title="Admin Login | Analytics Dashboard" noindex={true} />
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="text-center mb-8 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-emerald-900/20">
              PA
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Analytics Console</h1>
            <p className="text-slate-400 text-sm">Secure sign-in for system administrator</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-350 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@poojan.dev"
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2.5 text-sm border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-350 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2.5 text-sm border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-6 py-12">
      <SEO title="Analytics Dashboard | Admin" noindex={true} />

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Block */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-900">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Console Connected
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Visitor Analytics</h1>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Date Filters */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg text-sm w-full md:w-auto overflow-x-auto">
              {['today', '7d', '30d', 'custom'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDateRange(mode)}
                  className={`px-4 py-1.5 rounded-md font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
                    dateRange === mode
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode === '7d' ? '7 days' : mode === '30d' ? '30 days' : mode}
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Custom Range Picker */}
        {dateRange === 'custom' && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end max-w-3xl animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <button
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer h-10"
            >
              Apply Filter
            </button>
          </div>
        )}

        {dataLoading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Fetching dashboard metrics...</p>
          </div>
        ) : (
          <>
            {/* Overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between text-slate-500 mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold">Total Sessions</span>
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-white">{stats.totalSessions}</span>
                  <span className="block text-[10px] text-slate-500 mt-1">{stats.totalViews} Page Views</span>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between text-slate-500 mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold">Unique Visitors</span>
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-white">{stats.uniqueVisitors}</span>
                  <span className="block text-[10px] text-slate-500 mt-1">Identified by Session Storage</span>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between text-slate-500 mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold">Avg Session Duration</span>
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-white">{stats.avgDuration}</span>
                  <span className="block text-[10px] text-slate-500 mt-1">Telemetry seen delta</span>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between text-slate-500 mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold">Conversions</span>
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-white">{stats.totalConversions}</span>
                  <span className="block text-[10px] text-slate-500 mt-1">
                    {stats.totalSessions > 0 ? ((stats.totalConversions / stats.totalSessions) * 100).toFixed(1) : 0}% Conversion Rate
                  </span>
                </div>
              </div>
            </div>

            {/* Empty State check */}
            {sessions.length === 0 ? (
              <div className="p-16 border border-slate-850 bg-slate-900/40 rounded-2xl text-center">
                <ShieldAlert className="w-12 h-12 text-slate-650 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-1">No traffic logs found</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm">
                  There are no records in the selected date range. Test the integration by visiting your site.
                </p>
              </div>
            ) : (
              <>
                {/* Visual Section: Timeline + Map */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Timeline Bar Chart */}
                  <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-850 rounded-2xl shadow-lg">
                    <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-6">Traffic Trend</h3>
                    {stats.timelineData.length === 0 ? (
                      <div className="h-64 flex items-center justify-center text-slate-600 text-sm">No trend data available</div>
                    ) : (
                      <div className="relative h-64 w-full flex items-end justify-between pt-6 px-2">
                        {stats.timelineData.map((day, i) => {
                          const maxVal = Math.max(...stats.timelineData.map(d => d.visitors), 1);
                          const barHeight = `${Math.min(100, Math.max(10, (day.visitors / maxVal) * 100))}%`;
                          return (
                            <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end">
                              {/* Tooltip */}
                              <div className="absolute top-0 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 font-mono shadow-xl">
                                {day.visitors} unique visitors
                              </div>
                              {/* Bar */}
                              <div 
                                style={{ height: barHeight }} 
                                className="w-[40%] bg-emerald-500/20 group-hover:bg-emerald-400 border-t-2 border-emerald-500 rounded-t transition-all duration-300 shadow-inner"
                              ></div>
                              <span className="text-[10px] text-slate-500 mt-2 font-mono">{day.date}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Dot Map Location density */}
                  <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl shadow-lg flex flex-col">
                    <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-4">Global Reach</h3>
                    <div className="relative flex-grow flex items-center justify-center">
                      {/* World SVG Outline Placeholder grid background */}
                      <svg viewBox="0 0 200 100" className="w-full h-auto text-slate-800/40 select-none">
                        {/* High-tech grid line overlays */}
                        <line x1="0" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="0.15" strokeDasharray="1,2" />
                        <line x1="0" y1="40" x2="200" y2="40" stroke="currentColor" strokeWidth="0.15" strokeDasharray="1,2" />
                        <line x1="0" y1="60" x2="200" y2="60" stroke="currentColor" strokeWidth="0.15" strokeDasharray="1,2" />
                        <line x1="0" y1="80" x2="200" y2="80" stroke="currentColor" strokeWidth="0.15" strokeDasharray="1,2" />
                        <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.15" strokeDasharray="1,2" />
                        <line x1="100" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.15" strokeDasharray="1,2" />
                        <line x1="150" y1="0" x2="150" y2="100" stroke="currentColor" strokeWidth="0.15" strokeDasharray="1,2" />

                        {/* Dotted continental map */}
                        {MAP_GRID.map((row, rIdx) => 
                          row.split('').map((char, cIdx) => {
                            if (char !== 'x') return null;
                            const cx = cIdx * 5 + 2.5;
                            const cy = rIdx * 5 + 2.5;
                            return (
                              <circle
                                key={`${rIdx}-${cIdx}`}
                                cx={cx}
                                cy={cy}
                                r="0.75"
                                className="fill-slate-800"
                              />
                            );
                          })
                        )}
                      </svg>
                      {/* Plotting points */}
                      <div className="absolute inset-0">
                        <svg viewBox="0 0 200 100" className="w-full h-full">
                          {stats.topLocations.map((loc) => {
                            if (loc.country === 'Unknown') return null;
                            const coords = getCountryCoords(loc.country);
                            const maxCount = Math.max(...stats.topLocations.map(l => l.count), 1);
                            const dotSize = Math.max(2, Math.min(6, (loc.count / maxCount) * 6));
                            return (
                              <g key={loc.country} className="group cursor-pointer">
                                <circle
                                  cx={coords.x}
                                  cy={coords.y}
                                  r={dotSize + 3}
                                  className="fill-emerald-400/20 animate-ping"
                                />
                                <circle
                                  cx={coords.x}
                                  cy={coords.y}
                                  r={dotSize}
                                  className="fill-emerald-400 stroke-slate-950 stroke-[1.5]"
                                />
                                <title>{`${loc.country}: ${loc.count} sessions`}</title>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Locations Table & Funnel Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Locations Table */}
                  <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="text-emerald-400 w-4 h-4" />
                      <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400">Top Locations</h3>
                    </div>
                    <div className="overflow-y-auto max-h-72">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 text-xs">
                            <th className="pb-3 font-semibold">Location</th>
                            <th className="pb-3 text-right font-semibold">Visitors</th>
                            <th className="pb-3 text-right font-semibold">Breakdown</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                          {stats.topLocations.slice(0, 10).map((loc, i) => (
                            <tr key={i} className="hover:bg-slate-850/30 transition-colors">
                              <td className="py-3 font-medium text-white">{loc.country}</td>
                              <td className="py-3 text-right text-slate-350">{loc.count}</td>
                              <td className="py-3 text-right text-xs text-slate-500">
                                {Object.entries(loc.cities).slice(0, 2).map(([city, cnt]) => `${city} (${cnt})`).join(', ') || 'No cities'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Conversion Funnel */}
                  <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl shadow-lg flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                      <Target className="text-emerald-400 w-4 h-4" />
                      <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400">Conversion Funnel</h3>
                    </div>
                    <div className="flex-grow flex flex-col justify-between gap-4">
                      {/* Step 1: Visits */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-400">
                          <span>1. Total Sessions</span>
                          <span>{stats.funnel.sessions}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-lg h-8 overflow-hidden relative border border-slate-700/50">
                          <div className="bg-emerald-600/30 border-r-2 border-emerald-500 h-full w-full flex items-center px-3 font-mono text-xs font-bold text-white">100%</div>
                        </div>
                      </div>

                      {/* Step 2: Project clicks */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-400">
                          <span>2. Project Interactions</span>
                          <span>{stats.funnel.projectClicks}</span>
                        </div>
                        {stats.funnel.sessions > 0 ? (
                          <div className="w-full bg-slate-800 rounded-lg h-8 overflow-hidden relative border border-slate-700/50">
                            <div 
                              style={{ width: `${(stats.funnel.projectClicks / stats.funnel.sessions) * 100}%` }}
                              className="bg-emerald-600/50 border-r-2 border-emerald-450 h-full flex items-center px-3 font-mono text-xs font-bold text-white min-w-[30px]"
                            >
                              {((stats.funnel.projectClicks / stats.funnel.sessions) * 100).toFixed(0)}%
                            </div>
                          </div>
                        ) : (
                          <div className="w-full bg-slate-800 rounded-lg h-8 border border-slate-750 flex items-center px-3 text-slate-500 text-xs">0%</div>
                        )}
                      </div>

                      {/* Step 3: Quote clicks */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-400">
                          <span>3. Quote Request Clicks</span>
                          <span>{stats.funnel.quoteClicks}</span>
                        </div>
                        {stats.funnel.sessions > 0 ? (
                          <div className="w-full bg-slate-800 rounded-lg h-8 overflow-hidden relative border border-slate-700/50">
                            <div 
                              style={{ width: `${(stats.funnel.quoteClicks / stats.funnel.sessions) * 100}%` }}
                              className="bg-emerald-500 border-r-2 border-emerald-400 h-full flex items-center px-3 font-mono text-xs font-bold text-slate-950 min-w-[30px]"
                            >
                              {((stats.funnel.quoteClicks / stats.funnel.sessions) * 100).toFixed(0)}%
                            </div>
                          </div>
                        ) : (
                          <div className="w-full bg-slate-800 rounded-lg h-8 border border-slate-750 flex items-center px-3 text-slate-500 text-xs">0%</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Pages, Sources, Devices */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Top Pages */}
                  <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-2 mb-6">
                      <Globe className="text-emerald-400 w-4 h-4" />
                      <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400">Top Pages</h3>
                    </div>
                    <div className="space-y-3.5 max-h-64 overflow-y-auto">
                      {stats.topPages.map((page, i) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                          <span className="text-sm font-mono truncate text-slate-300" title={page.path}>{page.path}</span>
                          <span className="text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-750 text-slate-400 font-semibold">{page.count} views</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Traffic Sources */}
                  <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-2 mb-6">
                      <Compass className="text-emerald-400 w-4 h-4" />
                      <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400">Referrers & Sources</h3>
                    </div>
                    <div className="space-y-3.5 max-h-64 overflow-y-auto">
                      {stats.topReferrers.map((ref, i) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                          <span className="text-sm truncate text-slate-300" title={ref.source}>{ref.source}</span>
                          <span className="text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-750 text-slate-450 font-semibold">{ref.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Device / Browser split */}
                  <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Users className="text-emerald-400 w-4 h-4" />
                        <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400">Devices & Browsers</h3>
                      </div>
                      
                      {/* Devices Bar */}
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Device Breakdown</span>
                        </div>
                        <div className="h-6 w-full bg-slate-800 rounded-lg flex overflow-hidden border border-slate-750">
                          {Object.entries(stats.devices).map(([device, cnt]) => {
                            if (cnt === 0) return null;
                            const share = (cnt / stats.totalSessions) * 100;
                            const color = device === 'desktop' ? 'bg-emerald-600' : device === 'mobile' ? 'bg-teal-500' : 'bg-slate-600';
                            return (
                              <div 
                                key={device} 
                                style={{ width: `${share}%` }} 
                                className={`${color} h-full first:rounded-l last:rounded-r`}
                                title={`${device}: ${cnt} (${share.toFixed(0)}%)`}
                              />
                            );
                          })}
                        </div>
                        <div className="flex justify-start gap-4 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-600 block"></span>Desktop ({stats.devices.desktop})</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-teal-500 block"></span>Mobile ({stats.devices.mobile})</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-650 block"></span>Tablet ({stats.devices.tablet})</span>
                        </div>
                      </div>
                    </div>

                    {/* Browsers list */}
                    <div className="border-t border-slate-800/80 pt-4 flex-grow overflow-y-auto max-h-36">
                      <div className="space-y-2">
                        {stats.browsers.slice(0, 3).map((browser) => (
                          <div key={browser.name} className="flex justify-between text-xs text-slate-400">
                            <span>{browser.name}</span>
                            <span className="font-semibold text-slate-300">{((browser.count / stats.totalSessions) * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
