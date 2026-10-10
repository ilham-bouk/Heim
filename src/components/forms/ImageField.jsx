import { useId } from 'react';
import { Upload } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Image preview with upload / URL controls. DISABLED in the demo on purpose.
 *
 * Real upload seam: add an `onChange(url)` prop, enable the controls, upload
 * the file to your own endpoint, and pass the returned URL up. ProductForm
 * then includes `image` in its payload. Until then it never sends `image`,
 * so saving an edit keeps the current picture.
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
          <img src={image} alt="Current product" className="h-full w-full object-cover" />
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
            Image upload is disabled in this demo. New products use a placeholder image; editing keeps the current one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageField;