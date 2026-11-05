import type { Metadata } from 'next';
import { ChroniclePage } from '@/components/pages/ChroniclePage';
import { languageAlternates } from '@/components/pages/shared';

export const metadata: Metadata = {
  title: '时间线',
  alternates: languageAlternates('/chronicle/'),
};

export default function Page() {
  return <ChroniclePage lang="zh" />;
}
