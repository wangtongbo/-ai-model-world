/**
 * 多语言视觉自查：en / ja / ko × 四种页面类型 × 1440 / 390 两个断点批量截图。
 * 与 shots.ts（中文版三页三断点）互补，验收清单见 docs/I18N.md 末节。
 *
 * 用法：npx tsx scripts/qa/shots-i18n.ts [baseUrl] [outDir] [modelSlug]
 * 默认对着 http://localhost:3001 截，产物落在 docs/samples/shots/<lang>/。
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:3001';
const OUT = process.argv[3] ?? 'docs/samples/shots';
const SLUG = process.argv[4] ?? 'anthropic-claude-opus-5-5';

const LANGS = ['en', 'ja', 'ko'] as const;
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 960 },
  { name: 'mobile', width: 390, height: 844 },
];
const PAGES = [
  { name: 'plaza', path: '' },
  { name: 'leaderboard', path: 'leaderboard/' },
  { name: 'model', path: `model/${SLUG}/` },
  { name: 'compare', path: 'compare/' },
];

async function main() {
  const browser = await chromium.launch();
  for (const lang of LANGS) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await ctx.newPage();
      for (const p of PAGES) {
        const url = `${BASE}/${lang}/${p.path}`;
        await page.goto(url, { waitUntil: 'networkidle' });
        // 精灵图是背景图，networkidle 之后再给动画一点时间落定
        await page.waitForTimeout(600);
        mkdirSync(join(OUT, lang), { recursive: true });
        const file = join(OUT, lang, `${p.name}-${vp.name}.png`);
        await page.screenshot({ path: file });
        console.log('wrote', file);
      }
      await ctx.close();
    }
  }
  await browser.close();
}

main();
