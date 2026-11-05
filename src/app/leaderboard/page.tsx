import type { Metadata } from 'next';
import { LeaderboardPage } from '@/components/pages/LeaderboardPage';
import { languageAlternates } from '@/components/pages/shared';

export const metadata: Metadata = {
  title: '排行榜',
  alternates: languageAlternates('/leaderboard/'),
};

export default function Page() {
  return <LeaderboardPage lang="zh" />;
}
