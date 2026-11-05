import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDict, isLang } from '@/lib/i18n';
import { SetHtmlLang } from '@/lib/i18n/SetHtmlLang';

/**
 * 非中文版（/en/、/ja/、/ko/）的镜像路由层。
 *
 * 静态导出下嵌套 layout 改不了根 <html lang>（根 layout 是中文版，保持 zh-CN），
 * 由 SetHtmlLang 在客户端挂载后修正——这是 docs/I18N.md 约定俗成的做法。
 */

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang) || lang === 'zh') return {};
  const dict = getDict(lang);
  return {
    title: {
      default: `${dict.siteName} · ${dict.siteTagline}`,
      template: `%s · ${dict.siteName}`,
    },
    description: dict.siteDescription,
    applicationName: dict.siteName,
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang) || lang === 'zh') notFound();
  return (
    <>
      <SetHtmlLang lang={lang} />
      {children}
    </>
  );
}
