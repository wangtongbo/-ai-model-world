/**
 * 多语言入口。所有现有 `@/lib/i18n` / `./i18n` 导入不变。
 *
 * 字典按层拆成四个文件（见 docs/I18N.md）：
 * - core-dict  站名/导航/广场等全站共用（原 i18n.ts 的内容）
 * - lib-dict   lib 层模板文案（persona / aptitude / champions / traits / 搜索 / insights）
 * - ui-dict    组件层文案
 * - pages-dict 页面层文案
 */

import { coreDict, type CoreDict } from './core-dict';
import { libDict, type LibDict } from './lib-dict';
import { pagesDict, type PagesDict } from './pages-dict';
import { uiDict, type UiDict } from './ui-dict';

export { DEFAULT_LANG, isLang, LANGS, lt } from './types';
export type { Lang, LText } from './types';
export type { CoreDict };

import { DEFAULT_LANG, type Lang, type LText } from './types';

export type Dict = CoreDict & {
  lib: LibDict;
  ui: UiDict;
  pages: PagesDict;
};

export function getDict(lang: Lang): Dict {
  return { ...coreDict[lang], lib: libDict[lang], ui: uiDict[lang], pages: pagesDict[lang] };
}

export function htmlLang(lang: Lang): string {
  return lang === 'zh' ? 'zh-CN' : lang;
}

/** 站内路径前缀：中文版（默认语言）无前缀，其余 `/en`、`/ja`、`/ko`。 */
export function langPrefix(lang: Lang): string {
  return lang === DEFAULT_LANG ? '' : `/${lang}`;
}

/**
 * 站内链接加语言前缀。中文版输出与改造前逐字节一致。
 * 锚点（#x）与站外链接（http…）原样返回。
 */
export function langLink(lang: Lang, href: string): string {
  if (href.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(href)) return href;
  return `${langPrefix(lang)}${href}`;
}

/** 便捷：直接在模板里取一条 LText。 */
export function t(text: LText, lang: Lang): string {
  return text[lang] ?? text.en ?? text.zh;
}
