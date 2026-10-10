import { Metadata } from 'next';
import CategoriesAdmin from '@/components/admin/CategoriesAdmin';

export const metadata: Metadata = {
  title: 'Blog Categories | Admin Dashboard',
  description: 'Manage blog categories for marketing articles.',
};

export const dynamic = 'force-dynamic';

export default function AdminBlogCategoriesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CategoriesAdmin />
    </div>
  );
}
