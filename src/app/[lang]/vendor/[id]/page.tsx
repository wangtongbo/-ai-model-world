import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { profileFor, vendorName } from '@/data/vendor-registry';
import { getDict, isLang } from '@/lib/i18n';
import { VendorPage } from '@/components/pages/VendorPage';
import { allVendorIds, languageAlternates, ROUTE_LANGS } from '@/components/pages/shared';

export const dynamicParams = false;

/** lang × id 笛卡尔积：三个语言镜像各产出全部厂商页 */
export function generateStaticParams() {
  const ids = allVendorIds();
  return ROUTE_LANGS.flatMap((lang) => ids.map((id) => ({ lang, id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLang(lang) || lang === 'zh') return {};
  const dict = getDict(lang);
  const profile = profileFor(id);
  return {
    title: dict.pages.vendor.metaTitle(vendorName(profile, lang)),
    alternates: languageAlternates(`/vendor/${id}/`),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLang(lang) || lang === 'zh') notFound();
  return <VendorPage lang={lang} id={id} />;
}
