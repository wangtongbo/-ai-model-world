import type { Metadata } from 'next';
import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { languageAlternates } from '@/components/pages/shared';

export const metadata: Metadata = {
  title: '隐私与免责',
  alternates: languageAlternates('/privacy/'),
};

export default function Page() {
  return <PrivacyPage lang="zh" />;
}
