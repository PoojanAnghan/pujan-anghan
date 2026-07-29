import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import {
  Users, UserX, Trash2, Search, Filter, Loader2, AlertCircle, Check, Mail
} from 'lucide-react';

export default function SubscribersManager() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'unsubscribed'
  const [notification, setNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      showNotification('Failed to load subscribers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (sub) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('subscribers')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
        })
        .eq('id', sub.id);

      if (error) throw error;
      showNotification(`Unsubscribed ${sub.email}`);
      fetchSubscribers();
    } catch (err) {
      console.error('Error unsubscribing:', err);
      showNotification('Failed to unsubscribe user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (sub) => {
    if (!window.confirm(`Are you sure you want to permanently delete subscriber "${sub.email}"?`)) {
      return;
    }
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', sub.id);

      if (error) throw error;
      showNotification(`Deleted subscriber ${sub.email}`);
      fetchSubscribers();
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      showNotification('Failed to delete subscriber', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const stats = React.useMemo(() => {
    const total = subscribers.length;
    const active = subscribers.filter(s => s.status === 'active').length;
    const unsubscribed = total - active;
    return { total, active, unsubscribed };
  }, [subscribers]);

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = !searchFilter || sub.email.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium flex items-center gap-2.5 animate-slide-in-right ${notification.type === 'error'
            ? 'bg-red-950/90 border-red-800 text-red-300'
            : 'bg-emerald-950/90 border-emerald-800 text-emerald-300'
            }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Check className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold">Total Subscribers</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.total}</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold">Active Subscribers</span>
            <Mail className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white">{stats.active}</span>
            <span className="block text-[10px] text-slate-500 mt-1">Receiving blog updates</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold">Unsubscribed</span>
            <UserX className="w-4 h-4 text-slate-450" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-400">{stats.unsubscribed}</span>
            <span className="block text-[10px] text-slate-500 mt-1">Opted out of emails</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-900 border border-slate-850 p-4 rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search email..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-550 focus:ring-1 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-lg text-sm w-full md:w-auto overflow-x-auto">
          {['all', 'active', 'unsubscribed'].map((mode) => (
            <button
              key={mode}
              onClick={() => setStatusFilter(mode)}
              className={`px-4 py-1.5 rounded-md font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${statusFilter === mode
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* List / Table */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          <p className="text-slate-500 text-xs font-medium">Loading subscribers...</p>
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="p-16 border border-slate-850 bg-slate-900/40 rounded-2xl text-center">
          <Users className="w-10 h-10 text-slate-700 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-white mb-1">No subscribers found</h3>
          <p className="text-slate-500 text-xs">There are no subscribers matching the active criteria.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-semibold bg-slate-900/60">
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-850/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{sub.email}</td>
                    <td className="px-6 py-4 text-slate-400">{formatDate(sub.created_at)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sub.status === 'active'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-slate-450 bg-slate-800 border-slate-700'
                          }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {sub.status === 'active' && (
                          <button
                            onClick={() => handleUnsubscribe(sub)}
                            disabled={actionLoading}
                            className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Manually Unsubscribe"
                          >
                            <UserX size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(sub)}
                          disabled={actionLoading}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Permanently Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
