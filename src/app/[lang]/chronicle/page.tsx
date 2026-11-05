import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDict, isLang } from '@/lib/i18n';
import { ChroniclePage } from '@/components/pages/ChroniclePage';
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
    title: getDict(lang).nav.chronicle,
    alternates: languageAlternates('/chronicle/'),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang) || lang === 'zh') notFound();
  return <ChroniclePage lang={lang} />;
}
