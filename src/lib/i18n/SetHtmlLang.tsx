'use client';

/**
 * 静态导出下嵌套 layout 改不了根 <html> 的 lang 属性，
 * 挂载后在客户端修正（Google 渲染 JS，能拿到修正后的值）。
 */

import { useEffect } from 'react';

import { htmlLang, type Lang } from './index';

export function SetHtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = htmlLang(lang);
  }, [lang]);
  return null;
}
