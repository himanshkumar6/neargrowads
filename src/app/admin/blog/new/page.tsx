import { Metadata } from 'next';
import BlogEditorForm from '../[id]/BlogEditorForm';

export const metadata: Metadata = {
  title: 'Add New Post | Admin Dashboard',
  description: 'Create and publish a new marketing article.',
};

export const dynamic = 'force-dynamic';

export default function AdminNewBlogPage() {
  return <BlogEditorForm blogId="new" />;
}
