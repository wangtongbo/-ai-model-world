import { DEFAULT_LANG, getDict, lt, type Lang } from '@/lib/i18n';
import { libDict } from '@/lib/i18n/lib-dict';
import { formatMinutes } from '@/lib/format';
import type { CmpBench, CmpModel, CompareData } from './types';

/**
 * 对比页的全部判断逻辑，纯函数。
 *
 * 胜负只在**同一个成绩池**里判：同榜单、同测量方。一方是第三方实测、另一方是厂商自报的，
 * 即使题目相同也不算交手，分列两行各自「未参赛」。这与全站「跨赛制永不混算」是同一条规则。
 */

export interface H2HCell {
  score: number;
  text: string;
  rank: number;
  /** 条形长度 0–1，已按「越高越好 / 越低越好」翻转 */
  frac: number;
}

export interface H2HRow {
  bench: CmpBench;
  cells: (H2HCell | null)[];
  /** 胜者在 cells 里的下标。全员打平或只有一方参赛时为空 */
  winners: number[];
  /** 有成绩的人数 */
  present: number;
}

/**
 * 分数的显示文本。时长（minutes 量纲）的单位词各语言不同，而 compare-data.json
 * 四语言共用一份、构建期写好的 text 是中文口径，所以按语言现算；
 * 其余量纲（%、Elo、美元、倍率）写法与语言无关，直接用构建期的文本。
 */
export function cellText(bench: CmpBench, cell: H2HCell, lang: Lang): string {
  return bench.unit === 'minutes' ? formatMinutes(cell.score, lang) : cell.text;
}

function barFraction(bench: CmpBench, score: number): number {
  let f: number;
  if (bench.ceiling != null && bench.ceiling > 0 && bench.min >= 0) {
    f = score / bench.ceiling;
  } else if (bench.max === bench.min) {
    f = 1;
  } else {
    // 没有满分的量纲（Elo、时长、美元）按池内区间画，留一截底，最低分也看得见
    f = 0.08 + (0.92 * (score - bench.min)) / (bench.max - bench.min);
  }
  f = Math.min(1, Math.max(0, f));
  return bench.higherIsBetter ? f : 1 - f;
}

export function headToHead(data: CompareData, picked: CmpModel[]): H2HRow[] {
  const byBench = new Map<number, (H2HCell | null)[]>();
  picked.forEach((m, col) => {
    for (const [idx, score, text, rank] of m.scores) {
      let cells = byBench.get(idx);
      if (!cells) {
        cells = picked.map(() => null);
        byBench.set(idx, cells);
      }
      cells[col] = { score, text, rank, frac: barFraction(data.benches[idx], score) };
    }
  });

  const order = new Map(data.categories.map((c, i) => [c.id, i]));
  const rows: H2HRow[] = [];
  for (const [idx, cells] of byBench) {
    const bench = data.benches[idx];
    const present = cells.filter(Boolean).length;
    let winners: number[] = [];
    if (present >= 2) {
      const scores = cells.map((c) => c?.score ?? null);
      const valid = scores.filter((s): s is number => s != null);
      const best = bench.higherIsBetter ? Math.max(...valid) : Math.min(...valid);
      winners = scores.flatMap((s, i) => (s === best ? [i] : []));
      if (winners.length === present) winners = [];
    }
    rows.push({ bench, cells, winners, present });
  }

  return rows.sort(
    (a, b) =>
      (order.get(a.bench.category) ?? 99) - (order.get(b.bench.category) ?? 99) ||
      b.present - a.present ||
      Number(a.bench.superseded) - Number(b.bench.superseded) ||
      a.bench.priority - b.bench.priority ||
      b.bench.n - a.bench.n ||
      // 排序键固定用 zh，保证四种语言页面上的行序一致
      lt(a.bench.label, DEFAULT_LANG).localeCompare(lt(b.bench.label, DEFAULT_LANG)),
  );
}

/** 计入胜负的行：至少两人交手、榜单没被新版取代 */
export function isContested(row: H2HRow): boolean {
  return row.present >= 2 && !row.bench.superseded;
}

export interface Tally {
  wins: number[];
  ties: number;
  contested: number;
}

export function tally(rows: H2HRow[], n: number): Tally {
  const wins = Array.from({ length: n }, () => 0);
  let ties = 0;
  let contested = 0;
  for (const row of rows) {
    if (!isContested(row)) continue;
    contested += 1;
    if (row.winners.length === 0) ties += 1;
    for (const w of row.winners) wins[w] += 1;
  }
  return { wins, ties, contested };
}

// ─── 实用指标：每一行谁占优 ─────────────────────────────────────

export type SpecBetter = 'high' | 'low' | null;

/** 数值型规格行里谁最好。缺数据的不参与；全员一样时没有赢家 */
export function specWinners(values: (number | null)[], better: SpecBetter): number[] {
  if (!better) return [];
  const valid = values.filter((v): v is number => v != null && v > 0);
  if (valid.length < 2) return [];
  const best = better === 'high' ? Math.max(...valid) : Math.min(...valid);
  const winners = values.flatMap((v, i) => (v === best ? [i] : []));
  return winners.length === valid.length ? [] : winners;
}

/** `2026-06` 与 `2026-04-20` 这种不同精度的截止日期，统一折成月份序号来比 */
export function cutoffMonth(cutoff: string | null): number | null {
  if (!cutoff) return null;
  const m = /^(\d{4})(?:-(\d{1,2}))?/.exec(cutoff);
  if (!m) return null;
  return Number(m[1]) * 12 + (m[2] ? Number(m[2]) - 1 : 0);
}

export function cutoffText(cutoff: string | null, lang: Lang = DEFAULT_LANG): string | null {
  const month = cutoffMonth(cutoff);
  if (month == null) return null;
  return getDict(lang).unknown.monthOnly(Math.floor(month / 12), (month % 12) + 1);
}

// ─── 各自的特点 ─────────────────────────────────────────────────

function short(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

function usd(n: number): string {
  return `$${n < 0.1 ? n.toFixed(3) : n < 10 ? +n.toFixed(2) : Math.round(n)}`;
}

export interface Highlight {
  text: string;
  /** 跑分类还是规格类，渲染时前者用奖杯、后者用小方块 */
  kind: 'bench' | 'spec';
}

/**
 * 每个模型相对于其他入选者的长处，全部由数据套模板生成。
 *
 * 跑分只取「赢了、而且赢得明显」的前三项，按池内条形长度的差距排序——
 * 用归一化后的差距而不是原始分差，ALE-Bench 差 800 分和 GPQA 差 2 分才放得到一起比。
 * 规格类的门槛（便宜 15%、长 20%）是为了不把「1M 对 1.05M」这种噪声写成长处。
 */
export function highlightsFor(rows: H2HRow[], picked: CmpModel[], col: number, lang: Lang = DEFAULT_LANG): Highlight[] {
  const d = libDict[lang].insights;
  const me = picked[col];
  const others = picked.filter((_, i) => i !== col);
  if (others.length === 0) return [];
  const duel = others.length === 1;
  const out: Highlight[] = [];

  const benchWins = rows
    .filter((r) => isContested(r) && r.winners.length === 1 && r.winners[0] === col)
    .map((r) => {
      const mine = r.cells[col]!;
      const rest = r.cells.filter((c, i) => c && i !== col) as H2HCell[];
      const runner = rest.reduce((a, b) => (b.frac > a.frac ? b : a));
      return { r, mine, runner, gap: mine.frac - runner.frac };
    })
    .filter((w) => w.gap > 0.005)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);
  for (const w of benchWins) {
    out.push({
      kind: 'bench',
      text: duel
        ? d.benchWinVs(lt(w.r.bench.label, lang), cellText(w.r.bench, w.mine, lang), cellText(w.r.bench, w.runner, lang))
        : d.benchWinFirst(lt(w.r.bench.label, lang), cellText(w.r.bench, w.mine, lang)),
    });
  }

  // 对方没参加的榜不算赢，但在全榜排进前三本身就是长处。新模型刚发布、还没交手时，这往往是唯一的跑分亮点
  if (benchWins.length < 3) {
    const solo = rows
      .filter((r) => {
        const c = r.cells[col];
        return c && r.present === 1 && !r.bench.superseded && r.bench.n >= 10 && c.rank <= 3;
      })
      .sort((a, b) => a.cells[col]!.rank - b.cells[col]!.rank || b.bench.n - a.bench.n)
      .slice(0, 3 - benchWins.length);
    for (const r of solo) {
      const c = r.cells[col]!;
      out.push({ kind: 'bench', text: d.soloRank(lt(r.bench.label, lang), c.rank, cellText(r.bench, c, lang), r.bench.n) });
    }
  }

  const priced = others.filter((o) => o.priceOut != null && o.priceOut > 0);
  if (me.priceOut != null && me.priceOut > 0 && priced.length > 0) {
    const next = Math.min(...priced.map((o) => o.priceOut!));
    if (next >= me.priceOut * 1.15) {
      const off = Math.round((1 - me.priceOut / next) * 100);
      out.push({
        kind: 'spec',
        text: duel ? d.cheaperVs(off, usd(me.priceOut), usd(next)) : d.cheapestSolo(usd(me.priceOut)),
      });
    }
  }

  const ctxOthers = others.filter((o) => o.ctx != null);
  if (me.ctx != null && ctxOthers.length > 0) {
    const next = Math.max(...ctxOthers.map((o) => o.ctx!));
    if (me.ctx >= next * 1.2) {
      out.push({
        kind: 'spec',
        text: duel ? d.longerCtxVs(short(me.ctx), short(next)) : d.longestCtx(short(me.ctx)),
      });
    }
  }

  const outOthers = others.filter((o) => o.maxOut != null);
  if (me.maxOut != null && outOthers.length > 0) {
    const next = Math.max(...outOthers.map((o) => o.maxOut!));
    if (me.maxOut >= next * 1.2) {
      out.push({
        kind: 'spec',
        text: duel ? d.longerOutVs(short(me.maxOut), short(next)) : d.longestOut(short(me.maxOut)),
      });
    }
  }

  const mine = cutoffMonth(me.cutoff);
  const cutOthers = others.map((o) => cutoffMonth(o.cutoff)).filter((v): v is number => v != null);
  if (mine != null && cutOthers.length > 0 && mine > Math.max(...cutOthers)) {
    out.push({
      kind: 'spec',
      text: duel
        ? d.newerCutoffVs(cutoffText(me.cutoff, lang)!, cutoffText(others[0].cutoff, lang)!)
        : d.newestCutoff(cutoffText(me.cutoff, lang)!),
    });
  }

  if (me.open === true && others.some((o) => o.open === false)) {
    out.push({ kind: 'spec', text: d.openWeightsText });
  }

  const extraIn = me.inputs.filter((x) => x !== 'text' && others.some((o) => !o.inputs.includes(x)));
  if (extraIn.length > 0) {
    out.push({ kind: 'spec', text: d.canRead(extraIn.map((x) => d.modality[x] ?? x), duel) });
  }
  const extraOut = me.outputs.filter((x) => x !== 'text' && others.some((o) => !o.outputs.includes(x)));
  if (extraOut.length > 0) {
    out.push({ kind: 'spec', text: d.canGenerate(extraOut.map((x) => d.modality[x] ?? x)) });
  }

  if (me.reasoning === true && others.some((o) => o.reasoning === false)) {
    out.push({ kind: 'spec', text: d.reasoningModeText });
  }

  // 还不满四条时，用只有它有的成绩补上。它们不算「赢」，所以写明出处而不写对比：
  // 刚发布的模型往往只有厂商自己公布的几项，不列出来读者会以为它什么都没测过
  if (out.length < 4) {
    const own = rows
      .filter((r) => r.present === 1 && r.cells[col] && !r.bench.superseded)
      .filter((r) => !out.some((h) => h.text.startsWith(lt(r.bench.label, lang))))
      .sort((a, b) => a.bench.priority - b.bench.priority)
      .slice(0, 4 - out.length);
    for (const r of own) {
      const label = lt(r.bench.label, lang).replace(d.selfReportSuffix, '');
      out.push({
        kind: 'bench',
        text: `${label} ${cellText(r.bench, r.cells[col]!, lang)}${r.bench.selfReported ? d.officialSuffix : ''}`,
      });
    }
  }

  return out.slice(0, 6);
}

// ─── 空状态的推荐对阵 ───────────────────────────────────────────

export interface Preset {
  label: string;
  slugs: string[];
}

/** 推荐对阵，全部从当前快照现算：数据一更新，推荐跟着换人 */
export function presetsOf(data: CompareData, lang: Lang = DEFAULT_LANG): Preset[] {
  const d = libDict[lang].insights;
  const alive = data.models.filter((m) => !m.retired && m.eciRank != null);
  const byRank = [...alive].sort((a, b) => a.eciRank! - b.eciRank!);
  const first = (pred: (m: CmpModel) => boolean) => byRank.find(pred);
  const out: Preset[] = [];

  if (byRank.length >= 2) out.push({ label: d.presetTop2, slugs: [byRank[0].slug, byRank[1].slug] });

  const west = first((m) => data.vendors[m.vendor]?.continent === 'west');
  const east = first((m) => data.vendors[m.vendor]?.continent === 'east');
  if (west && east) out.push({ label: d.presetEastWest, slugs: [west.slug, east.slug] });

  const closed = first((m) => m.open === false);
  const open = first((m) => m.open === true);
  if (closed && open) out.push({ label: d.presetOpenClosed, slugs: [closed.slug, open.slug] });

  // 最近 30 天发布、来自不同厂商的两个大杯：新模型刚发布时最常被问的就是这一对
  const latest = [...data.models]
    .filter((m) => !m.retired && m.date && m.priceOut != null && m.priceOut > 0 && m.kind !== null)
    .sort((a, b) => (b.date! > a.date! ? 1 : b.date! < a.date! ? -1 : b.priceOut! - a.priceOut!));
  const newest: CmpModel[] = [];
  for (const m of latest) {
    if (newest.some((n) => n.vendor === m.vendor)) continue;
    newest.push(m);
    if (newest.length === 2) break;
  }
  if (newest.length === 2) out.push({ label: d.presetNewest, slugs: newest.map((m) => m.slug) });

  return out;
}
