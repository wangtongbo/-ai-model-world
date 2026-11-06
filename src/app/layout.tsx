import type { Metadata, Viewport } from 'next';
import './globals.css';
import { DEFAULT_LANG, getDict, htmlLang, LANG_PREF_KEY } from '@/lib/i18n';
import { asset } from '@/lib/asset';

const dict = getDict(DEFAULT_LANG);

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * 访客语言自动跳转（运营者决策，见 docs/I18N.md）。
 *
 * 纯静态导出没有服务器，只能在客户端做：以内联脚本抢在首帧渲染前执行，
 * 避免非中文访客先看到一闪而过的中文。
 * 规则：已身处某个语言镜像（/en/、/ja/、/ko/）就记住选择并放行；
 * 在中文版路径上时——有显式选择（LangSwitcher 写过的）按选择走，
 * 没有就按浏览器语言判定，判不出来兜底 en。蜘蛛不执行 JS，
 * 看到的仍是根路径中文版与各语言互为 alternates 的完整链接图。
 */
const langDetect = `(function(){try{
var rest=location.pathname.slice('${BASE}'.length);
var m=/^\\/(en|ja|ko)(?=\\/|$)/.exec(rest);
var pref=localStorage.getItem('${LANG_PREF_KEY}');
if(m){if(pref!==m[1])localStorage.setItem('${LANG_PREF_KEY}',m[1]);return;}
if(pref!=='zh'&&pref!=='en'&&pref!=='ja'&&pref!=='ko'){
var n=((navigator.languages&&navigator.languages[0])||navigator.language||'').toLowerCase();
pref=n.indexOf('zh')===0?'zh':n.indexOf('ja')===0?'ja':n.indexOf('ko')===0?'ko':'en';
localStorage.setItem('${LANG_PREF_KEY}',pref);
}
if(pref!=='zh')location.replace('${BASE}/'+pref+(rest===''?'/':rest)+location.search+location.hash);
}catch(e){}})()`;

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
        <script dangerouslySetInnerHTML={{ __html: langDetect }} />
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
