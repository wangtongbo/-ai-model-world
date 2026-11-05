import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';
import { languageAlternates } from '@/components/pages/shared';

export const metadata: Metadata = {
  alternates: languageAlternates('/'),
};

export default function Page() {
  return <HomePage lang="zh" />;
}
