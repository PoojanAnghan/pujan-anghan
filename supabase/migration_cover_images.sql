-- Adds multi cover-image support to blog_posts
-- Safe to run multiple times.

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS cover_images TEXT[] DEFAULT '{}';

-- Backfill: turn any existing single cover_image_url into a one-item array,
-- but only for rows that don't already have cover_images set.
UPDATE public.blog_posts
SET cover_images = ARRAY[cover_image_url]
WHERE cover_image_url IS NOT NULL
  AND cover_image_url <> ''
  AND (cover_images IS NULL OR cover_images = '{}');
