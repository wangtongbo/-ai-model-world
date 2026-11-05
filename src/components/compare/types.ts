import type { AptitudeId } from '@/lib/aptitude';
import type { BenchmarkCategory, BenchmarkCategoryInfo } from '@/data/benchmark-registry';
import type { LText } from '@/lib/i18n';
import type { ModelKind } from '@/lib/kind';
import type { Continent, Modality, ScoreUnit } from '@/lib/types';

/**
 * 对比页的数据契约。服务端在构建期由 `src/lib/compare.ts` 生成 `compare-data.json`，
 * 对比页按需拉取。字段刻意压扁、用元组存成绩：600 个模型全量下发，
 * 每省一个键名都是几十 KB。
 */

/**
 * 一个成绩池：同一榜单 + 同一测量方。
 *
 * 对比页只在同一个池里比较两个模型，第三方实测和厂商自报即使是同一套题也分成两行，
 * 与排行榜的分池规则完全一致（`scores.ts` 的 `poolKeyOf`）。
 */
export interface CmpBench {
  /** 池键 `league::attribution` */
  key: string;
  /** 榜名 + 厂商自报后缀，四语言各一份 */
  label: LText;
  category: BenchmarkCategory;
  blurb: LText;
  unit: ScoreUnit;
  higherIsBetter: boolean;
  selfReported: boolean;
  /** 被新版榜单取代，不计入胜负 */
  superseded: boolean;
  priority: number;
  /** 池内最低与最高分，画条用 */
  min: number;
  max: number;
  /** 满分。百分数是 100；Elo、时长这类没有上限的为 null，改按池内区间画条 */
  ceiling: number | null;
  /** 池里一共几个模型，名次写成「#3 / 25」 */
  n: number;
  /** 对应的排行榜赛道 id。池不够 5 人没开榜时为 null */
  track: string | null;
}

/** 一条能力条：`[填充比例, 短标(四语言), 是否厂商自报, 改写后的标签(四语言)]`，缺数据时前两项为 null */
export type CmpApt = [number | null, LText | null, 0 | 1, LText?];

/** 一条成绩：`[池下标, 原始分, 格式化好的文本, 池内名次]` */
export type CmpScore = [number, number, string, number];

export interface CmpModel {
  slug: string;
  name: string;
  vendor: string;
  kind: ModelKind | null;
  date: string | null;
  dateText: LText;
  retired: boolean;
  cutoff: string | null;
  ctx: number | null;
  maxOut: number | null;
  priceIn: number | null;
  priceOut: number | null;
  priceCached: number | null;
  open: boolean | null;
  license: string | null;
  /** 参数量（四语言）。官方未公布时为 null */
  params: LText | null;
  inputs: Modality[];
  outputs: Modality[];
  tool: boolean | null;
  reasoning: boolean | null;
  caching: boolean | null;
  eci: number | null;
  eciRank: number | null;
  apt: Record<AptitudeId, CmpApt>;
  /** 一句话人设，四语言各算一次 */
  persona: LText;
  sprite: boolean;
  /** 体型档位的显示缩放，与广场上的角色一致 */
  scale: number;
  scores: CmpScore[];
}

export interface CmpVendor {
  name: string;
  /** 国际通用名（en/ja/ko 用） */
  nameEn: string;
  motif: string;
  /** 已按深色背景提亮过的厂商色 */
  accent: string;
  continent: Continent;
}

export interface CompareData {
  generatedAt: string;
  /** 分类的 id 与四语言展示名。id 是管线契约（中文取值），展示名查 name[lang] */
  categories: BenchmarkCategoryInfo[];
  vendors: Record<string, CmpVendor>;
  benches: CmpBench[];
  models: CmpModel[];
}
