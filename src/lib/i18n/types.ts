/**
 * 多语言核心类型。被 index.ts 与各字典分文件共同引用，本身不引用任何字典，
 * 避免循环依赖。新增语言时：LANGS 加一项，LText 自动强制所有字典补齐。
 */

export const LANGS = ['zh', 'en', 'ja', 'ko'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'zh';

export function isLang(s: string): s is Lang {
  return (LANGS as readonly string[]).includes(s);
}

/** 多语言文本。四键齐全是强制的——Record<Lang, string> 让漏译直接编译报错。 */
export type LText = Record<Lang, string>;

/** 取一条多语言文本。正常不会缺键，兜底链只是防御。 */
export function lt(text: LText, lang: Lang): string {
  return text[lang] ?? text.en ?? text.zh;
}
