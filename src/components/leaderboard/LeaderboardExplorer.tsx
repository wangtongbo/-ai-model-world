'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { VendorCrest } from '@/components/character/VendorCrest';
import { readableOnDark } from '@/lib/color';
import { BENCHMARK_CATEGORIES, categoryName } from '@/data/benchmark-registry';
import { getDict, langLink, type Lang } from '@/lib/i18n';
import { filterFromParams, filterToParams, makePredicate, EMPTY_FILTER, type FilterState } from './filters';
import { ModelFilters } from './ModelFilters';
import type { ExplorerData, LeanEntry, LeanTrack, LeanVendor } from './types';
import { useUrlQuery } from './useUrlQuery';

/** 厂商显示名：zh 用中文名，en/ja/ko 用国际通用名（产品决策：厂商名不翻译）。 */
function vendorLabel(v: LeanVendor | undefined, lang: Lang): string | undefined {
  if (!v) return undefined;
  return lang === 'zh' ? v.nameZh : v.nameEn;
}

/** 分类的展示名。分类 id 刻意保留中文取值（管线契约），展示名查注册表；「实用指标」不在注册表里。 */
function categoryLabel(c: string, lang: Lang): string {
  if (c === '实用指标') return getDict(lang).ui.leaderboard.categoryPractical;
  const cat = BENCHMARK_CATEGORIES.find((x) => x.id === c);
  return cat ? categoryName(cat, lang) : c;
}

/**
 * 排行榜的交互层。
 *
 * 服务端已经把每条赛道算好、排好、格式化好，这里只做三件事：切赛道、筛人、展开。
 * 所有状态都在 URL 的 query 里，刷新与分享都不丢。
 *
 * 一条赛道内条形的长短按**当前显示的名单**的最小值到最大值归一：只看国内模型时，
 * 国内第一名的条就是满的，而不是被国外榜首压成一小截。
 */

const DEFAULT_LIMIT = 30;

const MEDAL: Record<number, string> = {
  1: 'var(--color-gold)',
  2: '#c9d1e3',
  3: '#d1915a',
};

function barFraction(track: LeanTrack, values: number[], v: number): number {
  const xf = track.scale === 'log' ? (x: number) => Math.log10(Math.max(x, 1e-9)) : (x: number) => x;
  const xs = values.map(xf);
  const min = Math.min(...xs);
  const max = Math.max(...xs);
  if (max === min) return 1;
  const x = xf(v);
  return track.higherIsBetter ? (x - min) / (max - min) : (max - x) / (max - min);
}

export function LeaderboardExplorer({ data, lang }: { data: ExplorerData; lang: Lang }) {
  const dict = getDict(lang);
  const [params, update] = useUrlQuery();

  const filter = useMemo(() => (params ? filterFromParams(params) : EMPTY_FILTER), [params]);
  const showLegacy = params?.get('legacy') === '1';
  const showAll = params?.get('all') === '1';

  const vendorMap = useMemo(() => new Map(data.vendors.map((v) => [v.id, v])), [data.vendors]);

  const visibleTracks = useMemo(
    () => data.tracks.filter((t) => showLegacy || !t.superseded),
    [data.tracks, showLegacy],
  );
  const hasLegacy = data.tracks.some((t) => t.superseded);

  const requested = params?.get('track') ?? data.defaultTrack;
  const track =
    data.tracks.find((t) => t.id === requested) ??
    data.tracks.find((t) => t.id === data.defaultTrack) ??
    data.tracks[0];

  const grouped = useMemo(() => {
    const map = new Map<string, LeanTrack[]>();
    for (const t of visibleTracks) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return data.categories.filter((c) => map.has(c)).map((c) => ({ category: c, tracks: map.get(c)! }));
  }, [visibleTracks, data.categories]);

  const predicate = useMemo(() => makePredicate(filter, vendorMap), [filter, vendorMap]);
  const eligible = useMemo(() => data.models.filter(predicate).length, [data.models, predicate]);

  const entries = useMemo(
    () => (track ? track.entries.filter((e) => predicate(data.models[e.m])) : []),
    [track, predicate, data.models],
  );
  const shown = useMemo(
    () => (showAll ? entries : entries.slice(0, DEFAULT_LIMIT)),
    [entries, showAll],
  );
  // 条形按**当前显示的这一截**归一。ECI 前 30 名只差 6 分，若按全榜 194 人归一，
  // 三十根条会长得一模一样，条形图就白画了。
  const values = useMemo(() => shown.map((e) => e.v), [shown]);

  const setFilter = (next: FilterState) => update({ ...filterToParams(next), all: null });
  const setTrack = (id: string) => update({ track: id === data.defaultTrack ? null : id, all: null });

  if (!track) {
    return (
      <div className="pixel-panel-dark p-6 text-[14px] text-[var(--color-parchment)]">
        {dict.ui.leaderboard.noTracks}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
      {/* 赛道切换：桌面端左侧竖排，移动端折成下拉 */}
      <nav
        aria-label={dict.ui.leaderboard.navAria}
        className="lg:sticky lg:top-2 lg:max-h-[calc(100dvh-1rem)] lg:w-52 lg:shrink-0 lg:overflow-y-auto lg:pr-1"
      >
        <div className="lg:hidden">
          <select
            value={track.id}
            onChange={(e) => setTrack(e.target.value)}
            aria-label={dict.ui.leaderboard.selectTrack}
            className="w-full border-3 border-[var(--color-ink)] bg-[var(--color-parchment)] px-2 py-1.5 text-[14px] text-[var(--color-ink)]"
          >
            {grouped.map((g) => (
              <optgroup key={g.category} label={categoryLabel(g.category, lang)}>
                {g.tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {dict.ui.leaderboard.trackOption(t.label, t.entries.length)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="hidden flex-col gap-3 lg:flex">
          {grouped.map((g) => (
            <div key={g.category}>
              <div className="mb-1 pl-1 text-[13px] text-[var(--color-ghost)]">{categoryLabel(g.category, lang)}</div>
              <ul className="flex flex-col gap-1">
                {g.tracks.map((t) => {
                  const on = t.id === track.id;
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setTrack(t.id)}
                        className="pixel-button flex w-full items-center justify-between gap-2 px-2.5 py-1 text-left text-[13px] leading-5 text-[var(--color-ink)]"
                      >
                        <span className="truncate">{t.label}</span>
                        <span className="font-pixel shrink-0 text-[12px] opacity-60">{t.entries.length}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {hasLegacy && (
            <label className="mt-1 flex cursor-pointer items-center gap-1.5 pl-1 text-[13px] text-[var(--color-ghost)]">
              <input
                type="checkbox"
                checked={showLegacy}
                onChange={(e) => update({ legacy: e.target.checked ? '1' : null })}
                className="accent-[var(--color-gold)]"
              />
              {dict.ui.leaderboard.showLegacy}
            </label>
          )}
        </div>
      </nav>

      <section className="min-w-0 flex-1">
        <header className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-lg leading-tight text-[var(--color-gold)]">
            {track.label}
            {track.selfReported && (
              <span className="ml-2 align-middle text-[13px] text-[var(--color-ghost)]">
                {dict.ui.leaderboard.selfReportBadge}
              </span>
            )}
          </h2>
          <span className="text-[13px] text-[var(--color-ghost)]">
            {dict.ui.leaderboard.entriesInfo(entries.length, Math.max(0, eligible - entries.length))}
          </span>
        </header>
        <p className="mb-3 text-[13px] leading-relaxed text-[var(--color-ghost)]">
          {track.note}
          {track.homepage && (
            <>
              {' '}
              <a
                href={track.homepage}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-parchment)] underline decoration-dotted hover:text-[var(--color-gold)]"
              >
                {dict.ui.leaderboard.homepage}
              </a>
            </>
          )}
        </p>

        <ModelFilters
          value={filter}
          onChange={setFilter}
          vendors={data.vendors}
          models={data.models}
          matched={eligible}
          lang={lang}
        />

        <ol className="pixel-panel-dark mt-3 divide-y divide-white/10 px-3 py-1 sm:px-4">
          {shown.length === 0 && (
            <li className="py-6 text-center text-[14px] text-[var(--color-ghost)]">
              {dict.ui.leaderboard.emptyResult}
            </li>
          )}
          {shown.map((e, i) => (
            <Row
              key={e.m}
              rank={i + 1}
              entry={e}
              data={data}
              lang={lang}
              fraction={barFraction(track, values, e.v)}
              accent={readableOnDark(vendorMap.get(data.models[e.m].vendor)?.accent ?? '#8a8a8a', 0.3)}
            />
          ))}
        </ol>

        {entries.length > DEFAULT_LIMIT && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => update({ all: showAll ? null : '1' })}
              className="pixel-button px-4 py-1.5 text-[13px] text-[var(--color-ink)]"
            >
              {showAll
                ? dict.ui.leaderboard.collapse(DEFAULT_LIMIT)
                : dict.ui.leaderboard.expand(entries.length)}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function Row({
  rank,
  entry,
  data,
  lang,
  fraction,
  accent,
}: {
  rank: number;
  entry: LeanEntry;
  data: ExplorerData;
  lang: Lang;
  fraction: number;
  accent: string;
}) {
  const dict = getDict(lang);
  const model = data.models[entry.m];
  const vendor = data.vendors.find((v) => v.id === model.vendor);
  const url = entry.u != null ? data.urls[entry.u] : null;
  const medal = MEDAL[rank];

  return (
    <li className="flex items-center gap-2 py-1.5 sm:gap-3">
      <span
        className="font-pixel w-7 shrink-0 text-right text-[14px] leading-none"
        style={{ color: medal ?? 'var(--color-ghost)' }}
        aria-label={dict.ui.leaderboard.rankAria(rank)}
      >
        {rank}
      </span>
      <VendorCrest
        motif={vendor?.motif ?? 'wanderer'}
        accentColor={vendor?.accent ?? '#8a8a8a'}
        size={14}
        title={vendorLabel(vendor, lang)}
      />
      <div className="min-w-0 flex-1">
        <Link
          href={langLink(lang, `/model/${model.slug}/`)}
          className="block truncate text-[14px] leading-5 text-[var(--color-parchment)] hover:text-[var(--color-gold)]"
          style={medal && rank === 1 ? { color: 'var(--color-gold)' } : undefined}
        >
          {model.name}
          {model.retired && (
            <span className="ml-1.5 text-[13px] text-[var(--color-ghost)]">{dict.status.retired}</span>
          )}
        </Link>
        <div className="truncate text-[13px] leading-4 text-[var(--color-ghost)]">
          {vendorLabel(vendor, lang) ?? model.vendor}
        </div>
      </div>
      <div className="hidden h-2.5 w-36 shrink-0 bg-black/30 md:block lg:w-44" aria-hidden>
        <div className="h-full" style={{ width: `${12 + fraction * 88}%`, background: accent }} />
      </div>
      <div className="flex w-28 shrink-0 flex-col items-end sm:w-36">
        <span className="text-[14px] leading-5 tabular-nums text-[var(--color-parchment)]">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              title={dict.ui.leaderboard.sourceTitle}
              className="underline decoration-dotted decoration-white/30 hover:text-[var(--color-gold)]"
            >
              {entry.t}
            </a>
          ) : (
            entry.t
          )}
        </span>
        {entry.s && (
          <span
            className="text-[13px] leading-4 text-[var(--color-ghost)]"
            title={dict.ui.leaderboard.selfReportTitle}
          >
            {dict.ui.leaderboard.selfReport}
          </span>
        )}
      </div>
    </li>
  );
}
