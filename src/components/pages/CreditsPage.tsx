import { GroundBackdrop } from '@/components/world/Ground';
import { SiteHeader } from '@/components/world/SiteHeader';
import { SiteFooter } from '@/components/world/SiteFooter';
import { getDict, type Lang } from '@/lib/i18n';
import { outbound } from '@/lib/outbound';

/**
 * 素材署名页。
 *
 * 角色是本项目逐像素手绘的原创像素画（`scripts/sprites/chibi/`），不含第三方美术素材；
 * 但有一部分形象借用了社区里已经流传开的娘化设定，这里写明出处。
 * 这张表与 `scripts/sprites/chibi/designs.ts` 里 `basis` 为 community / official 的条目一一对应，
 * 改那边的时候同步改这里。
 *
 * 条目（人名 / 作品名 / URL）不翻译，说明文字四语言齐备（pages-dict.credits）。
 */

const LMARENA_DATASET = 'https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset';

export function CreditsPage({ lang }: { lang: Lang }) {
  const dict = getDict(lang);
  const pd = dict.pages.credits;

  // who 是角色名，不翻译；basis 是来历说明，走字典；href 原样
  const characterSources: { who: string; basis: string; href?: string }[] = [
    {
      who: 'GPT 酱、GPT Image 娘、Claude 娘、Gemini 娘',
      basis: pd.basis.linuxdo,
      href: 'https://linux.do/t/topic/2052255',
    },
    { who: 'DeepSeek 鲸鱼娘', basis: pd.basis.deepseek, href: 'https://zh.moegirl.org.cn/DeepSeek%E5%A8%98' },
    { who: '智谱 Z 狐娘', basis: pd.basis.zfox },
    { who: 'Grok 娘', basis: pd.basis.grok },
    { who: '豆包', basis: pd.basis.doubao },
  ];

  return (
    <>
      <main className="relative min-h-dvh">
        <GroundBackdrop />
        <div className="relative">
          <SiteHeader current={null} lang={lang} narrow />

          <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-4 sm:px-8">
            <h1 className="pixel-outline mb-2 mt-4 text-2xl sm:text-3xl">{dict.footer.credits}</h1>
            <section className="pixel-panel-dark mb-6 p-4">
              <h2 className="mb-2 font-pixel text-[14px] text-[var(--color-gold)]">
                {pd.charactersTitle}
              </h2>
              <p className="mb-2 text-[13px] leading-relaxed text-[var(--color-parchment)]">
                {pd.charactersIntro}
              </p>
              <ul className="space-y-1 text-[13px] leading-relaxed text-[var(--color-parchment)]">
                {characterSources.map((c) => (
                  <li key={c.who}>
                    {c.who}：
                    {outbound(c.href) ? (
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-dotted underline-offset-2 hover:text-[var(--color-gold)]"
                      >
                        {c.basis}
                      </a>
                    ) : (
                      c.basis
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section className="pixel-panel-dark mb-6 p-4">
              <h2 className="mb-2 font-pixel text-[14px] text-[var(--color-gold)]">{pd.dataTitle}</h2>
              <ul className="space-y-1 text-[13px] leading-relaxed text-[var(--color-parchment)]">
                <li>{pd.epoch}</li>
                <li>{pd.metadataLine}</li>
                <li>{pd.livebench}</li>
                {/*
                  CC-BY 4.0 要求四件事：署创作者、给许可名与链接、给材料链接、声明改动。
                  前三项在这一句里，第四项是后半句——少了它就是违约。
                */}
                <li>
                  {pd.arenaIntro}
                  {outbound(LMARENA_DATASET) ? (
                    <a
                      href={LMARENA_DATASET}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-dotted hover:text-[var(--color-gold)]"
                    >
                      {pd.arenaDataset}
                    </a>
                  ) : (
                    pd.arenaDatasetFallback
                  )}
                  {pd.arenaSep}
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-dotted hover:text-[var(--color-gold)]"
                  >
                    CC-BY 4.0
                  </a>
                  {pd.arenaChanges}
                </li>
                <li>{pd.font}</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
