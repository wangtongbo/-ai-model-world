import type { Metadata } from 'next';
import { ComparePage } from '@/components/pages/ComparePage';
import { languageAlternates } from '@/components/pages/shared';

export const metadata: Metadata = {
  title: '模型对比',
  alternates: languageAlternates('/compare/'),
};

export default function Page() {
  return <ComparePage lang="zh" />;
}
