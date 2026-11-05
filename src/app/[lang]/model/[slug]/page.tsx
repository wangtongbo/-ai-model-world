import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSnapshot } from '@/lib/snapshot';
import { profileFor, vendorName } from '@/data/vendor-registry';
import { getDict, isLang } from '@/lib/i18n';
import { ModelDetailPage } from '@/components/pages/ModelDetailPage';
import { allModelSlugs, languageAlternates, ROUTE_LANGS } from '@/components/pages/shared';

export const dynamicParams = false;

/** lang × slug 笛卡尔积：三个语言镜像各产出全部模型详情页 */
export function generateStaticParams() {
  const slugs = allModelSlugs();
  return ROUTE_LANGS.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang) || lang === 'zh') return {};
  const dict = getDict(lang);
  const model = loadSnapshot().models.find((m) => m.slug === slug);
  if (!model) return { title: dict.pages.model.unknownResident };
  const profile = profileFor(model.vendorId);
  return {
    title: model.name,
    description: dict.pages.model.metaDescription(
      vendorName(profile, lang),
      model.name,
      model.contextWindow,
      model.pricing.outputPerMTok,
    ),
    alternates: languageAlternates(`/model/${slug}/`),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang) || lang === 'zh') notFound();
  return <ModelDetailPage lang={lang} slug={slug} />;
}
