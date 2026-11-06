/**
 * 语言自动跳转的回归检查（规则见 docs/I18N.md「首次访问默认语言」）：
 *
 * 1. 英文浏览器首次访问根路径 → 跳到 /en/
 * 2. 日文/韩文浏览器 → /ja/、/ko/
 * 3. 中文浏览器 → 留在中文版，不跳
 * 4. localStorage 里有显式选择（amw-lang）时，显式选择压过浏览器语言
 * 5. 已身处语言镜像时不再跳走
 *
 * 用法：npx tsx scripts/qa/lang-redirect-check.ts [baseUrl]
 * 默认对着 http://localhost:3001（先 npm run build 再 npx serve .next-build -l 3001）。
 * 注意本地验证要用「不带 NEXT_BASE_PATH」的构建产物，跳转目标是 /en/ 而不是 /<base>/en/。
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3001';

interface Case {
  name: string;
  locale: string;
  preset: string | null;
  from: string;
  expectPath: string;
}

const CASES: Case[] = [
  { name: '英文浏览器 → /en/', locale: 'en-US', preset: null, from: '/', expectPath: '/en/' },
  { name: '日文浏览器 → /ja/', locale: 'ja-JP', preset: null, from: '/', expectPath: '/ja/' },
  { name: '韩文浏览器 → /ko/', locale: 'ko-KR', preset: null, from: '/', expectPath: '/ko/' },
  { name: '法文浏览器兜底 → /en/', locale: 'fr-FR', preset: null, from: '/', expectPath: '/en/' },
  { name: '中文浏览器留在中文版', locale: 'zh-CN', preset: null, from: '/', expectPath: '/' },
  { name: '显式选过中文的英文浏览器留在中文版', locale: 'en-US', preset: 'zh', from: '/', expectPath: '/' },
  { name: '显式选过英文的中文浏览器 → /en/', locale: 'zh-CN', preset: 'en', from: '/', expectPath: '/en/' },
  {
    name: '子路径同样跳转，query 保留',
    locale: 'en-US',
    preset: null,
    from: '/leaderboard/?all=1',
    expectPath: '/en/leaderboard/?all=1',
  },
  { name: '已在 /ja/ 的英文访客不被弹回', locale: 'en-US', preset: null, from: '/ja/', expectPath: '/ja/' },
];

async function main() {
  const browser = await chromium.launch();
  let failed = 0;
  for (const c of CASES) {
    const ctx = await browser.newContext({ locale: c.locale });
    const page = await ctx.newPage();
    if (c.preset) {
      await page.addInitScript((v) => localStorage.setItem('amw-lang', v), c.preset);
    }
    await page.goto(BASE + c.from, { waitUntil: 'domcontentloaded' });
    // 跳转是同步内联脚本，domcontentloaded 时 location 已经换掉了
    const got = page.url().slice(BASE.length) || '/';
    const ok = got === c.expectPath;
    if (!ok) failed += 1;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name}  →  ${got}${ok ? '' : `（期望 ${c.expectPath}）`}`);
    await ctx.close();
  }
  await browser.close();
  console.log(failed === 0 ? `\n${CASES.length} 项全部通过` : `\n${failed} 项失败`);
  process.exit(failed === 0 ? 0 : 1);
}

main();
