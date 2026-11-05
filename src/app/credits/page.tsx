import type { Metadata } from 'next';
import { CreditsPage } from '@/components/pages/CreditsPage';
import { languageAlternates } from '@/components/pages/shared';

export const metadata: Metadata = {
  title: '素材署名',
  alternates: languageAlternates('/credits/'),
};

export default function Page() {
  return <CreditsPage lang="zh" />;
}
