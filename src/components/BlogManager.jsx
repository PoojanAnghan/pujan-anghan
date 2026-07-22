import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import CoverImagesManager from './CoverImagesManager';
import CoverImageCarousel from './CoverImageCarousel';
import { getCoverImages } from '../utils/blogImages';
import {
  Plus, Edit3, Trash2, Eye, EyeOff, Save, X, Upload, Image as ImageIcon,
  Loader2, AlertTriangle, Check, FileText, Search
} from 'lucide-react';

marked.setOptions({ breaks: true, gfm: true });

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
};

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formStatus, setFormStatus] = useState('draft');
  const [formCoverImages, setFormCoverImages] = useState([]);
  const [inlineUploading, setInlineUploading] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Notification
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      showNotification('Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const resetForm = () => {
    setFormTitle('');
    setFormSlug('');
    setFormExcerpt('');
    setFormContent('');
    setFormTags('');
    setFormStatus('draft');
    setFormCoverImages([]);
    setEditingPost(null);
    setShowPreview(false);
  };

  const openNewPost = () => {
    resetForm();
    setEditorOpen(true);
  };

  const openEditPost = (post) => {
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt || '');
    setFormContent(post.content);
    setFormTags((post.tags || []).join(', '));
    setFormStatus(post.status);
    setFormCoverImages(getCoverImages(post));
    setEditingPost(post);
    setEditorOpen(true);
    setShowPreview(false);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    resetForm();
  };

  // Auto-generate slug from title (only when creating new post)
  const handleTitleChange = (value) => {
    setFormTitle(value);
    if (!editingPost) {
      setFormSlug(generateSlug(value));
    }
  };

  // Cover image uploading is handled by CoverImagesManager component

  // Inline image upload for content
  const handleInlineImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInlineUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `inline-${Date.now()}.${fileExt}`;
      const filePath = `inline/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
      const markdownImg = `\n![${file.name}](${data.publicUrl})\n`;
      setFormContent((prev) => prev + markdownImg);
      showNotification('Image inserted into content');
    } catch (err) {
      console.error('Inline image upload error:', err);
      showNotification('Failed to upload image', 'error');
    } finally {
      setInlineUploading(false);
    }
  };

  // Save post (create or update)
  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      showNotification('Title and content are required', 'error');
      return;
    }

    if (!formSlug.trim()) {
      showNotification('Slug is required', 'error');
      return;
    }

    setSaving(true);
    try {
      const tagsArray = formTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const postData = {
        title: formTitle.trim(),
        slug: formSlug.trim(),
        excerpt: formExcerpt.trim() || null,
        content: formContent,
        cover_image_url: formCoverImages[0] || null,
        cover_images: formCoverImages,
        tags: tagsArray,
        status: formStatus,
        published_at: formStatus === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      if (editingPost) {
        // Preserve the original published_at if already published
        if (editingPost.published_at && formStatus === 'published') {
          postData.published_at = editingPost.published_at;
        }

        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
        showNotification('Post updated successfully');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        showNotification('Post created successfully');
      }

      closeEditor();
      fetchPosts();
    } catch (err) {
      console.error('Save error:', err);
      showNotification(err.message || 'Failed to save post', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete post
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) throw error;
      showNotification('Post deleted');
      setDeleteTarget(null);
      fetchPosts();
    } catch (err) {
      console.error('Delete error:', err);
      showNotification('Failed to delete post', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Toggle quick publish/draft
  const togglePostStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (newStatus === 'published' && !post.published_at) {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', post.id);

      if (error) throw error;
      showNotification(`Post ${newStatus === 'published' ? 'published' : 'unpublished'}`);
      fetchPosts();
    } catch (err) {
      console.error('Toggle status error:', err);
      showNotification('Failed to update status', 'error');
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      !searchFilter ||
      post.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (post.tags || []).some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderPreview = (content) => {
    const rawHtml = marked.parse(content || '');
    return DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['img'],
      ADD_ATTR: ['src', 'alt', 'title', 'loading'],
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium flex items-center gap-2.5 animate-slide-in-right ${
            notification.type === 'error'
              ? 'bg-red-950/90 border-red-800 text-red-300'
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-300'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {notification.message}
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Blog Posts</h2>
          <p className="text-slate-500 text-sm mt-1">{posts.length} total posts</p>
        </div>
        <button
          onClick={openNewPost}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex bg-slate-800 border border-slate-700 p-1 rounded-lg text-sm">
          {['all', 'published', 'draft'].map((mode) => (
            <button
              key={mode}
              onClick={() => setStatusFilter(mode)}
              className={`px-4 py-1.5 rounded-md font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === mode
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="h-48 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 border border-slate-800 bg-slate-900/40 rounded-2xl text-center">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">
            {posts.length === 0 ? 'No blog posts yet' : 'No matching posts'}
          </h3>
          <p className="text-slate-500 text-sm">
            {posts.length === 0
              ? 'Create your first post to get started.'
              : 'Try adjusting your search or filter.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-800 rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-5 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">
                  Post
                </th>
                <th className="px-5 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 hidden md:table-cell">
                  Status
                </th>
                <th className="px-5 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 hidden lg:table-cell">
                  Date
                </th>
                <th className="px-5 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-slate-900/40 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {getCoverImages(post)[0] ? (
                        <img
                          src={getCoverImages(post)[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-slate-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                          {post.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs mt-0.5">
                          /{post.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        post.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          post.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      ></span>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell">
                    {formatDate(post.published_at || post.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => togglePostStatus(post)}
                        title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        {post.status === 'published' ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                      <button
                        onClick={() => openEditPost(post)}
                        title="Edit"
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        title="Delete"
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Post</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="text-white font-semibold">"{deleteTarget.title}"</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingPost ? 'Edit Post' : 'New Post'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    showPreview
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {showPreview ? 'Editor' : 'Preview'}
                </button>
                <button
                  onClick={closeEditor}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {showPreview ? (
              /* Preview Panel */
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {formCoverImages.length > 0 && (
                  <div className="mb-6 rounded-xl overflow-hidden border border-slate-800">
                    <CoverImageCarousel
                      images={formCoverImages}
                      alt={formTitle || 'Untitled Post'}
                      className="h-48"
                    />
                  </div>
                )}
                <h1 className="text-3xl font-bold text-white mb-3">
                  {formTitle || 'Untitled Post'}
                </h1>
                {formExcerpt && (
                  <p className="text-lg text-slate-400 italic mb-6 pb-6 border-b border-slate-800">
                    {formExcerpt}
                  </p>
                )}
                <article
                  className="prose prose-invert prose-emerald max-w-none
                    prose-headings:text-white prose-headings:font-bold
                    prose-p:text-slate-300 prose-p:leading-relaxed
                    prose-a:text-emerald-400
                    prose-strong:text-white
                    prose-code:text-emerald-400 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-xl
                    prose-blockquote:border-emerald-500
                    prose-img:rounded-xl prose-img:border prose-img:border-slate-800"
                  dangerouslySetInnerHTML={{ __html: renderPreview(formContent) }}
                />
              </div>
            ) : (
              /* Editor Form */
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="My awesome blog post"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Slug
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm">/blog/</span>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="my-awesome-blog-post"
                      className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Excerpt
                  </label>
                  <textarea
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    placeholder="A brief summary of the post..."
                    rows={2}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {/* Cover Image Carousel Manager */}
                <div>
                  <CoverImagesManager
                    images={formCoverImages}
                    onChange={setFormCoverImages}
                  />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Content * (Markdown)
                    </label>
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-all cursor-pointer">
                      {inlineUploading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <ImageIcon size={12} />
                      )}
                      {inlineUploading ? 'Uploading...' : 'Insert Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleInlineImageUpload}
                        className="hidden"
                        disabled={inlineUploading}
                      />
                    </label>
                  </div>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder={"# Heading\n\nWrite your blog post content here using **Markdown**...\n\n## Subheading\n\n- List item 1\n- List item 2\n\n```javascript\nconsole.log('Hello World');\n```"}
                    rows={14}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-y font-mono leading-relaxed"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="React, Python, Tutorial"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFormStatus('draft')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        formStatus === 'draft'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                      }`}
                    >
                      Draft
                    </button>
                    <button
                      onClick={() => setFormStatus('published')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        formStatus === 'published'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                      }`}
                    >
                      Published
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800">
              <button
                onClick={closeEditor}
                className="px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {editingPost ? 'Update Post' : 'Save Post'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
