import { useNavigate, useParams } from 'react-router';
import { FileText } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/admin/PageHeader';
import BlogPostForm from '../components/forms/BlogPostForm';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../context/ToastContext';

const LIST_PATH = '/admin/blog';

/**
 * Serves both /admin/blog/new (no :id) and /admin/blog/:id/edit.
 * The form owns the fields; this page owns "what saving means".
 */
const AdminBlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { allBlogPosts, getBlogPostForAdmin, addPost, updatePost } = useBlog();

  const isEditing = id !== undefined;
  const post = isEditing ? getBlogPostForAdmin(id) : null;
  const categorySuggestions = [...new Set(allBlogPosts.map((p) => p.category))].sort();

  if (isEditing && !post) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
        <PageHeader title="Post not found" backTo={LIST_PATH} backLabel="Back to posts" />
        <EmptyState
          icon={FileText}
          title="This post doesn't exist"
          message="It may have been deleted. Go back to the list to pick another one."
        />
      </div>
    );
  }

  const handleSubmit = async (input) => {
    try {
      if (isEditing) {
        await updatePost(post.id, input);
        toast.success(`“${input.title}” was updated.`);
      } else {
        await addPost(input);
        toast.success(`“${input.title}” was ${input.status === 'draft' ? 'saved as a draft' : 'published'}.`);
      }
      navigate(LIST_PATH);
    } catch {
      toast.error('Something went wrong while saving. Please try again.');
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title={isEditing ? 'Edit post' : 'Add post'}
        description={isEditing ? post.title : 'Published posts appear on the blog straight away.'}
        backTo={LIST_PATH}
        backLabel="Back to posts"
      />
      {/* key: resets the form if the route switches between /new and /:id/edit */}
      <BlogPostForm
        key={post?.id ?? 'new'}
        post={post}
        categorySuggestions={categorySuggestions}
        defaultAuthor={user?.fullName ?? ''}
        submitLabel={isEditing ? 'Save changes' : 'Add post'}
        cancelTo={LIST_PATH}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AdminBlogForm;