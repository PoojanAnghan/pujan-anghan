import { supabase } from './supabase';

/**
 * Notifies all active subscribers about a newly published blog post.
 * Invokes the 'send-email' Supabase Edge Function to deliver emails via Gmail SMTP.
 * 
 * @param {Object} post The published blog post details
 * @returns {Promise<Object>} An execution report containing counts of sent/failed messages
 */
export async function notifySubscribersOfNewPost(post) {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: {
      type: 'new-post',
      post: post,
      siteUrl: window.location.origin
    }
  });

  if (error) {
    throw new Error(`Failed to dispatch subscriber notifications: ${error.message}`);
  }

  return data || { total: 0, sent: 0, failed: 0, errors: [] };
}
