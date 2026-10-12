import { Metadata } from 'next';
import CategoriesAdmin from '@/components/admin/CategoriesAdmin';

export const metadata: Metadata = {
  title: 'Blog Categories | NearGrow Ads CMS',
  description: 'Manage blog categories for marketing articles.',
};

export const dynamic = 'force-dynamic';

export default function AdminCategoriesPage() {
  return <CategoriesAdmin />;
}
