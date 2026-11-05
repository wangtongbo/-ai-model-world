import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDict, isLang } from '@/lib/i18n';
import { HomePage } from '@/components/pages/HomePage';
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
  const dict = getDict(lang);
  return {
    // absolute 绕开根 layout 的中文标题模板（`%s · 大模型世界`），否则非中文首页标题会带上中文后缀
    title: { absolute: `${dict.siteName} · ${dict.siteTagline}` },
    alternates: languageAlternates('/'),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang) || lang === 'zh') notFound();
  return <HomePage lang={lang} />;
}
