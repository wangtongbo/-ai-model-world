/**
 * 对比页的数据：构建期把整份快照压成 `compare-data.json`。
 *
 * 为什么不像详情页那样每个组合出一张静态页：组合是 C(600, 2) 起步，
 * 只能在浏览器里现拼。于是服务端把**所有要算全体分布的东西**先算好——
 * 池内名次、能力条分位、人设、体型档——客户端只做挑选与并排，不需要看到全体模型。
 *
 * 成绩按池（榜单 + 测量方）组织，与排行榜同一套 `buildScorePools`，
 * 所以对比页上的「#3 / 25」和排行榜上看到的名次一定一致。
 */

import type { CmpApt, CmpBench, CmpModel, CmpScore, CmpVendor, CompareData } from '@/components/compare/types';
import { BENCHMARK_CATEGORIES, benchmarkDescription, benchmarkName, benchmarkOf, canonicalBenchmarkId } from '@/data/benchmark-registry';
import { continentForCountry, profileFor } from '@/data/vendor-registry';
import { APTITUDES, buildAptitudeScale, type AptitudeId, type AptitudeScale } from './aptitude';
import { attributionFor, loadAttribution } from './attribution';
import { readableOnDark } from './color';
import { buildScales, rankByEci, TIER_SCALE, visualOf } from './derive';
import { formatDate, formatParams } from './format';
import { DEFAULT_LANG, LANGS, type Lang, type LText } from './i18n';
import { libDict } from './i18n/lib-dict';
import { kindOf } from './kind';
import { buildPersonaContext, personaFor } from './persona';
import { buildScorePools, formatLeagueScore, poolKeyOf, rankInPool, trackIdFor } from './scores';
import type { Attribution, WorldSnapshot } from './types';

/** 同一逻辑按四语言各算一遍。zh 的输出与改造前逐字节一致。 */
function perLang(fn: (lang: Lang) => string): LText {
  return Object.fromEntries(LANGS.map((l) => [l, fn(l)])) as LText;
}

export function buildCompareData(snapshot: WorldSnapshot, spriteSlugs: ReadonlySet<string>): CompareData {
  const { models } = snapshot;
  const pools = buildScorePools(models);
  const meta = new Map((snapshot.benchmarks ?? []).map((b) => [canonicalBenchmarkId(b.id), b]));

  const benches: CmpBench[] = [];
  const scoresOf = new Map<string, CmpScore[]>();

  for (const [key, pool] of pools) {
    const [league, attribution] = key.split('::') as [string, Attribution];
    const info = benchmarkOf(league);
    const m = meta.get(league);
    const unit = m?.unit ?? pool[0].score.unit;
    const self = attribution === 'vendor-self-reported';
    const hasThirdParty = (pools.get(poolKeyOf(league, 'third-party'))?.length ?? 0) > 0;
    const values = pool.map((e) => e.score.score);
    const idx = benches.length;
    benches.push({
      key,
      label: perLang((l) =>
        self && hasThirdParty ? benchmarkName(info, l) + libDict[l].insights.selfReportSuffix : benchmarkName(info, l),
      ),
      category: info.category,
      blurb: perLang((l) => benchmarkDescription(info, l)),
      unit,
      higherIsBetter: info.higherIsBetter,
      selfReported: self,
      superseded: m?.supersededBy != null,
      priority: info.priority,
      min: Math.min(...values),
      max: Math.max(...values),
      ceiling: m?.scoreCeiling ?? (unit === 'pct' ? 100 : null),
      n: pool.length,
      track: trackIdFor(pools, league, attribution),
    });
    for (const { model, score } of pool) {
      const list = scoresOf.get(model.id) ?? [];
      list.push([
        idx,
        score.score,
        formatLeagueScore(league, score.score, unit),
        rankInPool(pool, score.score, info.higherIsBetter).rank,
      ]);
      scoresOf.set(model.id, list);
    }
  }

  const attribution = loadAttribution();
  const scales = buildScales(
    models,
    (id) => attributionFor(attribution, id, 'swe_bench_pro')?.attributionType === 'third-party',
  );
  const ranks = rankByEci(models);
  // 能力条按四语言各建一把标尺：分位池一样，只有文案不同
  const aptitudeByLang = Object.fromEntries(
    LANGS.map((l) => [l, buildAptitudeScale(models, l)]),
  ) as Record<Lang, AptitudeScale>;
  const personaCtx = buildPersonaContext(models, snapshot.vendors);
  const vendors = new Map(snapshot.vendors.map((v) => [v.id, v]));
  const now = new Date(snapshot.generatedAt);

  const vendorOut: Record<string, CmpVendor> = {};
  const out: CmpModel[] = models.map((m) => {
    if (!vendorOut[m.vendorId]) {
      const profile = profileFor(m.vendorId);
      const vendor = vendors.get(m.vendorId);
      vendorOut[m.vendorId] = {
        name: vendor?.nameZh ?? profile.nameZh,
        nameEn: profile.nameEn,
        motif: vendor?.motif ?? profile.motif,
        accent: readableOnDark(vendor?.accentColor ?? profile.accentColor),
        continent: vendor?.continent ?? continentForCountry(profile.country),
      };
    }
    const rank = ranks.get(m.id) ?? null;
    const rowsByLang = Object.fromEntries(LANGS.map((l) => [l, aptitudeByLang[l].rowOf(m)])) as Record<
      Lang,
      ReturnType<AptitudeScale['rowOf']>
    >;
    // 能力条的悬停长文不下发：四条乘六百个模型占了整个文件的六成，而对比页下方的表格就是明细
    const apt = Object.fromEntries(
      APTITUDES.map(({ id }) => {
        const zhValue = rowsByLang[DEFAULT_LANG].values[id];
        const lean: CmpApt = [
          zhValue.fill == null ? null : Math.round(zhValue.fill * 1000) / 1000,
          zhValue.literal == null ? null : perLang((l) => rowsByLang[l].values[id].literal ?? zhValue.literal!),
          zhValue.selfReported ? 1 : 0,
        ];
        if (zhValue.labelOverride) {
          lean.push(perLang((l) => rowsByLang[l].values[id].labelOverride ?? zhValue.labelOverride!));
        }
        return [id, lean];
      }),
    ) as Record<AptitudeId, CmpApt>;

    return {
      slug: m.slug,
      name: m.name,
      vendor: m.vendorId,
      kind: kindOf(m),
      date: m.releaseDate,
      dateText: perLang((l) => formatDate(m.releaseDate, m.releaseDatePrecision, l)),
      retired: m.retiredAt != null,
      cutoff: m.knowledgeCutoff,
      ctx: m.contextWindow != null && m.contextWindow > 0 ? m.contextWindow : null,
      maxOut: m.maxOutput != null && m.maxOutput > 0 ? m.maxOutput : null,
      priceIn: m.pricing.inputPerMTok,
      priceOut: m.pricing.outputPerMTok,
      priceCached: m.pricing.cachedInputPerMTok,
      open: m.openWeights,
      license: m.license,
      params: m.params.totalB == null ? null : perLang((l) => formatParams(m, l)),
      inputs: m.modalities.input,
      outputs: m.modalities.output,
      tool: m.capabilities.toolCall,
      reasoning: m.capabilities.reasoning,
      caching: m.capabilities.promptCaching,
      eci: m.benchmarks.eci,
      eciRank: rank,
      apt,
      persona: perLang((l) => personaFor(m, personaCtx, l)),
      sprite: spriteSlugs.has(m.slug),
      scale: TIER_SCALE[visualOf(m, rank, now, scales).size.tier],
      scores: scoresOf.get(m.id) ?? [],
    };
  });

  return {
    generatedAt: snapshot.generatedAt,
    categories: BENCHMARK_CATEGORIES,
    vendors: vendorOut,
    benches,
    models: out,
  };
}
