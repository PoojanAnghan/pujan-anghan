import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import SEO from '../components/SEO';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import CoverImageCarousel from '../components/CoverImageCarousel';
import { getCoverImages } from '../utils/blogImages';
import { Calendar, Tag, ArrowLeft, Loader2, BookOpen } from 'lucide-react';

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        setNotFound(true);
        return;
      }
      setPost(data);
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderContent = (content) => {
    const rawHtml = marked.parse(content || '');
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['img'],
      ADD_ATTR: ['src', 'alt', 'title', 'loading'],
    });
    return cleanHtml;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950 px-6">
        <SEO title="Post Not Found — Poojan Anghan" noindex={true} />
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <SEO
        title={`${post.title} — Poojan Anghan Blog`}
        description={post.excerpt || post.title}
        keywords={post.tags ? post.tags.join(', ') : 'Poojan Anghan Blog'}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Cover Image Carousel */}
        {getCoverImages(post).length > 0 && (
          <CoverImageCarousel
            images={getCoverImages(post)}
            alt={post.title}
            className="h-64 sm:h-80 md:h-96"
          />
        )}

        {/* Post Header */}
        <div className={`relative z-10 ${getCoverImages(post).length > 0 ? '-mt-32 sm:-mt-40' : 'pt-16'}`}>
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Back Link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 pb-8 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-400" />
                {formatDate(post.published_at)}
              </span>
              <span className="text-slate-700">•</span>
              <span>By Poojan Anghan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Excerpt callout */}
          {post.excerpt && (
            <div className="mb-10 p-6 bg-slate-900/60 border border-slate-800 rounded-xl">
              <p className="text-lg text-slate-300 leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Rendered Markdown Content */}
          <article
            className="prose prose-invert prose-emerald max-w-none
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-12
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-3
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-8
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-emerald-400 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-emerald-300
              prose-strong:text-white prose-strong:font-semibold
              prose-em:text-slate-300
              prose-code:text-emerald-400 prose-code:bg-slate-800/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl prose-pre:shadow-lg
              prose-blockquote:border-emerald-500 prose-blockquote:bg-slate-900/40 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
              prose-ul:text-slate-300 prose-ol:text-slate-300
              prose-li:marker:text-emerald-500
              prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-slate-800
              prose-hr:border-slate-800
              prose-table:border prose-table:border-slate-800
              prose-th:bg-slate-900 prose-th:text-white prose-th:border-slate-800
              prose-td:border-slate-800"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
