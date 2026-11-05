import type { Metadata } from 'next';
import { LeaderboardAllPage } from '@/components/pages/LeaderboardAllPage';
import { languageAlternates } from '@/components/pages/shared';

export const metadata: Metadata = {
  title: '全部模型',
  alternates: languageAlternates('/leaderboard/all/'),
};

export default function Page() {
  return <LeaderboardAllPage lang="zh" />;
}
