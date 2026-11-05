import type { Metadata, Viewport } from 'next';
import './globals.css';
import { DEFAULT_LANG, getDict, htmlLang } from '@/lib/i18n';
import { asset } from '@/lib/asset';

const dict = getDict(DEFAULT_LANG);

/*
 * 中文像素字体的 @font-face 内联在这里，不放 globals.css。
 *
 * 字体地址必须跟着部署前缀走：作为 B 站 Toy 发布时全站挂在 /toy/<slug>/ 下，
 * 写死的 /fonts/... 会打到 bilibili.com 的根上，中文整站掉回系统字体。
 * CSS 文件里既读不到环境变量，改成相对路径又会被打包器当模块在构建期解析失败，
 * 所以交给这里用 asset() 算，与精灵图、搜索索引共用同一套前缀规则。
 */
const fontFace = `@font-face{font-family:'Fusion Pixel';src:url('${asset('/fonts/pixel-zh.woff2')}') format('woff2');font-weight:400;font-style:normal;font-display:swap}`;

export const metadata: Metadata = {
  title: {
    default: `${dict.siteName} · ${dict.siteTagline}`,
    template: `%s · ${dict.siteName}`,
  },
  description: dict.siteDescription,
  applicationName: dict.siteName,
};

export const viewport: Viewport = {
  themeColor: '#0d1017',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang={htmlLang(DEFAULT_LANG)} data-scroll-behavior="smooth" className="h-full">
      <head>
        <style dangerouslySetInnerHTML={{ __html: fontFace }} />
      </head>
      {/*
        页脚不在这里渲染：根 layout 拿不到 [lang] 段的参数，而非中文版的页脚
        是另一种（简化）渲染。各页面正文组件（src/components/pages/）各自
        在 <main> 之后渲染 <SiteFooter lang={lang} />，中文版 DOM 与之前一致。
      */}
      <body className="min-h-full">{children}</body>
    </html>
  );
}
