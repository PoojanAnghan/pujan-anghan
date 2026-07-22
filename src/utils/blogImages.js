/**
 * Returns a post's cover images as a clean array, regardless of whether it
 * has the new `cover_images` array populated or only the legacy
 * `cover_image_url` string.
 */
export function getCoverImages(post) {
  if (!post) return [];

  if (Array.isArray(post.cover_images) && post.cover_images.length > 0) {
    return post.cover_images.filter(Boolean);
  }

  if (post.cover_image_url) {
    return [post.cover_image_url];
  }

  return [];
}
