// Image upload helpers. NOT WIRED: ImageField is disabled in this demo and no form
// sends `image` (see components/forms/ImageField.jsx for the wiring steps).
//
// Deviation from the other services: uploadImage is async with mock latency here,
// because there is no state to own (the other services stay pure and their contexts
// own the latency). validateImageFile is pure.
//
// Real-backend seam:
//   uploadImage → POST /admin/media (multipart/form-data, field "file"). The server must
//   validate type and size again, re-encode or sanitize the file, store it (S3, Cloudinary...)
//   and return its public URL. Never trust file.type from the client alone.
//   The mock below resolves a data URL, which is too big to keep in localStorage for long.

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']; // no SVG: it needs server-side sanitizing
export const MAX_IMAGE_MB = 2;
export const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

const MOCK_LATENCY_MS = 800; // simulated network delay: remove when wiring a real API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Client-side checks, so the form can show a message before uploading.
 * @param {File|null|undefined} file
 * @returns {{ok: true} | {ok: false, error: string}}
 */
export const validateImageFile = (file) => {
  if (!file) return { ok: false, error: 'Choose an image to upload.' };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return { ok: false, error: 'Use a JPG, PNG or WebP image.' };
  if (file.size === 0) return { ok: false, error: 'The file is empty.' };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: `The image must be smaller than ${MAX_IMAGE_MB} MB.` };
  return { ok: true };
};

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

/**
 * Uploads one image and returns where it lives.
 * @param {File} file
 * @returns {Promise<{url: string}>}
 * @throws {Error} with a user-facing message when the file fails validation
 */
export const uploadImage = async (file) => {
  const check = validateImageFile(file);
  if (!check.ok) throw new Error(check.error);

  await delay(MOCK_LATENCY_MS);
  return { url: await readAsDataUrl(file) };
};