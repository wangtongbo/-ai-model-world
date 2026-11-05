/**
 * 页面层共享工具：静态参数列表与语言互指链接。
 * 根路径页面（zh）与 [lang] 路由层共用，保证两边生成的是同一份清单。
 */

import type { Metadata } from 'next';
import { loadSnapshot } from '@/lib/snapshot';
import { DEFAULT_LANG, LANGS, langPrefix, type Lang } from '@/lib/i18n';

/** [lang] 路由层产出的语言：根路径是中文版，这里只有其余三种。 */
export const ROUTE_LANGS: Lang[] = LANGS.filter((l) => l !== DEFAULT_LANG);

/** [lang] 静态页面的 generateStaticParams 返回值 */
export function langParams(): { lang: Lang }[] {
  return ROUTE_LANGS.map((lang) => ({ lang }));
}

/** 全部模型 slug（model/[slug] 的静态参数来源） */
export function allModelSlugs(): string[] {
  return loadSnapshot().models.map((m) => m.slug);
}

/** 全部厂商 id（vendor/[id] 的静态参数来源） */
export function allVendorIds(): string[] {
  return loadSnapshot().vendors.map((v) => v.id);
}

/**
 * metadata 的 alternates.languages：四种语言互指，x-default 指向根路径中文版。
 * path 为站内绝对路径（如 '/chronicle/'），首页传 '/'。
 */
export function languageAlternates(path: string): Metadata['alternates'] {
  return {
    languages: {
      'zh-CN': path,
      en: `${langPrefix('en')}${path}`,
      ja: `${langPrefix('ja')}${path}`,
      ko: `${langPrefix('ko')}${path}`,
      'x-default': path,
    },
  };
}
