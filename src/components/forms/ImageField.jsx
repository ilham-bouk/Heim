import { useId } from 'react';
import { Upload } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Image preview with upload / URL controls. DISABLED in the demo on purpose. 
 *
 * Real upload seam (services/mediaService.js is the mock to replace):
 *   1. Add an `onChange(url)` prop and remove `disabled` from the button and URL input.
 *   2. Add a hidden <input type="file" accept={ALLOWED_IMAGE_TYPES.join(',')}>; on change,
 *      run validateImageFile(file) and show its error, otherwise `await uploadImage(file)`
 *      with a busy state, then call onChange(result.url).
 *   3. In ProductForm and BlogPostForm keep the URL in state and add `image` to toInput.
 *      CategoryForm has no toInput: add `image` to its onSubmit payload. Then update
 *      createProduct/applyProductInput and createCategory/applyCategoryInput
 *      (productService.js) and createPost/applyPostInput (blogService.js), which ignore
 *      `image` today (the category functions destructure only `{ name }`).
 *   4. Don't keep data URLs in localStorage: replace uploadImage with a real endpoint first.
 * Until then no form sends `image`, so saving an edit keeps the current picture.
 *
 * @param {string} image - URL of the image to preview
 * @param {string} [label='Image']
 */
const ImageField = ({ image, label = 'Image' }) => {
  const noteId = useId();

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-foreground">{label}</p>
      <div className="flex flex-wrap items-start gap-4">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
          <img src={image} alt="Current image" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            aria-describedby={noteId}
            className="gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload photo
          </Button>
          <input
            type="url"
            disabled
            aria-label="Image URL"
            aria-describedby={noteId}
            placeholder="https://example.com/photo.jpg"
            className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p id={noteId} className="text-xs text-muted-foreground">
            Image upload is disabled in this demo. New items use a placeholder image; editing keeps the current one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageField;