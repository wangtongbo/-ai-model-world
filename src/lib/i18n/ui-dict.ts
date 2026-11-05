/**
 * 组件层字典：components 里抽出的所有界面文案。
 *
 * 规则（docs/I18N.md）：
 * - 新增 key 必须四语言一次写全——`Record<Lang, UiDict>` 让漏译直接编译报错。
 * - zh 一律用改造前的原文逐字复制，中文版渲染输出逐字节不变。
 * - 语序不同的语言用字典函数拼句子，调用方只传参数，不在外面拼字符串。
 * - 榜单名、厂商名各语言统一用英文原名（见 data 层注册表），这里不译。
 */

import type { Lang } from './types';

export interface UiDict {
  /** 全站搜索框（GlobalSearch） */
  search: {
    placeholder: string;
    ariaLabel: string;
    loading: string;
    /** 防抖未到点时显示的中间态。不能显示「没有匹配」。 */
    searching: string;
    /** 无结果文案（后半接 noResultLink 与 noResultEnd） */
    noResult: string;
    noResultLink: string;
    noResultEnd: string;
    /** 能力概念行的数量尾标 */
    tailCount: (n: number) => string;
    /** 赛道快捷入口的尾标 */
    tailTrack: string;
    groupAbility: string;
    groupVendors: string;
    groupModels: string;
    /** 厂商行副标题：zh「国内厂商」 */
    vendorNote: (continent: string) => string;
    /** 厂商行尾标：zh「42 个模型」 */
    vendorTail: (n: number) => string;
    /** 模型行副标题：zh「智谱 · 多模态 · 已退役」 */
    modelNote: (vendor: string, kind: string, retired: string | null) => string;
    /** 模型行尾标：zh「智力 #3」 */
    modelRank: (rank: number) => string;
    /** 底部「去总表看全部」 */
    allMatches: (total: number) => string;
  };

  /** 四条能力横条（AbilityBars） */
  ability: {
    /** 短标缺失时的占位：zh「暂无」 */
    none: string;
    /** 厂商自报徽标 */
    selfReported: string;
  };

  /** 名牌下的硬指标行（StatRow） */
  statRow: {
    eye: string;
    ear: string;
    brush: string;
    tool: string;
    think: string;
    key: string;
    ctxTitle: (tokens: string) => string;
    ctxUnknown: string;
    priceTitle: (usd: string) => string;
    priceUnknown: string;
  };

  /** 角色房间（ModelRoom） */
  room: {
    /** 编程成绩的赛制说明，键与 derive.ts 的 SweLeague 一致 */
    sweLeague: Record<'epoch' | 'vendor' | 'pro-scale' | 'pro-vendor', string>;
    /** 电脑悬停：score 已带百分号，如「73.4%」 */
    computerTitle: (score: string, leagueName: string) => string;
    /** 无编程成绩时的悬停。noData 传 core 字典的 unknown.noData */
    computerMissing: (noData: string) => string;
    /** 书架悬停：zh「上下文 1000000」 */
    contextTitle: (ctx: string) => string;
    /** 上下文未知时的占位词 */
    unknownValue: string;
  };

  /** 广场「本家更新」便条（Plaza NewerNote） */
  plaza: {
    unknownDate: string;
  };

  /** 同系列历代时间轴（LineageStrip） */
  lineage: {
    dateUnknown: string;
    ruleHint: (kindLabel: string) => string;
    heading: (stem: string, kindLabel: string) => string;
    totalWindowed: (total: number, shown: number) => string;
    totalAll: (total: number) => string;
    vendorAll: (vendorName: string) => string;
  };

  /** 编程战绩表（CodingLedger）与测量方悬停（ScoreLedger 共用） */
  ledger: {
    empty1: string;
    empty2: string;
    thirdPartyHint: string;
    selfReportHint: string;
    /** 末尾「不可比」说明，中间一段是加粗的 */
    footnotePre: string;
    footnoteStrong: string;
    footnotePost: string;
  };

  /** 全部成绩表（ScoreLedger） */
  scoreLedger: {
    title: string;
    blurb: string;
    rankOf: (rank: number, total: number) => string;
    trackLinkTitle: string;
  };

  /** 非中文版简化页脚（SiteFooter） */
  footer: {
    /** 站长署名，四种语言都保持中文名不译 */
    authorName: string;
  };

  /** 筛选条（ModelFilters） */
  filters: {
    search: string;
    searchPlaceholder: string;
    searchAria: string;
    all: string;
    region: string;
    weights: string;
    open: string;
    closed: string;
    year: string;
    yearAny: string;
    yearAria: string;
    vendor: string;
    /** 厂商多选按钮上的计数括注：zh「（3）」 */
    vendorCount: (n: number) => string;
    clearVendors: string;
    includeRetired: string;
    matched: (n: number) => string;
    clear: string;
  };

  /** 排行榜（LeaderboardExplorer）与赛道名的本地化（serialize） */
  leaderboard: {
    noTracks: string;
    navAria: string;
    selectTrack: string;
    /** 赛道下拉选项：zh「综合智力（194）」 */
    trackOption: (label: string, count: number) => string;
    showLegacy: string;
    selfReportBadge: string;
    entriesInfo: (entered: number, rest: number) => string;
    homepage: string;
    emptyResult: string;
    rankAria: (rank: number) => string;
    sourceTitle: string;
    selfReportTitle: string;
    selfReport: string;
    collapse: (limit: number) => string;
    expand: (total: number) => string;
    /** 派生赛道的分组名：zh「实用指标」 */
    categoryPractical: string;
    /** 厂商自报赛道的口径说明（serialize 在非中文版拼接） */
    selfReportTrackNote: string;
    /** 四条派生赛道的名称与说明，键与 scores.ts 的 derivedTracks 一致 */
    derived: Record<'value' | 'context' | 'cheapest' | 'newest', { label: string; note: string }>;
  };

  /** 全部模型总表（AllModelsTable） */
  allTable: {
    col: {
      model: string;
      vendor: string;
      region: string;
      date: string;
      open: string;
      ctx: string;
      price: string;
      eci: string;
      code: string;
      n: string;
    };
    open: string;
    closed: string;
    empty: string;
    eciTitle: (eci: string, rank: number | null) => string;
    collapse: (limit: number) => string;
    expand: (total: number) => string;
  };

  /** 对比页（CompareView） */
  compare: {
    title: string;
    addMore: string;
    noContested: string;
    contestedCount: (n: number) => string;
    ties: (n: number) => string;
    loadFailed: string;
    loading: string;
    emptyHint: string;
    /** 推荐对阵里两个名字之间的连接：zh「 对 」 */
    joinNames: (names: string[]) => string;
    remove: string;
    removeAria: (name: string) => string;
    eciRank: (rank: number) => string;
    eciNoRank: string;
    /** 比分行的前缀词：两人对阵「胜」、多人对阵「第一」，后面接数字与 itemsUnit */
    winsLead: (duel: boolean) => string;
    itemsUnit: string;
    highlightsTitle: string;
    noHighlights: string;
    aptLabel: string;
    aptHint: string;
    specsTitle: string;
    scoresTitle: string;
    sameBoth: string;
    sameAll: string;
    noValue: string;
    scopeGroup: string;
    scopeCommon: (n: number) => string;
    scopeAll: (n: number) => string;
    noScores: (single: boolean) => string;
    lowerBetter: string;
    legacy: string;
    selfReport: string;
    notEntered: string;
    notPublished: string;
    rankTitle: (poolSize: number, rank: number) => string;
    footnote: (date: string) => string;
    /** 规格行标签 */
    spec: {
      releaseDate: string;
      kind: string;
      ctx: string;
      maxOut: string;
      priceIn: string;
      priceOut: string;
      priceCached: string;
      cutoff: string;
      inputs: string;
      outputs: string;
      reasoning: string;
      tool: string;
      open: string;
      params: string;
    };
    /** 「各家一样」合并行里的价格短标签 */
    specShort: {
      priceIn: string;
      priceOut: string;
      priceCached: string;
    };
    /** 类型规格：zh「文本模型」 */
    kindModel: (kindLabel: string) => string;
    free: string;
    open: string;
    closed: string;
    supported: string;
    unsupported: string;
    paramsUnknown: string;
  };

  /** 对比页「添加模型」输入框（ModelPicker） */
  picker: {
    placeholder: string;
    placeholderFull: string;
    ariaLabel: string;
    listAria: string;
    noMatch: string;
  };

  /** 详情页「加入对比」按钮（CompareButton） */
  compareButton: {
    add: string;
    withOthers: (n: number) => string;
  };

  /** 语言切换器（LangSwitcher） */
  langSwitcher: {
    label: string;
  };
}

const zh: UiDict = {
  search: {
    placeholder: '搜模型、厂商、多模态…',
    ariaLabel: '搜索模型、厂商或能力',
    loading: '正在载入索引…',
    searching: '搜索中…',
    noResult: '没有匹配的模型、厂商或能力。试试「多模态」「开源」「国内」，或者直接',
    noResultLink: '去总表搜',
    noResultEnd: '。',
    tailCount: (n) => `${n} 个`,
    tailTrack: '看榜单',
    groupAbility: '按能力找',
    groupVendors: '厂商',
    groupModels: '模型',
    vendorNote: (continent) => `${continent}厂商`,
    vendorTail: (n) => `${n} 个模型`,
    modelNote: (vendor, kind, retired) => `${vendor} · ${kind}${retired ? ` · ${retired}` : ''}`,
    modelRank: (rank) => `智力 #${rank}`,
    allMatches: (total) => `在总表里看全部 ${total} 个匹配 →`,
  },

  ability: {
    none: '暂无',
    selfReported: '自报',
  },

  statRow: {
    eye: '能看图',
    ear: '能听声',
    brush: '能画图',
    tool: '会用工具',
    think: '会深思',
    key: '开源权重',
    ctxTitle: (tokens) => `上下文窗口 ${tokens} tokens`,
    ctxUnknown: '上下文窗口未知',
    priceTitle: (usd) => `输出 ${usd} 美元每百万 tokens`,
    priceUnknown: '无公开报价',
  },

  room: {
    sweLeague: {
      epoch: 'SWE-bench Verified · Epoch AI 统一复跑',
      vendor: 'SWE-bench Verified · 厂商自报，未经第三方复核',
      'pro-scale': 'SWE-Bench Pro · Scale AI 官方榜',
      'pro-vendor': 'SWE-Bench Pro · 厂商系统卡自评，未经第三方复核',
    },
    computerTitle: (score, leagueName) =>
      `编程能力 ${score}\n${leagueName}\n档位按同赛制内的分位计算，跨赛制分数不可比`,
    computerMissing: (noData) => `编程能力${noData}：没有查到公开的编程评测成绩。不知道不等于不会。`,
    contextTitle: (ctx) => `上下文 ${ctx}`,
    unknownValue: '未知',
  },

  plaza: {
    unknownDate: '未知日期',
  },

  lineage: {
    dateUnknown: '日期不详',
    ruleHint: (kindLabel) =>
      `同一厂商、名字里第一个数字之前那一段相同、且同为${kindLabel}模型的，算作一个系列`,
    heading: (stem, kindLabel) => `${stem} 系列的${kindLabel}模型 · 按发布时间`,
    totalWindowed: (total, shown) => `共 ${total} 个 · 这里是相邻的 ${shown} 个 · `,
    totalAll: (total) => `共 ${total} 个 · `,
    vendorAll: (vendorName) => `${vendorName}的全部模型 →`,
  },

  ledger: {
    empty1: '没有查到这个模型的任何公开编程评测成绩。',
    empty2: '这表示「没人公开测过它」，不表示「它不会写代码」——本站不会用估算值填补空缺。',
    thirdPartyHint: '由榜单方或独立第三方测出并公布',
    selfReportHint: '由厂商在自家系统卡或发布博客里公布，没有经过独立复核',
    footnotePre: '这些分数',
    footnoteStrong: '不可互相比较',
    // 原文在 JSX 里折了两行，换行折叠成一个空格，这里照原样保留那两个空格
    footnotePost:
      '。同一个模型换一套评测脚手架就能差二三十分： SWE-bench Verified 的中位数是 75.7，而难度更高的 SWE-Bench Pro 只有 41.0。 广场上的能力条因此显示的是「在同一把尺子下排第几」，而不是分数本身。',
  },

  scoreLedger: {
    title: '全部成绩（按榜单分列）',
    blurb: '名次的分母是在同一个榜、由同一类测量方测过的模型数，不是全站模型数。不同榜的分数不可互相比较。',
    rankOf: (rank, total) => `第 ${rank} / ${total}`,
    trackLinkTitle: '去排行榜看这个榜的完整名单',
  },

  footer: {
    authorName: '程序员鱼皮',
  },

  filters: {
    search: '搜索',
    searchPlaceholder: '模型名或厂商',
    searchAria: '按模型名或厂商名搜索',
    all: '全部',
    region: '地区',
    weights: '开放',
    open: '开源',
    closed: '闭源',
    year: '年份',
    yearAny: '不限',
    yearAria: '按发布年份筛选',
    vendor: '厂商',
    vendorCount: (n) => `（${n}）`,
    clearVendors: '清空厂商',
    includeRetired: '含已退役',
    matched: (n) => `${n} 个模型符合`,
    clear: '清空筛选',
  },

  leaderboard: {
    noTracks: '快照里还没有任何够 5 个模型的榜单，暂时开不了榜。',
    navAria: '赛道',
    selectTrack: '选择赛道',
    trackOption: (label, count) => `${label}（${count}）`,
    showLegacy: '显示旧版榜单',
    selfReportBadge: '厂商自报',
    entriesInfo: (entered, rest) => `${entered} 位上榜 · 其余 ${rest} 位未参赛`,
    homepage: '榜单主页 ↗',
    emptyResult:
      '当前筛选条件下没有模型在这条赛道上有成绩。未参赛不等于做不到——本站不会用估算值填空。',
    rankAria: (rank) => `第 ${rank} 名`,
    sourceTitle: '查看出处',
    selfReportTitle: '厂商自己公布的成绩，未经独立复核',
    selfReport: '自报',
    collapse: (limit) => `只看前 ${limit} 名`,
    expand: (total) => `展开全部 ${total} 位`,
    categoryPractical: '实用指标',
    selfReportTrackNote: '这条赛道里的分数全部由厂商自己公布，未经独立复核，只在自报的成绩之间比较。',
    derived: {
      value: {
        label: '性价比',
        note: '智力分位减去价格分位：只有「比同价位的更聪明」或「比同智力的更便宜」才拿得到高分。不是智力除以价格——那种算法会把冠军颁给最便宜的老模型。',
      },
      context: {
        label: '上下文窗口',
        note: '一次能读进去多少 tokens，越大越能一口气啃完长文档。注意这是厂商标称的上限，实际记不记得住见「长文本记忆」榜。',
      },
      cheapest: {
        label: '最便宜',
        note: '输出每百万 tokens 的价格，越靠前越便宜。只比较输出文字的模型——按张、按分钟计费的图像与语音模型折算成 token 价会得到假的 $0。',
      },
      newest: {
        label: '最新发布',
        note: '按发布日期从新到旧。发布日期取多个上游源的最早值，只精确到月的照实写到月。',
      },
    },
  },

  allTable: {
    col: {
      model: '模型',
      vendor: '厂商',
      region: '地区',
      date: '发布',
      open: '开源',
      ctx: '上下文',
      price: '输出价格',
      eci: '综合智力',
      code: '编程',
      n: '参赛榜数',
    },
    open: '开源',
    closed: '闭源',
    empty: '没有符合条件的模型。',
    eciTitle: (eci, rank) => `Epoch Capabilities Index ${eci}，全球第 ${rank} 名`,
    collapse: (limit) => `只看前 ${limit} 个`,
    expand: (total) => `展开全部 ${total} 个`,
  },

  compare: {
    title: '模型对比',
    addMore: '再添加一个模型开始对比',
    noContested: '还没有共同参加的评测',
    contestedCount: (n) => `跑分交手 ${n} 项`,
    ties: (n) => `打平 ${n} 项`,
    loadFailed: '对比数据没有加载成功，刷新一下试试。',
    loading: '正在载入模型数据…',
    emptyHint: '在右上角挑两个模型，或者从这几场开始：',
    joinNames: (names) => names.join(' 对 '),
    remove: '移除',
    removeAria: (name) => `移除 ${name}`,
    eciRank: (rank) => `综合智力第 ${rank} 名`,
    eciNoRank: '综合智力暂无排名',
    winsLead: (duel) => (duel ? '胜' : '第一'),
    itemsUnit: '项',
    highlightsTitle: '各自亮点',
    noHighlights: '暂无明显亮点',
    aptLabel: '能力分位',
    aptHint:
      '在全部模型里的分位：聪明取综合智力，编程取最可信的一项编程评测，记性是上下文窗口，便宜是输出价',
    specsTitle: '基本信息',
    scoresTitle: '评测跑分',
    sameBoth: '两者一样',
    sameAll: '都一样',
    noValue: '暂无',
    scopeGroup: '显示范围',
    scopeCommon: (n) => `共同参加 ${n}`,
    scopeAll: (n) => `全部 ${n}`,
    noScores: (single) =>
      `${single ? '这个模型' : '这几个模型'}还没有公开的第三方评测成绩，新模型一般要一到两周才会被测到。`,
    lowerBetter: '越低越好',
    legacy: '旧版',
    selfReport: '自报',
    notEntered: '未参赛',
    notPublished: '未公布',
    rankTitle: (poolSize, rank) => `在这个榜的 ${poolSize} 个模型里排第 ${rank}`,
    // 原文在 JSX 里折了两行，换行折叠成一个空格，这里照原样保留那两个空格
    footnote: (date) =>
      `数据截至 ${date}。跑分来自 Epoch AI、LiveBench、LMArena 官方数据集等第三方公开评测， 标「自报」的是厂商在官网发布文里公布的成绩，未经第三方复核。只在同一榜单、同一测量方之间比较； 「#3/25」是在该榜全部模型里的名次。`,
    spec: {
      releaseDate: '发布日期',
      kind: '类型',
      ctx: '上下文窗口',
      maxOut: '单次最多输出',
      priceIn: '输入价 / 百万 tokens',
      priceOut: '输出价 / 百万 tokens',
      priceCached: '缓存命中价',
      cutoff: '知识截止',
      inputs: '能读',
      outputs: '能生成',
      reasoning: '深度思考',
      tool: '工具调用',
      open: '开源权重',
      params: '参数量',
    },
    specShort: {
      priceIn: '输入价',
      priceOut: '输出价',
      priceCached: '缓存命中价',
    },
    kindModel: (kindLabel) => `${kindLabel}模型`,
    free: '免费',
    open: '开源',
    closed: '闭源',
    supported: '支持',
    unsupported: '不支持',
    paramsUnknown: '未公布',
  },

  picker: {
    placeholder: '添加模型，如 Claude、GPT、DeepSeek',
    placeholderFull: '最多同时对比 4 个模型',
    ariaLabel: '添加要对比的模型',
    listAria: '匹配的模型',
    noMatch: '没有匹配的模型',
  },

  compareButton: {
    add: '加入对比',
    withOthers: (n) => `和已选的 ${n} 个对比`,
  },

  langSwitcher: {
    label: '语言',
  },
};

const en: UiDict = {
  search: {
    placeholder: 'Search models, vendors, multimodal…',
    ariaLabel: 'Search models, vendors, or capabilities',
    loading: 'Loading index…',
    searching: 'Searching…',
    noResult: 'No matching model, vendor, or capability. Try "multimodal", "open", "Global", or just',
    noResultLink: 'search the full table',
    noResultEnd: '.',
    tailCount: (n) => `${n}`,
    tailTrack: 'View board',
    groupAbility: 'By capability',
    groupVendors: 'Vendors',
    groupModels: 'Models',
    vendorNote: (continent) => `${continent} vendor`,
    vendorTail: (n) => `${n} models`,
    modelNote: (vendor, kind, retired) => `${vendor} · ${kind}${retired ? ` · ${retired}` : ''}`,
    modelRank: (rank) => `Intelligence #${rank}`,
    allMatches: (total) => `See all ${total} matches in the full table →`,
  },

  ability: {
    none: 'N/A',
    selfReported: 'self-reported',
  },

  statRow: {
    eye: 'Sees images',
    ear: 'Hears audio',
    brush: 'Generates images',
    tool: 'Uses tools',
    think: 'Deep thinker',
    key: 'Open weights',
    ctxTitle: (tokens) => `Context window ${tokens} tokens`,
    ctxUnknown: 'Context window unknown',
    priceTitle: (usd) => `Output $${usd} per million tokens`,
    priceUnknown: 'No public pricing',
  },

  room: {
    sweLeague: {
      epoch: 'SWE-bench Verified · re-run by Epoch AI',
      vendor: 'SWE-bench Verified · vendor-reported, not independently verified',
      'pro-scale': 'SWE-Bench Pro · official Scale AI leaderboard',
      'pro-vendor': 'SWE-Bench Pro · vendor system-card self-evaluation, not independently verified',
    },
    computerTitle: (score, leagueName) =>
      `Coding ability ${score}\n${leagueName}\nTiers are percentiles within the same league; scores are not comparable across leagues`,
    computerMissing: () =>
      'Coding ability: no data — no public coding benchmark scores found. Unknown does not mean incapable.',
    contextTitle: (ctx) => `Context ${ctx}`,
    unknownValue: 'unknown',
  },

  plaza: {
    unknownDate: 'unknown date',
  },

  lineage: {
    dateUnknown: 'Date unknown',
    ruleHint: (kindLabel) =>
      `Models from the same vendor, sharing the name prefix before the first number, and all ${kindLabel}, count as one series`,
    heading: (stem, kindLabel) => `${stem} series ${kindLabel} models · by release date`,
    totalWindowed: (total, shown) => `${total} in total · showing ${shown} adjacent ones · `,
    totalAll: (total) => `${total} in total · `,
    vendorAll: (vendorName) => `All ${vendorName} models →`,
  },

  ledger: {
    empty1: 'No public coding benchmark scores found for this model.',
    empty2: 'It means "no one has publicly tested it", not "it cannot code" — this site never fills gaps with estimates.',
    thirdPartyHint: 'Measured and published by the benchmark owner or an independent third party',
    selfReportHint: 'Published by the vendor in its own system card or launch post, without independent verification',
    footnotePre: 'These scores are ',
    footnoteStrong: 'not comparable',
    footnotePost:
      '. The same model can differ by 20–30 points under a different evaluation harness: the median on SWE-bench Verified is 75.7, while the much harder SWE-Bench Pro sits at 41.0. That is why the plaza ability bars show rank within the same yardstick, not the raw score.',
  },

  scoreLedger: {
    title: 'All scores (by benchmark)',
    blurb:
      'The rank denominator is the number of models measured on the same benchmark by the same kind of measurer, not all models on the site. Scores across benchmarks are not comparable.',
    rankOf: (rank, total) => `#${rank} / ${total}`,
    trackLinkTitle: 'See the full leaderboard for this benchmark',
  },

  footer: {
    authorName: 'yupi',
  },

  filters: {
    search: 'Search',
    searchPlaceholder: 'Model or vendor',
    searchAria: 'Search by model or vendor name',
    all: 'All',
    region: 'Region',
    weights: 'Openness',
    open: 'Open',
    closed: 'Closed',
    year: 'Year',
    yearAny: 'Any',
    yearAria: 'Filter by release year',
    vendor: 'Vendor',
    vendorCount: (n) => ` (${n})`,
    clearVendors: 'Clear vendors',
    includeRetired: 'Include retired',
    matched: (n) => `${n} models match`,
    clear: 'Clear filters',
  },

  leaderboard: {
    noTracks: 'No benchmark has at least 5 models in this snapshot yet, so no leaderboard can be opened.',
    navAria: 'Tracks',
    selectTrack: 'Choose a track',
    trackOption: (label, count) => `${label} (${count})`,
    showLegacy: 'Show legacy benchmarks',
    selfReportBadge: 'Vendor-reported',
    entriesInfo: (entered, rest) => `${entered} ranked · ${rest} not entered`,
    homepage: 'Benchmark homepage ↗',
    emptyResult:
      'No model has a score on this track under the current filters. Not entering does not mean incapable — this site never fills gaps with estimates.',
    rankAria: (rank) => `Rank ${rank}`,
    sourceTitle: 'View source',
    selfReportTitle: 'Score published by the vendor itself, not independently verified',
    selfReport: 'self-reported',
    collapse: (limit) => `Show top ${limit} only`,
    expand: (total) => `Show all ${total}`,
    categoryPractical: 'Practical',
    selfReportTrackNote:
      'All scores on this track are published by vendors themselves, without independent verification; comparisons are only among vendor-reported scores.',
    derived: {
      value: {
        label: 'Value',
        note: 'Intelligence percentile minus price percentile: only models smarter than their price tier, or cheaper than their intelligence tier, score high. It is not intelligence divided by price — that would crown the cheapest old model.',
      },
      context: {
        label: 'Context window',
        note: 'How many tokens can be read at once; bigger windows handle long documents in one go. Note this is the vendor-claimed ceiling — for actual retention see the long-context benchmarks.',
      },
      cheapest: {
        label: 'Cheapest',
        note: 'Output price per million tokens; earlier is cheaper. Only text-output models are compared — converting per-image or per-minute pricing of image and speech models into token prices would produce fake $0s.',
      },
      newest: {
        label: 'Newest',
        note: 'Sorted by release date, newest first. Release dates use the earliest value across upstream sources; those known only to the month are shown as such.',
      },
    },
  },

  allTable: {
    col: {
      model: 'Model',
      vendor: 'Vendor',
      region: 'Region',
      date: 'Released',
      open: 'Open',
      ctx: 'Context',
      price: 'Output price',
      eci: 'Intelligence',
      code: 'Coding',
      n: 'Benchmarks',
    },
    open: 'Open',
    closed: 'Closed',
    empty: 'No models match the current filters.',
    eciTitle: (eci, rank) => `Epoch Capabilities Index ${eci}, global #${rank}`,
    collapse: (limit) => `Show top ${limit} only`,
    expand: (total) => `Show all ${total}`,
  },

  compare: {
    title: 'Model Compare',
    addMore: 'Add another model to start comparing',
    noContested: 'No shared benchmarks yet',
    contestedCount: (n) => `${n} head-to-head benchmarks`,
    ties: (n) => `${n} ties`,
    loadFailed: 'Failed to load compare data. Try refreshing.',
    loading: 'Loading model data…',
    emptyHint: 'Pick two models in the top right, or start with one of these matchups:',
    joinNames: (names) => names.join(' vs '),
    remove: 'Remove',
    removeAria: (name) => `Remove ${name}`,
    eciRank: (rank) => `Intelligence #${rank}`,
    eciNoRank: 'No intelligence ranking yet',
    winsLead: (duel) => (duel ? 'won' : '1st of'),
    itemsUnit: '',
    highlightsTitle: 'Highlights',
    noHighlights: 'No clear highlights yet',
    aptLabel: 'Ability percentiles',
    aptHint:
      'Percentile among all models: Smart uses the intelligence index, Coding uses the most credible coding benchmark, Memory is context window, Cheap is output price',
    specsTitle: 'Specs',
    scoresTitle: 'Benchmark scores',
    sameBoth: 'Same for both',
    sameAll: 'Same for all',
    noValue: 'N/A',
    scopeGroup: 'Scope',
    scopeCommon: (n) => `Shared ${n}`,
    scopeAll: (n) => `All ${n}`,
    noScores: (single) =>
      single
        ? 'This model has no public third-party benchmark scores yet; new models usually get tested within a week or two.'
        : 'These models have no public third-party benchmark scores yet; new models usually get tested within a week or two.',
    lowerBetter: 'lower is better',
    legacy: 'legacy',
    selfReport: 'self-reported',
    notEntered: 'Not entered',
    notPublished: 'Not published',
    rankTitle: (poolSize, rank) => `Rank ${rank} among the ${poolSize} models on this benchmark`,
    footnote: (date) =>
      `Data as of ${date}. Scores come from public third-party benchmarks such as Epoch AI, LiveBench, and the official LMArena dataset. Scores marked "self-reported" were published by vendors in their launch posts and are not independently verified. Comparisons only happen within the same benchmark and the same measurer; "#3/25" is the rank among all models on that benchmark.`,
    spec: {
      releaseDate: 'Release date',
      kind: 'Type',
      ctx: 'Context window',
      maxOut: 'Max output',
      priceIn: 'Input price / 1M tokens',
      priceOut: 'Output price / 1M tokens',
      priceCached: 'Cached input price',
      cutoff: 'Knowledge cutoff',
      inputs: 'Can read',
      outputs: 'Can generate',
      reasoning: 'Reasoning',
      tool: 'Tool calling',
      open: 'Open weights',
      params: 'Parameters',
    },
    specShort: {
      priceIn: 'Input price',
      priceOut: 'Output price',
      priceCached: 'Cached input price',
    },
    kindModel: (kindLabel) => `${kindLabel} model`,
    free: 'Free',
    open: 'Open',
    closed: 'Closed',
    supported: 'Yes',
    unsupported: 'No',
    paramsUnknown: 'Not disclosed',
  },

  picker: {
    placeholder: 'Add a model, e.g. Claude, GPT, DeepSeek',
    placeholderFull: 'Compare up to 4 models at once',
    ariaLabel: 'Add a model to compare',
    listAria: 'Matching models',
    noMatch: 'No matching models',
  },

  compareButton: {
    add: 'Add to compare',
    withOthers: (n) => `Compare with ${n} selected`,
  },

  langSwitcher: {
    label: 'Language',
  },
};

const ja: UiDict = {
  search: {
    placeholder: 'モデル・企業・マルチモーダルを検索…',
    ariaLabel: 'モデル・企業・能力を検索',
    loading: 'インデックスを読み込み中…',
    searching: '検索中…',
    noResult: '一致するモデル・企業・能力がありません。「マルチモーダル」「オープン」「中国」などを試すか、直接',
    noResultLink: '一覧で検索',
    noResultEnd: '。',
    tailCount: (n) => `${n}件`,
    tailTrack: 'ランキングへ',
    groupAbility: '能力で探す',
    groupVendors: '企業',
    groupModels: 'モデル',
    vendorNote: (continent) => `${continent}の企業`,
    vendorTail: (n) => `${n}モデル`,
    modelNote: (vendor, kind, retired) => `${vendor} · ${kind}${retired ? ` · ${retired}` : ''}`,
    modelRank: (rank) => `知能 #${rank}`,
    allMatches: (total) => `一致した${total}件を一覧で見る →`,
  },

  ability: {
    none: 'なし',
    selfReported: '自己申告',
  },

  statRow: {
    eye: '画像が見える',
    ear: '音が聞こえる',
    brush: '絵が描ける',
    tool: 'ツールが使える',
    think: '熟考できる',
    key: 'オープンウェイト',
    ctxTitle: (tokens) => `コンテキストウィンドウ ${tokens} tokens`,
    ctxUnknown: 'コンテキストウィンドウ不明',
    priceTitle: (usd) => `出力 ${usd}ドル / 100万トークン`,
    priceUnknown: '公表価格なし',
  },

  room: {
    sweLeague: {
      epoch: 'SWE-bench Verified · Epoch AI 統一再実行',
      vendor: 'SWE-bench Verified · ベンダー自己申告、第三者検証なし',
      'pro-scale': 'SWE-Bench Pro · Scale AI 公式リーダーボード',
      'pro-vendor': 'SWE-Bench Pro · ベンダーのシステムカード自己評価、第三者検証なし',
    },
    computerTitle: (score, leagueName) =>
      `コーディング能力 ${score}\n${leagueName}\n段階は同じリーグ内のパーセンタイル。リーグ間の点数比較は不可`,
    computerMissing: () =>
      'コーディング能力：データなし。公開されたコーディング評価が見つからない。不明は「できない」という意味ではない。',
    contextTitle: (ctx) => `コンテキスト ${ctx}`,
    unknownValue: '不明',
  },

  plaza: {
    unknownDate: '日付不明',
  },

  lineage: {
    dateUnknown: '日付不明',
    ruleHint: (kindLabel) =>
      `同じ企業で、名前の最初の数字より前の部分が同じ、かつ同じく${kindLabel}モデルのものを1つのシリーズとみなす`,
    heading: (stem, kindLabel) => `${stem} シリーズの${kindLabel}モデル · リリース順`,
    totalWindowed: (total, shown) => `全${total}件 · 前後の${shown}件を表示 · `,
    totalAll: (total) => `全${total}件 · `,
    vendorAll: (vendorName) => `${vendorName}の全モデル →`,
  },

  ledger: {
    empty1: 'このモデルの公開されたコーディング評価は見つかっていない。',
    empty2: 'これは「公開テストされたことがない」という意味で、「コードが書けない」という意味ではない——本サイトは推定値で空白を埋めない。',
    thirdPartyHint: 'ベンチマーク運営または独立した第三者が測定・公表',
    selfReportHint: 'ベンダーが自社のシステムカードや発表記事で公表したもので、独立した検証はない',
    footnotePre: 'これらの点数は',
    footnoteStrong: '相互比較できない',
    footnotePost:
      '。同じモデルでも評価ハーネスが変われば20〜30点変わる。SWE-bench Verifiedの中央値は75.7、はるかに難しいSWE-Bench Proは41.0。広場の能力バーが「同じ物差しでの順位」を示し、点数そのものを見せないのはこのため。',
  },

  scoreLedger: {
    title: '全成績（ベンチマーク別）',
    blurb: '順位の分母は同じベンチマークで同じ種類の測定者に測られたモデル数で、全モデル数ではない。異なるベンチマークの点数は比較できない。',
    rankOf: (rank, total) => `${rank}位 / ${total}`,
    trackLinkTitle: 'ランキングでこのベンチマークの全リストを見る',
  },

  footer: {
    authorName: 'yupi',
  },

  filters: {
    search: '検索',
    searchPlaceholder: 'モデル名または企業',
    searchAria: 'モデル名・企業名で検索',
    all: 'すべて',
    region: '地域',
    weights: '公開',
    open: 'オープン',
    closed: 'クローズド',
    year: '年',
    yearAny: '指定なし',
    yearAria: 'リリース年で絞り込む',
    vendor: '企業',
    vendorCount: (n) => `（${n}）`,
    clearVendors: '企業選択をクリア',
    includeRetired: '引退済みを含む',
    matched: (n) => `${n}モデルが一致`,
    clear: '条件をクリア',
  },

  leaderboard: {
    noTracks: 'スナップショットに5モデル以上のベンチマークがまだなく、ランキングを開けない。',
    navAria: 'トラック',
    selectTrack: 'トラックを選択',
    trackOption: (label, count) => `${label}（${count}）`,
    showLegacy: '旧版ベンチマークを表示',
    selfReportBadge: 'ベンダー自己申告',
    entriesInfo: (entered, rest) => `${entered}件がランクイン · ほか${rest}件は未参加`,
    homepage: 'ベンチマーク公式 ↗',
    emptyResult:
      '現在の条件ではこのトラックに成績のあるモデルがいない。未参加は「できない」という意味ではない——本サイトは推定値で埋めない。',
    rankAria: (rank) => `第${rank}位`,
    sourceTitle: '出典を見る',
    selfReportTitle: 'ベンダー自身が公表した成績、独立検証なし',
    selfReport: '自己申告',
    collapse: (limit) => `上位${limit}件だけ表示`,
    expand: (total) => `全${total}件を表示`,
    categoryPractical: '実用指標',
    selfReportTrackNote: 'このトラックの点数はすべてベンダー自身の公表で、独立検証はなく、自己申告同士でのみ比較する。',
    derived: {
      value: {
        label: 'コスパ',
        note: '知能のパーセンタイルから価格のパーセンタイルを引いたもの。「同価格帯より賢い」か「同じ知能でより安い」モデルだけが高得点。知能÷価格ではない——それでは最安の古いモデルが勝ってしまう。',
      },
      context: {
        label: 'コンテキストウィンドウ',
        note: '一度に読み込めるトークン数。大きいほど長文書を一気に読める。これはベンダー公称の上限で、実際に覚えているかは「長文脈」系のベンチマークを参照。',
      },
      cheapest: {
        label: '最安',
        note: '出力100万トークンあたりの価格。前ほど安い。テキスト出力のモデルのみ比較——画像・音声モデルの枚数・分課金をトークン価格に換算すると偽の$0になる。',
      },
      newest: {
        label: '最新リリース',
        note: 'リリース日の新しい順。リリース日は複数の上流ソースの最も早い値を採用し、月までしか分からないものはそのまま月で表示。',
      },
    },
  },

  allTable: {
    col: {
      model: 'モデル',
      vendor: '企業',
      region: '地域',
      date: 'リリース',
      open: 'オープン',
      ctx: 'コンテキスト',
      price: '出力価格',
      eci: '総合知能',
      code: 'コーディング',
      n: '参加ベンチマーク数',
    },
    open: 'オープン',
    closed: 'クローズド',
    empty: '条件に合うモデルがいない。',
    eciTitle: (eci, rank) => `Epoch Capabilities Index ${eci}、世界${rank}位`,
    collapse: (limit) => `上位${limit}件だけ表示`,
    expand: (total) => `全${total}件を表示`,
  },

  compare: {
    title: 'モデル比較',
    addMore: 'もう1つモデルを追加して比較開始',
    noContested: '共同参加の評価はまだない',
    contestedCount: (n) => `ベンチマーク対決 ${n}件`,
    ties: (n) => `引き分け ${n}件`,
    loadFailed: '比較データの読み込みに失敗。再読み込みしてみて。',
    loading: 'モデルデータを読み込み中…',
    emptyHint: '右上でモデルを2つ選ぶか、この対戦から始める：',
    joinNames: (names) => names.join(' 対 '),
    remove: '削除',
    removeAria: (name) => `${name} を削除`,
    eciRank: (rank) => `総合知能 ${rank}位`,
    eciNoRank: '総合知能の順位はまだない',
    winsLead: (duel) => (duel ? '勝' : 'トップ'),
    itemsUnit: '件',
    highlightsTitle: 'それぞれの強み',
    noHighlights: '目立つ強みはまだない',
    aptLabel: '能力パーセンタイル',
    aptHint:
      '全モデル中のパーセンタイル：賢さは総合知能、コーディングは最も信頼できるコーディング評価、記憶力はコンテキストウィンドウ、安さは出力価格',
    specsTitle: '基本情報',
    scoresTitle: 'ベンチマーク',
    sameBoth: '両者同じ',
    sameAll: '全て同じ',
    noValue: 'なし',
    scopeGroup: '表示範囲',
    scopeCommon: (n) => `共同参加 ${n}`,
    scopeAll: (n) => `全て ${n}`,
    noScores: (single) =>
      single
        ? 'このモデルには公開された第三者評価がまだない。新モデルは通常1〜2週間で測定される。'
        : 'これらのモデルには公開された第三者評価がまだない。新モデルは通常1〜2週間で測定される。',
    lowerBetter: '低いほど良い',
    legacy: '旧版',
    selfReport: '自己申告',
    notEntered: '未参加',
    notPublished: '未公表',
    rankTitle: (poolSize, rank) => `このベンチマークの${poolSize}モデル中${rank}位`,
    footnote: (date) =>
      `データは${date}時点。点数は Epoch AI、LiveBench、LMArena 公式データセットなどの公開された第三者評価から。「自己申告」はベンダーが発表文で公表した未検証の成績。同一ベンチマーク・同一測定者の間でのみ比較。「#3/25」はそのベンチマークの全モデル中の順位。`,
    spec: {
      releaseDate: 'リリース日',
      kind: 'タイプ',
      ctx: 'コンテキストウィンドウ',
      maxOut: '最大出力',
      priceIn: '入力価格 / 100万トークン',
      priceOut: '出力価格 / 100万トークン',
      priceCached: 'キャッシュ価格',
      cutoff: '知識カットオフ',
      inputs: '読める',
      outputs: '生成できる',
      reasoning: '深い思考',
      tool: 'ツール呼び出し',
      open: 'オープンウェイト',
      params: 'パラメータ数',
    },
    specShort: {
      priceIn: '入力価格',
      priceOut: '出力価格',
      priceCached: 'キャッシュ価格',
    },
    kindModel: (kindLabel) => `${kindLabel}モデル`,
    free: '無料',
    open: 'オープン',
    closed: 'クローズド',
    supported: '対応',
    unsupported: '非対応',
    paramsUnknown: '未公開',
  },

  picker: {
    placeholder: 'モデルを追加（例：Claude、GPT、DeepSeek）',
    placeholderFull: '同時に比較できるのは4つまで',
    ariaLabel: '比較するモデルを追加',
    listAria: '一致したモデル',
    noMatch: '一致するモデルなし',
  },

  compareButton: {
    add: '比較に追加',
    withOthers: (n) => `選択中の${n}件と比較`,
  },

  langSwitcher: {
    label: '言語',
  },
};

const ko: UiDict = {
  search: {
    placeholder: '모델, 기업, 멀티모달 검색…',
    ariaLabel: '모델, 기업 또는 능력 검색',
    loading: '색인 불러오는 중…',
    searching: '검색 중…',
    noResult: '일치하는 모델·기업·능력이 없습니다. "멀티모달" "오픈소스" "중국" 등을 시도하거나 바로',
    noResultLink: '전체 표에서 검색',
    noResultEnd: '.',
    tailCount: (n) => `${n}개`,
    tailTrack: '랭킹 보기',
    groupAbility: '능력으로 찾기',
    groupVendors: '기업',
    groupModels: '모델',
    vendorNote: (continent) => `${continent} 기업`,
    vendorTail: (n) => `모델 ${n}개`,
    modelNote: (vendor, kind, retired) => `${vendor} · ${kind}${retired ? ` · ${retired}` : ''}`,
    modelRank: (rank) => `지능 #${rank}`,
    allMatches: (total) => `일치하는 ${total}개 전부를 전체 표에서 보기 →`,
  },

  ability: {
    none: '없음',
    selfReported: '자체 보고',
  },

  statRow: {
    eye: '이미지를 볼 수 있음',
    ear: '소리를 들을 수 있음',
    brush: '그림을 그릴 수 있음',
    tool: '도구 사용 가능',
    think: '깊이 생각 가능',
    key: '오픈 웨이트',
    ctxTitle: (tokens) => `컨텍스트 윈도우 ${tokens} tokens`,
    ctxUnknown: '컨텍스트 윈도우 알 수 없음',
    priceTitle: (usd) => `출력 ${usd}달러 / 100만 토큰`,
    priceUnknown: '공개 가격 없음',
  },

  room: {
    sweLeague: {
      epoch: 'SWE-bench Verified · Epoch AI 통합 재실행',
      vendor: 'SWE-bench Verified · 벤더 자체 보고, 독립 검증 없음',
      'pro-scale': 'SWE-Bench Pro · Scale AI 공식 리더보드',
      'pro-vendor': 'SWE-Bench Pro · 벤더 시스템 카드 자체 평가, 독립 검증 없음',
    },
    computerTitle: (score, leagueName) =>
      `코딩 능력 ${score}\n${leagueName}\n등급은 같은 리그 내 백분위. 리그 간 점수 비교 불가`,
    computerMissing: () =>
      '코딩 능력: 데이터 없음. 공개된 코딩 평가 성적을 찾지 못함. 모른다고 해서 못 하는 것은 아님.',
    contextTitle: (ctx) => `컨텍스트 ${ctx}`,
    unknownValue: '알 수 없음',
  },

  plaza: {
    unknownDate: '날짜 불명',
  },

  lineage: {
    dateUnknown: '날짜 불명',
    ruleHint: (kindLabel) =>
      `같은 기업이고, 이름에서 첫 숫자 앞부분이 같으며, 같은 ${kindLabel} 모델이면 하나의 시리즈로 간주`,
    heading: (stem, kindLabel) => `${stem} 시리즈 ${kindLabel} 모델 · 출시순`,
    totalWindowed: (total, shown) => `총 ${total}개 · 인접한 ${shown}개 표시 · `,
    totalAll: (total) => `총 ${total}개 · `,
    vendorAll: (vendorName) => `${vendorName} 모델 전체 →`,
  },

  ledger: {
    empty1: '이 모델의 공개된 코딩 평가 성적을 찾지 못했습니다.',
    empty2: '이는 "공개적으로 측정된 적이 없다"는 뜻이지 "코딩을 못 한다"는 뜻이 아닙니다. 이 사이트는 추정치로 빈칸을 채우지 않습니다.',
    thirdPartyHint: '벤치마크 운영자 또는 독립 제3자가 측정·공개',
    selfReportHint: '벤더가 자사 시스템 카드나 발표 글에서 공개한 것으로 독립 검증 없음',
    footnotePre: '이 점수들은 ',
    footnoteStrong: '서로 비교할 수 없습니다',
    footnotePost:
      '. 같은 모델도 평가 하네스가 바뀌면 20~30점 차이가 납니다. SWE-bench Verified 중앙값은 75.7, 훨씬 어려운 SWE-Bench Pro는 41.0입니다. 광장의 능력 바가 점수 대신 "같은 기준 안에서의 순위"를 보여주는 이유입니다.',
  },

  scoreLedger: {
    title: '전체 성적(벤치마크별)',
    blurb: '순위의 분모는 같은 벤치마크에서 같은 유형의 측정자로 측정된 모델 수이며 전체 모델 수가 아닙니다. 서로 다른 벤치마크의 점수는 비교할 수 없습니다.',
    rankOf: (rank, total) => `${rank}위 / ${total}`,
    trackLinkTitle: '리더보드에서 이 벤치마크 전체 명단 보기',
  },

  footer: {
    authorName: 'yupi',
  },

  filters: {
    search: '검색',
    searchPlaceholder: '모델명 또는 기업',
    searchAria: '모델명·기업명으로 검색',
    all: '전체',
    region: '지역',
    weights: '공개',
    open: '오픈',
    closed: '클로즈드',
    year: '연도',
    yearAny: '전체',
    yearAria: '출시 연도로 필터',
    vendor: '기업',
    vendorCount: (n) => ` (${n})`,
    clearVendors: '기업 선택 해제',
    includeRetired: '은퇴 포함',
    matched: (n) => `모델 ${n}개 일치`,
    clear: '필터 초기화',
  },

  leaderboard: {
    noTracks: '스냅샷에 모델 5개 이상인 벤치마크가 아직 없어 리더보드를 열 수 없습니다.',
    navAria: '트랙',
    selectTrack: '트랙 선택',
    trackOption: (label, count) => `${label} (${count})`,
    showLegacy: '구버전 벤치마크 표시',
    selfReportBadge: '벤더 자체 보고',
    entriesInfo: (entered, rest) => `${entered}개 등재 · 나머지 ${rest}개 미참가`,
    homepage: '벤치마크 홈페이지 ↗',
    emptyResult:
      '현재 필터 조건에서 이 트랙에 성적이 있는 모델이 없습니다. 미참가가 불가능을 뜻하지는 않습니다. 이 사이트는 추정치로 빈칸을 채우지 않습니다.',
    rankAria: (rank) => `${rank}위`,
    sourceTitle: '출처 보기',
    selfReportTitle: '벤더가 직접 공개한 성적, 독립 검증 없음',
    selfReport: '자체 보고',
    collapse: (limit) => `상위 ${limit}개만 보기`,
    expand: (total) => `전체 ${total}개 펼치기`,
    categoryPractical: '실용 지표',
    selfReportTrackNote: '이 트랙의 점수는 모두 벤더가 직접 공개한 것으로 독립 검증 없이 자체 보고끼리만 비교합니다.',
    derived: {
      value: {
        label: '가성비',
        note: '지능 백분위에서 가격 백분위를 뺀 값. "같은 가격대보다 똑똑하거나" "같은 지능에서 더 저렴한" 모델만 높은 점수를 받음. 지능을 가격으로 나눈 값이 아님 — 그러면 가장 싼 옛 모델이 1위가 됨.',
      },
      context: {
        label: '컨텍스트 윈도우',
        note: '한 번에 읽을 수 있는 토큰 수. 클수록 긴 문서를 한 번에 읽을 수 있음. 이는 벤더가 공표한 상한이며 실제 기억력은 "긴 컨텍스트" 벤치마크 참조.',
      },
      cheapest: {
        label: '최저가',
        note: '출력 100만 토큰당 가격. 앞일수록 저렴. 텍스트 출력 모델만 비교 — 이미지·음성 모델의 장당·분당 과금을 토큰 가격으로 환산하면 가짜 $0이 됨.',
      },
      newest: {
        label: '최신 출시',
        note: '출시일 최신순. 출시일은 여러 업스트림 소스 중 가장 이른 값을 사용하며 월까지만 알려진 것은 월까지 표시.',
      },
    },
  },

  allTable: {
    col: {
      model: '모델',
      vendor: '기업',
      region: '지역',
      date: '출시',
      open: '오픈',
      ctx: '컨텍스트',
      price: '출력 가격',
      eci: '종합 지능',
      code: '코딩',
      n: '참가 벤치마크 수',
    },
    open: '오픈',
    closed: '클로즈드',
    empty: '조건에 맞는 모델이 없습니다.',
    eciTitle: (eci, rank) => `Epoch Capabilities Index ${eci}, 세계 ${rank}위`,
    collapse: (limit) => `상위 ${limit}개만 보기`,
    expand: (total) => `전체 ${total}개 펼치기`,
  },

  compare: {
    title: '모델 비교',
    addMore: '모델을 하나 더 추가해 비교 시작',
    noContested: '공동 참가한 평가가 아직 없음',
    contestedCount: (n) => `벤치마크 대결 ${n}건`,
    ties: (n) => `무승부 ${n}건`,
    loadFailed: '비교 데이터를 불러오지 못했습니다. 새로고침해 보세요.',
    loading: '모델 데이터 불러오는 중…',
    emptyHint: '오른쪽 위에서 모델 두 개를 고르거나, 이 대결부터 시작하세요:',
    joinNames: (names) => names.join(' 대 '),
    remove: '제거',
    removeAria: (name) => `${name} 제거`,
    eciRank: (rank) => `종합 지능 ${rank}위`,
    eciNoRank: '종합 지능 순위 없음',
    winsLead: (duel) => (duel ? '승' : '1위'),
    itemsUnit: '건',
    highlightsTitle: '각자의 강점',
    noHighlights: '뚜렷한 강점 없음',
    aptLabel: '능력 백분위',
    aptHint:
      '전체 모델 중 백분위: 똑똑함은 종합 지능, 코딩은 가장 신뢰할 수 있는 코딩 평가, 기억력은 컨텍스트 윈도우, 저렴함은 출력 가격',
    specsTitle: '기본 정보',
    scoresTitle: '벤치마크 점수',
    sameBoth: '둘 동일',
    sameAll: '모두 동일',
    noValue: '없음',
    scopeGroup: '표시 범위',
    scopeCommon: (n) => `공동 참가 ${n}`,
    scopeAll: (n) => `전체 ${n}`,
    noScores: (single) =>
      single
        ? '이 모델은 공개된 제3자 평가 성적이 아직 없습니다. 신모델은 보통 1~2주 후에 측정됩니다.'
        : '이 모델들은 공개된 제3자 평가 성적이 아직 없습니다. 신모델은 보통 1~2주 후에 측정됩니다.',
    lowerBetter: '낮을수록 좋음',
    legacy: '구버전',
    selfReport: '자체 보고',
    notEntered: '미참가',
    notPublished: '미공개',
    rankTitle: (poolSize, rank) => `이 벤치마크의 ${poolSize}개 모델 중 ${rank}위`,
    footnote: (date) =>
      `데이터 기준일 ${date}. 점수는 Epoch AI, LiveBench, LMArena 공식 데이터셋 등 공개된 제3자 평가에서 가져옵니다. "자체 보고"는 벤더가 발표 글에서 공개한 미검증 성적입니다. 같은 벤치마크·같은 측정자 내에서만 비교하며 "#3/25"는 해당 벤치마크 전체 모델 중 순위입니다.`,
    spec: {
      releaseDate: '출시일',
      kind: '유형',
      ctx: '컨텍스트 윈도우',
      maxOut: '최대 출력',
      priceIn: '입력 가격 / 100만 토큰',
      priceOut: '출력 가격 / 100만 토큰',
      priceCached: '캐시 적중 가격',
      cutoff: '지식 컷오프',
      inputs: '읽기 가능',
      outputs: '생성 가능',
      reasoning: '깊은 사고',
      tool: '도구 호출',
      open: '오픈 웨이트',
      params: '파라미터 수',
    },
    specShort: {
      priceIn: '입력 가격',
      priceOut: '출력 가격',
      priceCached: '캐시 적중 가격',
    },
    kindModel: (kindLabel) => `${kindLabel} 모델`,
    free: '무료',
    open: '오픈',
    closed: '클로즈드',
    supported: '지원',
    unsupported: '미지원',
    paramsUnknown: '미공개',
  },

  picker: {
    placeholder: '모델 추가 (예: Claude, GPT, DeepSeek)',
    placeholderFull: '최대 4개 모델까지 비교 가능',
    ariaLabel: '비교할 모델 추가',
    listAria: '일치하는 모델',
    noMatch: '일치하는 모델 없음',
  },

  compareButton: {
    add: '비교에 추가',
    withOthers: (n) => `선택한 ${n}개와 비교`,
  },

  langSwitcher: {
    label: '언어',
  },
};

/** 四语言齐备由 Record<Lang, UiDict> 强制，漏译编译报错。 */
export const uiDict: Record<Lang, UiDict> = { zh, en, ja, ko };




