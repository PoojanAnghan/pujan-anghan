import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../utils/supabase';
import SEO from '../components/SEO';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    performUnsubscribe();
  }, []);

  const performUnsubscribe = async () => {
    const subscriberId = searchParams.get('id');

    if (!subscriberId) {
      setErrorMsg('No subscriber identifier found. Please check your unsubscribe link.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscribers')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
        })
        .eq('id', subscriberId);

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      console.error('Error unsubscribing:', err);
      setErrorMsg('Failed to process unsubscribe request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-slate-950 text-slate-200 flex flex-col justify-center items-center px-6">
      <SEO title="Unsubscribe | Blog Notifications" noindex={true} />

      <div className="max-w-md w-full bg-slate-900 border border-slate-850 p-8 rounded-2xl shadow-xl text-center space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Processing unsubscribe request...</p>
          </div>
        ) : success ? (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white">Unsubscribed successfully</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              You have been unsubscribed from our blog notifications mailing list. You will no longer receive updates when new articles are published.
            </p>
            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-350 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white">Unsubscribe Failed</h2>
            <p className="text-red-300 text-sm leading-relaxed">
              {errorMsg}
            </p>
            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={14} /> Back to Homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
