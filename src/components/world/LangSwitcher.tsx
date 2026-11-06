'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { getDict, LANG_PREF_KEY, LANGS, type Lang } from '@/lib/i18n';

/**
 * 语言切换器。挂在导航条上，四种语言的页面都显示。
 *
 * 目标地址由当前路径现算：路径首段是 en/ja/ko 就替换，否则加前缀（zh 无前缀），
 * query string 原样保留——在排行榜上切语言不该丢掉筛选条件。
 *
 * `useSearchParams` 会让最近的 Suspense 边界以内的部分退化为客户端渲染，
 * 所以调用方（SiteNav）必须把它包在 Suspense 里，别把整页的水合拖下水。
 */

const NAMES: Record<Lang, string> = { zh: '中文', en: 'EN', ja: '日本語', ko: '한국어' };

/** 当前路径换成另一种语言的地址。zh 无前缀，其余 `/en`、`/ja`、`/ko`。 */
export function langHref(target: Lang, pathname: string, query: string): string {
  const m = /^\/(en|ja|ko)(?=\/|$)/.exec(pathname);
  const rest = m ? pathname.slice(m[0].length) : pathname;
  const path = `${target === 'zh' ? '' : `/${target}`}${rest === '' ? '/' : rest}`;
  return query ? `${path}?${query}` : path;
}

export function LangSwitcher({ lang }: { lang: Lang }) {
  const dict = getDict(lang);
  const pathname = usePathname() ?? '/';
  const search = useSearchParams();
  const query = search?.toString() ?? '';

  return (
    <span className="flex items-center gap-0.5" role="group" aria-label={dict.ui.langSwitcher.label}>
      {LANGS.map((l) =>
        l === lang ? (
          <span
            key={l}
            aria-current="true"
            className="px-1 text-[12px] font-semibold leading-tight text-[var(--color-gold)]"
          >
            {NAMES[l]}
          </span>
        ) : (
          <Link
            key={l}
            href={langHref(l, pathname, query)}
            // 显式选择要压过浏览器语言自动跳转（根 layout 的内联脚本读这个键）
            onClick={() => {
              try {
                localStorage.setItem(LANG_PREF_KEY, l);
              } catch {
                /* 隐私模式写不进去就算了，下次访问仍按浏览器语言走 */
              }
            }}
            className="px-1 text-[12px] leading-tight text-[var(--color-ghost)] hover:text-[var(--color-parchment)]"
          >
            {NAMES[l]}
          </Link>
        ),
      )}
    </span>
  );
}
