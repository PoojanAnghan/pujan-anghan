import { useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { supabase } from '../utils/supabase';

/**
 * Drop into your post edit form in place of the old single cover_image_url
 * uploader. Controlled component — you own the array in your form state.
 *
 * <CoverImagesManager
 *   images={formData.cover_images || []}
 *   onChange={(next) => setFormData({ ...formData, cover_images: next })}
 * />
 */
export default function CoverImagesManager({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file) => {
    const ext = file.name.split('.').pop();
    const path = `covers/cover-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(path, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFiles = async (fileList) => {
    setUploading(true);
    try {
      const files = Array.from(fileList);
      const uploaded = [];
      for (const file of files) {
        uploaded.push(await uploadFile(file));
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      console.error('Error uploading cover image:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx) => onChange(images.filter((_, i) => i !== idx));

  const moveTo = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-350">
        Cover images
        {images.length > 1 && (
          <span className="text-slate-500 font-normal"> ({images.length} — first shown is primary)</span>
        )}
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, idx) => (
            <div
              key={url + idx}
              className="relative group rounded-lg overflow-hidden border border-slate-700"
            >
              <img src={url} alt="" className="w-full h-24 object-cover" />

              {idx === 0 && (
                <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 text-white">
                  Primary
                </span>
              )}

              <button
                type="button"
                onClick={() => removeAt(idx)}
                aria-label="Remove image"
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => moveTo(idx, idx - 1)}
                  disabled={idx === 0}
                  aria-label="Move earlier"
                  className="w-5 h-5 rounded bg-slate-900/80 text-white flex items-center justify-center disabled:opacity-30"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => moveTo(idx, idx + 1)}
                  disabled={idx === images.length - 1}
                  aria-label="Move later"
                  className="w-5 h-5 rounded bg-slate-900/80 text-white flex items-center justify-center disabled:opacity-30"
                >
                  ›
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="flex items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-slate-500 transition-colors text-slate-550 hover:text-slate-350">
        {uploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add image{images.length > 0 ? 's' : ''}</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}
