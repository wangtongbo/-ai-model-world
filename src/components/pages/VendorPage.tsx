import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GroundBackdrop } from '@/components/world/Ground';
import { SiteHeader } from '@/components/world/SiteHeader';
import { SiteFooter } from '@/components/world/SiteFooter';
import { Character } from '@/components/character/Character';
import { VendorCrest } from '@/components/character/VendorCrest';
import { loadSnapshot } from '@/lib/snapshot';
import { listSpriteSlugs, spriteOverlaysBaked } from '@/lib/sprites-available';
import { profileFor, vendorName } from '@/data/vendor-registry';
import { buildScales, rankByEci, visualOf } from '@/lib/derive';
import { getDict, langLink, type Lang } from '@/lib/i18n';
import { formatDate } from '@/lib/format';
import { KINDS, kindOf, type ModelKind } from '@/lib/kind';
import { outbound } from '@/lib/outbound';
import type { ModelRecord } from '@/lib/types';

/**
 * 厂商庄园：一家厂商的全家桶与历代演进。
 *
 * 按发布月份分代排列，同月内按日期倒序。
 * 这一屏回答的是「这家这些年是怎么走过来的」，
 * 与广场那一屏「此刻谁最强」互为补充。
 */

/**
 * 按**发布月份**分组，新的在上，组内也按日期倒序。
 *
 * 早先是按年分组、组内按综合智力降序——于是一整年的模型堆成一坨，
 * 顺序还是按分数排的，读者根本看不出谁先谁后。用户的原话是
 * 「只能看到发布区间，看不到具体时间线和先后顺序」。
 * 月份是这个站已经验证过的粒度（时间线页同款），厂商月份组数的中位数是 3，
 * 最多的 OpenAI 28 组——长，但那本来就是一条 28 个月的时间线。
 */
function groupByMonth(
  models: ModelRecord[],
): { key: string; year: number | null; month: number | null; models: ModelRecord[] }[] {
  const map = new Map<string, ModelRecord[]>();
  for (const m of models) {
    const key = m.releaseDate?.slice(0, 7) ?? '';
    const list = map.get(key);
    if (list) list.push(m);
    else map.set(key, [m]);
  }
  return Array.from(map.entries())
    .map(([key, list]) => ({
      key: key || 'unknown',
      year: key ? Number(key.slice(0, 4)) : null,
      month: key ? Number(key.slice(5, 7)) : null,
      models: list.sort(
        (a, b) =>
          (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '') ||
          (b.benchmarks.eci ?? -1) - (a.benchmarks.eci ?? -1) ||
          a.id.localeCompare(b.id),
      ),
    }))
    // 日期不详的排最后：它在时间轴上没有位置
    .sort((a, b) => (a.key === 'unknown' ? 1 : b.key === 'unknown' ? -1 : b.key.localeCompare(a.key)));
}

export function VendorPage({ lang, id }: { lang: Lang; id: string }) {
  const dict = getDict(lang);
  const snapshot = loadSnapshot();
  const vendor = snapshot.vendors.find((v) => v.id === id);
  if (!vendor) notFound();

  const profile = profileFor(vendor.id);
  const name = vendorName(profile, lang);
  const homepage = outbound(profile.homepage);
  const now = new Date(snapshot.generatedAt);
  const scales = buildScales(snapshot.models);
  const ranks = rankByEci(snapshot.models);
  const spriteSlugs = listSpriteSlugs();

  const family = snapshot.models.filter((m) => m.vendorId === vendor.id);
  const months = groupByMonth(family);
  const busiest = Math.max(...months.map((g) => g.models.length), 1);
  const retired = family.filter((m) => m.retiredAt).length;

  /*
   * 类型摘要。这一行是整页最先该被读到的东西：
   * 「这家有没有能看图的 / 能出图的」不该靠读者一个个点开模型去数，
   * 更不该靠猜名字——全站 89% 的视觉模型名字里既没有 V 也没有 VL。
   * 每一格都链到总表里筛好的那一屏，点进去就是名单。
   */
  const alive = family.filter((m) => !m.retiredAt);
  const kindCount = new Map<ModelKind, number>();
  for (const m of alive) {
    const k = kindOf(m);
    if (k) kindCount.set(k, (kindCount.get(k) ?? 0) + 1);
  }
  const multimodal = [...kindCount].reduce((n, [k, c]) => (k === 'text' ? n : n + c), 0);
  const kindChips = [
    ...(multimodal > 0
      ? [
          {
            key: 'multimodal',
            text: dict.kind.multimodal,
            n: multimodal,
            title: dict.kind.multimodalHint,
            href: `/leaderboard/all/?vendor=${vendor.id}&kind=multimodal`,
          },
        ]
      : []),
    ...KINDS.filter((k) => (kindCount.get(k) ?? 0) > 0).map((k) => ({
      key: k,
      text: dict.kind.label[k],
      n: kindCount.get(k)!,
      title: dict.kind.hint[k],
      href: `/leaderboard/all/?vendor=${vendor.id}&kind=${k}`,
    })),
  ];

  /** 名牌上那行小字：日期 + 类型。精确到月的就不编出一个「日」来。 */
  const subLabel = (m: ModelRecord, kindLabel: string): string => {
    if (!m.releaseDate) return kindLabel;
    const month = Number(m.releaseDate.slice(5, 7));
    const day = m.releaseDatePrecision === 'day' ? Number(m.releaseDate.slice(8, 10)) : null;
    return `${dict.pages.vendor.shortDate(month, day)} · ${kindLabel}`;
  };

  return (
    <>
      <main className="relative min-h-dvh">
        <GroundBackdrop />
        <div className="relative">
          <SiteHeader current="plaza" lang={lang} />

          <div className="page-shell pb-16 pt-4">
            <header className="mb-8 mt-4 flex items-center gap-4">
              <VendorCrest motif={profile.motif} accentColor={profile.accentColor} size={64} title={name} />
              <div>
                <h1 className="pixel-outline text-2xl sm:text-3xl">{name}</h1>
                <p className="mt-2 flex flex-wrap items-center gap-3 text-[12px]">
                  <span
                    style={{
                      color:
                        vendor.continent === 'west' ? 'var(--color-west)' : 'var(--color-east)',
                    }}
                  >
                    {dict.continent[vendor.continent]}
                  </span>
                  <span className="text-[var(--color-ghost)]">
                    {dict.pages.vendor.stats(family.length, retired)}
                  </span>
                  {homepage && (
                    <a
                      href={homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-gold)] hover:underline"
                    >
                      {dict.pages.vendor.officialSite}
                    </a>
                  )}
                </p>
              </div>
            </header>

            {kindChips.length > 0 && (
              <nav
                aria-label={dict.pages.vendor.kindNavLabel}
                className="mb-8 -mt-4 flex flex-wrap items-center gap-2"
              >
                {kindChips.map((c) => (
                  <Link
                    key={c.key}
                    href={langLink(lang, c.href)}
                    title={dict.pages.vendor.kindChipTitle(c.title)}
                    className="jump-chip flex items-baseline gap-1.5 border px-2 py-1 text-[13px] leading-tight text-[var(--color-parchment-dim)] hover:text-[var(--color-parchment-lit)]"
                    style={{ ['--jump' as string]: 'var(--color-gold)' }}
                  >
                    {c.text}
                    <span className="font-pixel text-[12px] text-[var(--color-gold)]">{c.n}</span>
                  </Link>
                ))}
              </nav>
            )}

            {/* 时间轴，与「时间线」页同一套视觉：左侧一条轴，节点大小随当月发布数量变化 */}
            <ol className="relative border-l-2 border-[var(--color-stone-dark)] pl-5 sm:pl-7">
              {months.map((g) => {
                const weight = g.models.length / busiest;
                return (
                  <li key={g.key} className="relative mb-8">
                    <span
                      className="absolute top-2 block bg-[var(--color-gold)]"
                      style={{
                        left: -22 - Math.round(weight * 4) - 5,
                        width: 10 + Math.round(weight * 8),
                        height: 10 + Math.round(weight * 8),
                        marginTop: -Math.round(weight * 4),
                        boxShadow: '0 0 8px rgb(242 207 106 / 0.45)',
                      }}
                      aria-hidden
                    />
                    <h2 className="flex items-baseline gap-3">
                      <span className="font-pixel text-[18px] leading-none text-[var(--color-parchment)]">
                        {g.year != null && g.month != null
                          ? dict.pages.timeline.monthHeading(g.year, g.month)
                          : dict.pages.vendor.unknownDate}
                      </span>
                      <span className="text-[13px] text-[var(--color-ghost)]">
                        {dict.pages.timeline.releases(g.models.length)}
                      </span>
                    </h2>

                    {/* w-fit：一个月常常只发一两个，铺满整行的空面板看着像出错了 */}
                    <div className="pixel-panel-dark mt-3 w-fit max-w-full px-3 pb-4 pt-5">
                      <div className="flex flex-wrap items-end gap-x-1 gap-y-5">
                        {g.models.map((m) => {
                          const kind = kindOf(m);
                          const kindLabel = kind ? dict.kind.label[kind] : dict.kind.unknown;
                          return (
                            <Character
                              overlaysNeeded={!spriteOverlaysBaked()}
                              key={m.id}
                              visual={visualOf(m, ranks.get(m.id) ?? null, now, scales)}
                              lang={lang}
                              hasSprite={spriteSlugs.has(m.slug)}
                              badge={subLabel(m, kindLabel)}
                              badgeTitle={`${formatDate(m.releaseDate, m.releaseDatePrecision, lang)}${kind ? ` · ${dict.kind.hint[kind]}` : ''}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <Link
              href={langLink(lang, '/')}
              className="mt-8 inline-block text-[12px] text-[var(--color-ghost)] hover:text-[var(--color-gold)]"
            >
              {dict.pages.vendor.backToPlaza}
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
