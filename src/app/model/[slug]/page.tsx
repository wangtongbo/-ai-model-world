import { loadSnapshot } from '@/lib/snapshot';
import { profileFor } from '@/data/vendor-registry';
import { getDict } from '@/lib/i18n';
import { ModelDetailPage } from '@/components/pages/ModelDetailPage';
import { allModelSlugs, languageAlternates } from '@/components/pages/shared';

export function generateStaticParams() {
  return allModelSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/model/[slug]'>) {
  const { slug } = await params;
  const dict = getDict('zh');
  const model = loadSnapshot().models.find((m) => m.slug === slug);
  if (!model) return { title: dict.pages.model.unknownResident };
  const profile = profileFor(model.vendorId);
  return {
    title: model.name,
    description: dict.pages.model.metaDescription(
      profile.nameZh,
      model.name,
      model.contextWindow,
      model.pricing.outputPerMTok,
    ),
    alternates: languageAlternates(`/model/${slug}/`),
  };
}

export default async function Page({ params }: PageProps<'/model/[slug]'>) {
  const { slug } = await params;
  return <ModelDetailPage lang="zh" slug={slug} />;
}
