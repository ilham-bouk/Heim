import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ExternalLink, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import ConfirmInline from '../components/ui/ConfirmInline';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/admin/DataTable';
import PageHeader from '../components/admin/PageHeader';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/format';
import { focusAdminPageTitle } from '../utils/admin';

const iconButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground';

// Module-level so DataTable's memoised filtering/sorting stays stable.
const getPostId = (post) => post.id;
const getSearchText = (post) =>
  `${post.title} ${post.category} ${post.author} ${(post.tags ?? []).join(' ')} ${post.status} ${post.id}`;

const COLUMNS = [
  {
    key: 'title',
    header: 'Post',
    sortable: true,
    render: (post) => (
      <div className="flex min-w-56 items-center gap-3">
        <img src={post.image} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover" />
        <div className="min-w-0">
          <p className="line-clamp-1 font-medium text-foreground">{post.title}</p>
          <p className="text-xs text-muted-foreground">ID {post.id} · {post.readTime}</p>
        </div>
      </div>
    ),
  },
  { key: 'category', header: 'Category', sortable: true },
  { key: 'author', header: 'Author', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (post) => (
      <StatusBadge tone={post.status === 'published' ? 'success' : 'neutral'}>
        {post.status === 'published' ? 'Published' : 'Draft'}
      </StatusBadge>
    ),
  },
  {
    key: 'featured',
    header: 'Featured',
    sortable: true,
    sortValue: (post) => Number(!!post.featured),
    render: (post) => (post.featured ? 'Yes' : '—'),
  },
  {
    key: 'publishedAt',
    header: 'Date',
    sortable: true,
    render: (post) => <span className="whitespace-nowrap">{formatDate(post.publishedAt)}</span>,
  },
];

const AdminBlog = () => {
  const { allBlogPosts, deletePost } = useBlog();
  const toast = useToast();

  const [status, setStatus] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const rows = useMemo(
    () => (status ? allBlogPosts.filter((post) => post.status === status) : allBlogPosts),
    [allBlogPosts, status]
  );

  const handleDelete = async (post) => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      toast.success(`“${post.title}” was deleted.`);
      setConfirmingId(null);
      focusAdminPageTitle(); // the row (and the focused button) is gone
    } catch {
      toast.error('Could not delete the post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const statusFilter = (
    <div>
      <label htmlFor="post-status-filter" className="sr-only">Filter by status</label>
      <select
        id="post-status-filter"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </div>
  );

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title="Blog posts"
        description={`${allBlogPosts.length} posts, including drafts.`}
        actions={
          <Button as={Link} to="/admin/blog/new" className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add post
          </Button>
        }
      />

      <DataTable
        caption="Blog posts"
        columns={COLUMNS}
        rows={rows}
        getRowId={getPostId}
        searchText={getSearchText}
        searchLabel="Search posts"
        toolbar={statusFilter}
        initialSort={{ key: 'publishedAt', direction: 'desc' }}
        rowActions={(post) => (
          <div className="flex items-center justify-end gap-1">
            {post.status === 'published' && (
              <Link to={`/blog/${post.id}`} aria-label={`View ${post.title} in the store`} className={iconButtonClass}>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            <Link to={`/admin/blog/${post.id}/edit`} aria-label={`Edit ${post.title}`} className={iconButtonClass}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              aria-label={`Delete ${post.title}`}
              aria-expanded={confirmingId === post.id}
              onClick={() => setConfirmingId(post.id)}
              className={`${iconButtonClass} hover:text-destructive`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
        expandedRowId={confirmingId}
        renderExpandedRow={(post) => (
          <ConfirmInline
            message={`Delete “${post.title}”? It disappears from the blog.`}
            busy={isDeleting}
            onConfirm={() => handleDelete(post)}
            onCancel={() => setConfirmingId(null)}
          />
        )}
        emptyIcon={FileText}
        emptyTitle={status ? `No ${status} posts` : 'No posts yet'}
        emptyMessage={status ? 'Try another status.' : 'Write your first post to see it here and on the blog.'}
        emptyAction={
          status ? undefined : (
            <Button as={Link} to="/admin/blog/new">Add post</Button>
          )
        }
      />
    </div>
  );
};

export default AdminBlog;