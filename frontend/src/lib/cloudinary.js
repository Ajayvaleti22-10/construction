/**
 * Cloudinary URL helpers for static site gallery.
 * Set REACT_APP_CLOUDINARY_CLOUD_NAME to use Cloudinary; image fields can be
 * either full URLs (https://...) or Cloudinary public IDs (e.g. "gallery/project1").
 */

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "";

/**
 * Build a Cloudinary image URL with optional transforms.
 * @param {string} publicId - Cloudinary public_id (e.g. "gallery/hero" or "folder/image")
 * @param {object} options - { w, h, q, crop, f_auto }
 * @returns {string} Full Cloudinary URL
 */
export function getCloudinaryUrl(publicId, options = {}) {
  if (!publicId || typeof publicId !== "string") return "";
  if (!CLOUD_NAME) return "";
  const { w = 800, q = 80, crop = "fill", f_auto = "auto" } = options;
  const transforms = [`w_${w}`, `q_${q}`, `c_${crop}`, `f_${f_auto}`].filter(Boolean).join(",");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

/**
 * Returns true if the value looks like a Cloudinary public ID (no protocol).
 */
export function isCloudinaryPublicId(value) {
  if (!value || typeof value !== "string") return false;
  return !/^https?:\/\//i.test(value.trim());
}

/**
 * Resolve an image source: use as-is if full URL, else build Cloudinary URL.
 * Use for gallery/project images so you can mix URLs and Cloudinary public IDs.
 */
export function resolveImageUrl(urlOrPublicId, options = {}) {
  if (!urlOrPublicId) return "";
  const s = String(urlOrPublicId).trim();
  if (isCloudinaryPublicId(s)) return getCloudinaryUrl(s, options);
  return s;
}

/**
 * Resolve multiple image sources (e.g. project.images array).
 */
export function resolveImageUrls(urlsOrPublicIds, options = {}) {
  if (!Array.isArray(urlsOrPublicIds)) return [];
  return urlsOrPublicIds.map((item) => resolveImageUrl(item, options)).filter(Boolean);
}
