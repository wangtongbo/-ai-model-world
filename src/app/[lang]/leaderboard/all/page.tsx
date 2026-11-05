import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDict, isLang } from '@/lib/i18n';
import { LeaderboardAllPage } from '@/components/pages/LeaderboardAllPage';
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
    title: getDict(lang).pages.allModels.title,
    alternates: languageAlternates('/leaderboard/all/'),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang) || lang === 'zh') notFound();
  return <LeaderboardAllPage lang={lang} />;
}
