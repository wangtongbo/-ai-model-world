import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDict, isLang } from '@/lib/i18n';
import { LeaderboardPage } from '@/components/pages/LeaderboardPage';
import { languageAlternates, langParams } from '@/components/pages/shared';

export const dynamicParams = false;

export function generateStaticParams() {
  return langParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang) || lang === 'zh') return {};
  return {
    title: getDict(lang).nav.leaderboard,
    alternates: languageAlternates('/leaderboard/'),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang) || lang === 'zh') notFound();
  return <LeaderboardPage lang={lang} />;
}
