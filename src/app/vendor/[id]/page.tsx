import { profileFor } from '@/data/vendor-registry';
import { getDict } from '@/lib/i18n';
import { VendorPage } from '@/components/pages/VendorPage';
import { allVendorIds, languageAlternates } from '@/components/pages/shared';

export function generateStaticParams() {
  return allVendorIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<'/vendor/[id]'>) {
  const { id } = await params;
  const profile = profileFor(id);
  const dict = getDict('zh');
  return {
    title: dict.pages.vendor.metaTitle(profile.nameZh),
    alternates: languageAlternates(`/vendor/${id}/`),
  };
}

export default async function Page({ params }: PageProps<'/vendor/[id]'>) {
  const { id } = await params;
  return <VendorPage lang="zh" id={id} />;
}
