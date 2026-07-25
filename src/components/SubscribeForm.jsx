import React, { useState } from 'react';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { text, type: 'success' | 'error' }

  const triggerWelcomeEmail = async (subEmail, subId) => {
    try {
      const { error: invokeError } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'welcome',
          email: subEmail,
          subscriberId: subId,
          siteUrl: window.location.origin,
        },
      });
      if (invokeError) throw invokeError;
    } catch (err) {
      console.error('Failed to trigger welcome email Edge Function:', err);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      // 1. Insert to supabase subscribers table
      const { data: insertData, error } = await supabase
        .from('subscribers')
        .insert([{ email: email.trim().toLowerCase(), status: 'active' }])
        .select()
        .single();

      if (error) {
        // Handle duplicate key error code 23505 (unique_violation)
        if (error.code === '23505') {
          // Check if they were previously unsubscribed, we can optionally re-subscribe them
          const { data: existing } = await supabase
            .from('subscribers')
            .select('id, status')
            .eq('email', email.trim().toLowerCase())
            .single();

          if (existing && existing.status === 'unsubscribed') {
            const { error: reSubError } = await supabase
              .from('subscribers')
              .update({ status: 'active', unsubscribed_at: null })
              .eq('id', existing.id)
              .select()
              .single();
            
            if (reSubError) throw reSubError;

            // Trigger email confirmation asynchronously for re-subscribed visitor
            triggerWelcomeEmail(email.trim().toLowerCase(), existing.id);

            setMessage({
              text: "Welcome back! You're subscribed! We'll notify you whenever a new blog is published.",
              type: 'success'
            });
            setEmail('');
            return;
          }

          setMessage({
            text: "You are already subscribed to our newsletter!",
            type: 'error'
          });
          return;
        }
        throw error;
      }

      // Trigger welcome email confirmation asynchronously for new subscriber
      if (insertData) {
        triggerWelcomeEmail(insertData.email, insertData.id);
      }

      setMessage({
        text: "You're subscribed! We'll notify you whenever a new blog is published.",
        type: 'success'
      });
      setEmail('');
    } catch (err) {
      console.error('Error subscribing:', err);
      setMessage({
        text: "Something went wrong. Please try again later.",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-850 p-8 rounded-2xl shadow-xl max-w-xl mx-auto text-left space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Subscribe to receive email notifications whenever I publish deep dives, guides, and engineering logs. No spam, unsubscribe anytime.
        </p>
      </div>

      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="email"
            required
            placeholder="enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-650 focus:ring-1 focus:ring-emerald-500 focus:border-transparent outline-none transition-all disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-start gap-3 animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400'
              : 'bg-red-950/30 border-red-900/50 text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}
