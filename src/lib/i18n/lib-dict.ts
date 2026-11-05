/**
 * lib 层字典：persona / aptitude / champions / traits / 搜索概念 / 对比 insights / 格式化。
 *
 * 规则（docs/I18N.md）：
 * - 新增 key 必须四语言一次写全——`Record<Lang, LibDict>` 让漏译直接编译报错。
 * - zh 一律用改造前的原文逐字复制，中文版渲染输出逐字节不变。
 * - 语序不同的语言用字典函数拼句子（champion / ranked / describe / 各 title 模板），
 *   调用方只传参数，不在外面拼字符串。
 * - 榜单名、厂商名各语言统一保留英文原名，这里不译。
 *
 * 注意循环依赖：lib 层模块（persona / aptitude / …）会 import 本文件，
 * 所以本文件只允许 import './types'，所有词表 id 联合类型在这里定义、由 lib 层反向引用。
 */

import type { Lang } from './types';

/** persona.ts 的维度 id（与 dimensionsFor 里的顺序一致，顺序即优先级） */
export type PersonaDimensionId = 'intelligence' | 'coding' | 'memory' | 'value' | 'cheap';

/** persona.ts 的限定域 id（与 DOMAINS 里的顺序一致，顺序即宽窄） */
export type PersonaDomainId = 'all' | 'open' | 'east' | 'west' | 'million' | 'vision' | 'top10';

/** 搜索概念的维度（与 search.ts 的 ConceptDimension 同义，这里独立定义避免循环引用） */
export type LibConceptDimension = 'kind' | 'weights' | 'region';

/** 搜索概念词条。keywords 一律写成折叠后的形式（小写、无分隔符）。 */
export interface LibSearchConcept {
  id: string;
  dimension: LibConceptDimension;
  /** 写进 URL 的筛选参数值，各语言完全一致 */
  value: string;
  label: string;
  hint: string;
  keywords: string[];
}

/** 排行榜赛道快捷入口。id 对应 scores.ts 里写死的实用指标。 */
export interface LibTrackShortcut {
  id: string;
  label: string;
  hint: string;
  keywords: string[];
}

/** 能力条 id（与 aptitude.ts 的 AptitudeId 同义） */
export type LibAptitudeId = 'smart' | 'code' | 'memory' | 'cheap';

/** 特征标签 id（与 traits.ts 里 push 出来的 id 一一对应） */
export type LibTraitId =
  | 'strongest'
  | 'top5'
  | 'top10'
  | 'best-coder'
  | 'coder'
  | 'best-memory'
  | 'million'
  | 'best-value'
  | 'cheapest'
  | 'cheap'
  | 'costly'
  | 'newborn'
  | 'elder'
  | 'retired'
  | 'open'
  | 'reasoning';

export interface LibDict {
  persona: {
    /** 「综合智力第一」里的那一段，按 PersonaDimensionId 查 */
    superlative: Record<PersonaDimensionId, string>;
    /** 「开源模型里」这一段，按 PersonaDomainId 查 */
    domainPrefix: Record<PersonaDomainId, string>;
    /** 限定域最高级整句：zh「全世界综合智力第一的模型」。 */
    champion: (domainPrefix: string, superlative: string) => string;
    /** 价格档兜底词，从便宜到贵 5 档（对应 priceScale 的 1~5） */
    priceWords: [string, string, string, string, string];
    /** 上下文档兜底词，从短到长 5 档（对应 bookshelf 的 1~5） */
    memoryWords: [string, string, string, string, string];
    /**
     * 上下文的生活化锚点，按 token 门槛从高到低排列：
     * 2M / 1M / 500K / 200K / 100K / 32K / 0，与 persona.ts 的 CONTEXT_ANCHORS 同序。
     */
    contextAnchors: [string, string, string, string, string, string, string];
    /** 三级兜底：上游只有基本信息时的老实承认 */
    fallback: string;
    /** 定位式描述里的能力短词 */
    visionCapable: string;
    reasoningCapable: string;
    /** 二级兜底·报名次：zh「综合智力全球第 7，偏贵」 */
    ranked: (rank: number, extras: string[]) => string;
    /** 二级兜底·拼接：zh「便宜、能读长文、会看图的开源模型」 */
    describe: (bits: string[], openWeights: boolean) => string;
  };

  aptitude: {
    /** 四条能力横条的标签与悬停解释 */
    bars: Record<LibAptitudeId, { label: string; blurb: string }>;
    /** 能力结论词，从弱到强 5 档 */
    verdicts: [string, string, string, string, string];
    /** 价格结论词，从贵到便宜 5 档（价格高 = 条短） */
    priceVerdicts: [string, string, string, string, string];
    /** 编程池太小、给不出档位时的短标 */
    entered: string;
    /** 聪明条的短标：zh「世界#3」 */
    worldRank: (rank: number) => string;
    /** 各条缺数据时的悬停文案（「没测过」≠「得了零分」） */
    missingSmart: string;
    missingCode: string;
    missingMemory: string;
    missingCheap: string;
    smartTitle: (eci: string, total: number, rank: number) => string;
    codeRankedLine: (poolSize: number, rank: number) => string;
    codeSmallPoolLine: (poolSize: number) => string;
    selfReportedNote: string;
    thirdPartyNote: string;
    poolNote: string;
    memoryTitle: (ctx: string, chars: string, total: number, percentile: number) => string;
    cheapTitle: (price: string, total: number, percent: number) => string;
  };

  champions: {
    /** 聪明卡 detail：受测模型数 */
    smartDetail: (count: number) => string;
    /** 编程卡 figure：共识分折算的百分比位次 */
    topPercent: (n: number) => string;
    /** 编程卡 detail：参与共识的榜数 */
    codeDetail: (leagues: number) => string;
    /** 性价比卡 detail */
    valueDetail: (rank: number) => string;
    cheapDetail: string;
    memoryDetail: string;
    /** 最新卡 figure：0 = 今天 */
    daysAgo: (days: number) => string;
    /** 最新卡 detail：发布日期 */
    releasedOn: (date: string) => string;
    eastDetail: (rank: number) => string;
    openDetail: (rank: number) => string;
  };

  traits: {
    label: Record<LibTraitId, string>;
    strongestTitle: string;
    topNTitle: (rank: number) => string;
    bestCoderTitle: string;
    coderTitle: (rank: number) => string;
    bestMemoryTitle: string;
    millionTitle: string;
    bestValueTitle: (rank: number) => string;
    cheapestTitle: string;
    cheapTitle: string;
    costlyTitle: string;
    newbornTitle: (days: number) => string;
    elderTitle: (years: number) => string;
    retiredTitle: (date: string) => string;
    openTitle: string;
    reasoningTitle: string;
  };

  search: {
    /** 能力概念词表：词不同、指向的筛选参数各语言完全一致 */
    concepts: LibSearchConcept[];
    /** 赛道快捷入口 */
    trackShortcuts: LibTrackShortcut[];
    /** 组合筛选副标题里多条 hint 之间的分隔符 */
    hintSep: string;
  };

  insights: {
    /** 对比页「能读图片」这类模态词（注意与 format.modality 的 zh 用词不同：这里是「图片」） */
    modality: Record<string, string>;
    joinList: (items: string[]) => string;
    benchWinVs: (label: string, mine: string, runner: string) => string;
    benchWinFirst: (label: string, mine: string) => string;
    soloRank: (label: string, rank: number, text: string, poolSize: number) => string;
    cheaperVs: (percent: number, mine: string, next: string) => string;
    cheapestSolo: (usd: string) => string;
    longerCtxVs: (mine: string, next: string) => string;
    longestCtx: (mine: string) => string;
    longerOutVs: (mine: string, next: string) => string;
    longestOut: (mine: string) => string;
    newerCutoffVs: (mine: string, other: string) => string;
    newestCutoff: (mine: string) => string;
    openWeightsText: string;
    canRead: (mods: string[], duel: boolean) => string;
    canGenerate: (mods: string[]) => string;
    reasoningModeText: string;
    /** 独有成绩补位时标注出处 */
    officialSuffix: string;
    /** 厂商自报榜的标签后缀（compare.ts 拼接与 insights.ts 剥离共用同一串） */
    selfReportSuffix: string;
    presetTop2: string;
    presetEastWest: string;
    presetOpenClosed: string;
    presetNewest: string;
  };

  format: {
    minutes: (n: string) => string;
    hours: (n: string) => string;
    days: (n: string) => string;
    /** 单价后缀：zh「/ 百万 tokens」 */
    perMTok: (price: string) => string;
    yearOnly: (year: string) => string;
    fullDate: (year: number, month: number, day: number) => string;
    /** 混合专家模型的激活参数量括注 */
    activeParams: (activeB: string) => string;
    paramsInferred: string;
    yes: string;
    no: string;
    /** 模态名（zh 用「图像」） */
    modality: Record<string, string>;
    joinList: (items: string[]) => string;
  };
}

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const zh: LibDict = {
  persona: {
    superlative: {
      intelligence: '综合智力第一',
      coding: '最会写代码',
      memory: '记性最好',
      value: '最划算',
      cheap: '最便宜',
    },
    domainPrefix: {
      all: '全世界',
      open: '开源模型里',
      east: '国内厂商里',
      west: '国外厂商里',
      million: '百万上下文的模型里',
      vision: '看得懂图的模型里',
      top10: '十强里',
    },
    champion: (prefix, superlative) => `${prefix}${superlative}的模型`,
    priceWords: ['白菜价', '便宜', '中等价位', '偏贵', '天价'],
    memoryWords: ['记性短', '记性一般', '记性不错', '记性很好', '能读长文'],
    contextAnchors: [
      '一次能读完一整套长篇小说',
      '一次能读完《哈利·波特》全七部',
      '一次能读完《三体》三部曲',
      '一次能读完一本《三体》',
      '一次能读完一本中篇小说',
      '一次能读完一篇长论文',
      '一次只能读几千字',
    ],
    fallback: '上游只收录了它的基本信息，还没有公开的评测成绩',
    visionCapable: '会看图',
    reasoningCapable: '会深思',
    ranked: (rank, extras) =>
      `综合智力全球第 ${rank}${extras.length > 0 ? `，${extras.join('、')}` : ''}`,
    describe: (bits, openWeights) => `${bits.join('、')}的${openWeights ? '开源模型' : '模型'}`,
  },

  aptitude: {
    bars: {
      smart: { label: '聪明', blurb: '综合智力。取 Epoch AI 的 Capabilities Index，它把十几项学术评测归并成一个总分。' },
      code: { label: '编程', blurb: '写代码与做软件工程的本事。取该模型拿得到的最可信的一项编程评测。' },
      memory: { label: '记性', blurb: '上下文窗口，也就是一次能读进去多少字。窗口越大，越能一口气啃完长文档或整个代码仓库。' },
      cheap: { label: '便宜', blurb: '输出每百万 token 的价格，条越长越便宜。' },
    },
    verdicts: ['入门', '偏弱', '中等', '很强', '顶尖'],
    priceVerdicts: ['天价', '偏贵', '适中', '便宜', '极便宜'],
    entered: '已参赛',
    worldRank: (rank) => `世界#${rank}`,
    missingSmart: '还没有公开的综合智力成绩。没测过不等于不聪明。',
    missingCode: '没有查到任何公开的编程评测成绩。不知道不等于不会写。',
    missingMemory: '上下文窗口未公开。',
    missingCheap: '没有公开的文本输出报价。',
    smartTitle: (eci, total, rank) =>
      `综合智力指数 ${eci}，在 ${total} 个有成绩的模型里排第 ${rank}。\n来源：Epoch AI Capabilities Index。`,
    codeRankedLine: (poolSize, rank) =>
      `在同样被这个榜、由同一类测量方测过的 ${poolSize} 个模型里排第 ${rank}。\n`,
    codeSmallPoolLine: (poolSize) =>
      `同赛制同测量方只有 ${poolSize} 个模型有成绩，样本太少，不给档位。\n`,
    selfReportedNote: '厂商自报，未经独立复核。',
    thirdPartyNote: '第三方实测。',
    poolNote:
      '档位只在本赛制内部计算——换一套评测脚手架，同一个模型能差二三十分，所以这里显示名次而不是分数。',
    memoryTitle: (ctx, chars, total, percentile) =>
      `上下文窗口 ${ctx} tokens，约合 ${chars} 个汉字。\n在 ${total} 个已知窗口大小的模型里处于第 ${percentile} 百分位。`,
    cheapTitle: (price, total, percent) =>
      `输出每百万 tokens ${price} 美元。\n在 ${total} 个有报价的文本模型里，比其中 ${percent}% 便宜。`,

  },

  champions: {
    smartDetail: (count) => `综合智力指数，${count} 个受测模型中第一`,
    topPercent: (n) => `前 ${n}%`,
    codeDetail: (leagues) => `${leagues} 个第三方编程榜的平均排名最高`,
    valueDetail: (rank) => `智力全球 #${rank}，价格远低于同级`,
    cheapDetail: '有第三方评测成绩的模型里，输出最便宜',
    memoryDetail: '上下文窗口，一次能读进去的字数',
    daysAgo: (days) => (days <= 0 ? '今天' : `${days} 天前`),
    releasedOn: (date) => `${date} 发布`,
    eastDetail: (rank) => `国内第一，全球 #${rank}`,
    openDetail: (rank) => `开源第一，全球 #${rank}`,
  },

  traits: {
    label: {
      strongest: '全球第一',
      top5: '五强',
      top10: '十强',
      'best-coder': '编程第一',
      coder: '编程好手',
      'best-memory': '记性最好',
      million: '百万记性',
      'best-value': '性价比之王',
      cheapest: '全场最便宜',
      cheap: '白菜价',
      costly: '天价',
      newborn: '刚出生',
      elder: '元老',
      retired: '已退役',
      open: '开源',
      reasoning: '会深思',
    },
    strongestTitle: '综合智力指数全球第一',
    topNTitle: (rank) => `综合智力第 ${rank} 名`,
    bestCoderTitle: '第三方编程榜平均排名全球第一',
    coderTitle: (rank) => `第三方编程榜平均排名第 ${rank} 名`,
    bestMemoryTitle: '上下文窗口全球最大',
    millionTitle: '上下文窗口达到百万 tokens',
    bestValueTitle: (rank) => `每块钱买到的智力排第 ${rank}`,
    cheapestTitle: '输出单价全球最低',
    cheapTitle: '输出单价处于最便宜的 15%',
    costlyTitle: '输出单价处于最贵的 5%',
    newbornTitle: (days) => `${days} 天前发布`,
    elderTitle: (years) => `发布已超过 ${years} 年`,
    retiredTitle: (date) => `${date} 下线`,
    openTitle: '权重公开，可自行部署',
    reasoningTitle: '推理型模型，回答前会先思考',
  },

  search: {
    concepts: [
      {
        id: 'multimodal',
        dimension: 'kind',
        value: 'multimodal',
        label: '多模态',
        hint: '除纯文本以外的全部：能看图、能听声、能出图出视频',
        keywords: ['多模态', '多模', 'multimodal', 'mm', '非纯文本'],
      },
      {
        id: 'vision',
        dimension: 'kind',
        value: 'vision',
        label: '视觉',
        hint: '能看图或看视频，输出文字',
        keywords: ['视觉', '看图', '识图', '图片理解', '图像理解', '读图', 'vision', 'vl', 'vlm'],
      },
      {
        id: 'omni',
        dimension: 'kind',
        value: 'omni',
        label: '全模态',
        hint: '既能听声音又能看画面',
        keywords: ['全模态', '又听又看', 'omni'],
      },
      {
        id: 'image-gen',
        dimension: 'kind',
        value: 'image-gen',
        label: '图像生成',
        hint: '输出里含图片',
        keywords: ['图像生成', '文生图', '画图', '出图', '生图', '绘图', '生成图片', 'imagegen', 'texttoimage', 't2i'],
      },
      {
        id: 'video-gen',
        dimension: 'kind',
        value: 'video-gen',
        label: '视频生成',
        hint: '输出里含视频',
        keywords: ['视频生成', '文生视频', '出视频', '生成视频', 'videogen', 'texttovideo', 't2v'],
      },
      {
        id: 'speech',
        dimension: 'kind',
        value: 'speech',
        label: '语音',
        hint: '语音识别、语音合成，或只听不看的语音对话',
        keywords: ['语音', '声音', '音频', '语音识别', '语音合成', '转写', 'speech', 'audio', 'tts', 'asr', 'voice'],
      },
      {
        id: 'text',
        dimension: 'kind',
        value: 'text',
        label: '文本',
        hint: '只读文字、只出文字',
        keywords: ['文本', '纯文本', '文字', 'text', 'llm'],
      },
      {
        id: 'open',
        dimension: 'weights',
        value: 'open',
        label: '开源',
        hint: '权重公开，可以自己部署',
        keywords: ['开源', '开放权重', '权重公开', '可自部署', 'open', 'openweights', 'opensource'],
      },
      {
        id: 'closed',
        dimension: 'weights',
        value: 'closed',
        label: '闭源',
        hint: '权重不公开，只能走 API',
        keywords: ['闭源', '不开源', '闭源模型', 'closed', 'proprietary'],
      },
      {
        id: 'east',
        dimension: 'region',
        value: 'east',
        label: '国内',
        hint: '总部在中国（含港澳台）的厂商',
        keywords: ['国内', '国产', '中国', '大陆', 'china', 'chinese', 'domestic'],
      },
      {
        id: 'west',
        dimension: 'region',
        value: 'west',
        label: '国外',
        hint: '总部在中国以外的厂商',
        keywords: ['国外', '海外', '外国', 'foreign', 'overseas', 'us'],
      },
    ],
    trackShortcuts: [
      {
        id: 'context',
        label: '上下文最长',
        hint: '按一次能读进去多少字排',
        keywords: ['上下文', '长上下文', '记性', '记忆', '窗口', 'context', 'longcontext'],
      },
      {
        id: 'cheapest',
        label: '最便宜',
        hint: '按输出单价从低到高排',
        keywords: ['便宜', '最便宜', '省钱', '低价', '白菜价', 'cheap', 'cheapest', 'price'],
      },
      {
        id: 'value',
        label: '最划算',
        hint: '按同等智力下的价格优势排',
        keywords: ['划算', '性价比', '值', 'value'],
      },
      {
        id: 'newest',
        label: '最新发布',
        hint: '按发布日期从新到旧排',
        keywords: ['最新', '新发布', '最近', '刚出', 'newest', 'latest', 'new'],
      },
    ],
    hintSep: '；',
  },

  insights: {
    modality: { text: '文字', image: '图片', audio: '声音', video: '视频', pdf: '文件' },
    joinList: (items) => items.join('、'),
    benchWinVs: (label, mine, runner) => `${label} ${mine} 对 ${runner}`,
    benchWinFirst: (label, mine) => `${label}第一：${mine}`,
    soloRank: (label, rank, text, poolSize) => `${label}全榜第 ${rank}：${text}（${poolSize} 个模型）`,
    cheaperVs: (percent, mine, next) => `输出价便宜 ${percent}%：${mine} 对 ${next}`,
    cheapestSolo: (usd) => `输出价最低：${usd} / 百万 tokens`,
    longerCtxVs: (mine, next) => `上下文更长：${mine} 对 ${next}`,
    longestCtx: (mine) => `上下文最长：${mine}`,
    longerOutVs: (mine, next) => `单次输出更长：${mine} 对 ${next}`,
    longestOut: (mine) => `单次输出最长：${mine}`,
    newerCutoffVs: (mine, other) => `知识更新：截止 ${mine}，对方 ${other}`,
    newestCutoff: (mine) => `知识最新：截止 ${mine}`,
    openWeightsText: '开源权重，可以自己部署',
    canRead: (mods, duel) => `能读${mods.join('、')}${duel ? '，对方不行' : ''}`,
    canGenerate: (mods) => `能生成${mods.join('、')}`,
    reasoningModeText: '有深度思考模式',
    officialSuffix: '（官方公布）',
    selfReportSuffix: '（厂商自报）',
    presetTop2: '综合智力前两名',
    presetEastWest: '国外第一对国内第一',
    presetOpenClosed: '闭源第一对开源第一',
    presetNewest: '最新发布',
  },

  format: {
    minutes: (n) => `${n} 分钟`,
    hours: (n) => `${n} 小时`,
    days: (n) => `${n} 天`,
    perMTok: (price) => `$${price} / 百万 tokens`,
    yearOnly: (year) => `${year} 年`,
    fullDate: (year, month, day) => `${year} 年 ${month} 月 ${day} 日`,
    activeParams: (activeB) => `（激活 ${activeB}B）`,
    paramsInferred: ' · 由型号名推断',
    yes: '是',
    no: '否',
    modality: { text: '文字', image: '图像', audio: '声音', video: '视频', pdf: '文件' },
    joinList: (items) => items.join('、'),
  },
};

const en: LibDict = {
  persona: {
    superlative: {
      intelligence: 'smartest',
      coding: 'best coding',
      memory: 'longest-memory',
      value: 'best-value',
      cheap: 'cheapest',
    },
    domainPrefix: {
      all: 'in the world',
      open: 'among open-weight models',
      east: 'among Chinese vendors',
      west: 'among global vendors',
      million: 'among models with million-token context',
      vision: 'among vision-capable models',
      top10: 'in the top 10',
    },
    champion: (prefix, superlative) => `The ${superlative} model ${prefix}`,
    priceWords: ['dirt-cheap', 'cheap', 'mid-priced', 'pricey', 'sky-high'],
    memoryWords: ['short-memory', 'average-memory', 'good-memory', 'great-memory', 'long-read'],
    contextAnchors: [
      'can read an entire long novel series in one go',
      'can read all seven Harry Potter books in one go',
      'can read the whole Three-Body trilogy in one go',
      'can read one Three-Body Problem novel in one go',
      'can read a novella in one go',
      'can read a long paper in one go',
      'can only read a few thousand words at a time',
    ],
    fallback: 'Upstream sources only list its basic info; no public benchmark results yet',
    visionCapable: 'vision-capable',
    reasoningCapable: 'deep-thinking',
    ranked: (rank, extras) =>
      `Global #${rank} in intelligence${extras.length > 0 ? `, ${extras.join(', ')}` : ''}`,
    describe: (bits, openWeights) => {
      const s = `${bits.join(', ')} ${openWeights ? 'open-weight ' : ''}model`;
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
  },

  aptitude: {
    bars: {
      smart: { label: 'Smart', blurb: "General intelligence. Uses Epoch AI's Capabilities Index, which merges a dozen academic benchmarks into a single score." },
      code: { label: 'Coding', blurb: 'The ability to write code and do software engineering. Uses the most credible coding benchmark available for this model.' },
      memory: { label: 'Memory', blurb: 'Context window: how much text it can read at once. The bigger the window, the longer the document or codebase it can handle in one go.' },
      cheap: { label: 'Cheap', blurb: 'Price per million output tokens; the longer the bar, the cheaper.' },
    },
    verdicts: ['Basic', 'Weak', 'Average', 'Strong', 'Top-tier'],
    priceVerdicts: ['Sky-high', 'Pricey', 'Fair', 'Cheap', 'Dirt cheap'],
    entered: 'Entered',
    worldRank: (rank) => `World #${rank}`,
    missingSmart: 'No public general-intelligence score yet. Untested does not mean unintelligent.',
    missingCode: 'No public coding benchmark score found. Unknown does not mean incapable.',
    missingMemory: 'Context window not disclosed.',
    missingCheap: 'No public price for text output.',
    smartTitle: (eci, total, rank) =>
      `Intelligence index ${eci}, rank ${rank} of ${total} models with scores.\nSource: Epoch AI Capabilities Index.`,
    codeRankedLine: (poolSize, rank) =>
      `Rank ${rank} of ${poolSize} models tested on this benchmark by the same kind of measurer.\n`,
    codeSmallPoolLine: (poolSize) =>
      `Only ${poolSize} models have scores in this league from this measurer; too few to assign a tier.\n`,
    selfReportedNote: 'Vendor-reported, not independently verified.',
    thirdPartyNote: 'Measured by a third party.',
    poolNote:
      'Tiers are computed within this league only — a different evaluation harness can move the same model by 20–30 points, so a rank is shown instead of a score.',
    memoryTitle: (ctx, chars, total, percentile) =>
      `Context window ${ctx} tokens, roughly ${chars} Chinese characters.\nPercentile ${percentile} among ${total} models with a known window.`,
    cheapTitle: (price, total, percent) =>
      `Output costs $${price} per million tokens.\nCheaper than ${percent}% of ${total} text models with published prices.`,
  },

  champions: {
    smartDetail: (count) => `Epoch Capabilities Index, #1 of ${count} tested models`,
    topPercent: (n) => `Top ${n}%`,
    codeDetail: (leagues) => `Highest average rank across ${leagues} third-party coding benchmarks`,
    valueDetail: (rank) => `Intelligence global #${rank}, priced far below its tier`,
    cheapDetail: 'Cheapest output among models with third-party benchmark scores',
    memoryDetail: 'Context window: how much text it can read at once',
    daysAgo: (days) => (days <= 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`),
    releasedOn: (date) => `Released ${date}`,
    eastDetail: (rank) => `#1 in China, #${rank} globally`,
    openDetail: (rank) => `#1 open-weight, #${rank} globally`,
  },

  traits: {
    label: {
      strongest: 'Global #1',
      top5: 'Top 5',
      top10: 'Top 10',
      'best-coder': 'Best Coder',
      coder: 'Good Coder',
      'best-memory': 'Best Memory',
      million: 'Million-Token Memory',
      'best-value': 'Value King',
      cheapest: 'Cheapest Overall',
      cheap: 'Dirt Cheap',
      costly: 'Sky-High Price',
      newborn: 'New',
      elder: 'Veteran',
      retired: 'Retired',
      open: 'Open',
      reasoning: 'Deep Thinker',
    },
    strongestTitle: 'Global #1 on the Epoch Capabilities Index',
    topNTitle: (rank) => `#${rank} in general intelligence`,
    bestCoderTitle: 'Highest average rank across third-party coding benchmarks',
    coderTitle: (rank) => `Average rank #${rank} across third-party coding benchmarks`,
    bestMemoryTitle: 'Largest context window in the world',
    millionTitle: 'Context window reaches one million tokens',
    bestValueTitle: (rank) => `#${rank} in intelligence per dollar`,
    cheapestTitle: 'Lowest output price in the world',
    cheapTitle: 'Output price in the cheapest 15%',
    costlyTitle: 'Output price in the most expensive 5%',
    newbornTitle: (days) => (days === 1 ? 'Released 1 day ago' : `Released ${days} days ago`),
    elderTitle: (years) => (years === 1 ? 'Released over 1 year ago' : `Released over ${years} years ago`),
    retiredTitle: (date) => `Discontinued ${date}`,
    openTitle: 'Open weights; can be self-hosted',
    reasoningTitle: 'Reasoning model; thinks before answering',
  },

  search: {
    concepts: [
      {
        id: 'multimodal',
        dimension: 'kind',
        value: 'multimodal',
        label: 'Multimodal',
        hint: 'Everything except text-only: sees images, hears audio, or generates images/video',
        keywords: ['multimodal', 'mm', 'nontext'],
      },
      {
        id: 'vision',
        dimension: 'kind',
        value: 'vision',
        label: 'Vision',
        hint: 'Sees images or video, outputs text',
        keywords: ['vision', 'vl', 'vlm', 'imageunderstanding'],
      },
      {
        id: 'omni',
        dimension: 'kind',
        value: 'omni',
        label: 'Omni',
        hint: 'Both hears audio and sees images',
        keywords: ['omni', 'omnimodal'],
      },
      {
        id: 'image-gen',
        dimension: 'kind',
        value: 'image-gen',
        label: 'Image Gen',
        hint: 'Output includes images',
        keywords: ['imagegen', 'texttoimage', 't2i', 'draw', 'generateimages'],
      },
      {
        id: 'video-gen',
        dimension: 'kind',
        value: 'video-gen',
        label: 'Video Gen',
        hint: 'Output includes video',
        keywords: ['videogen', 'texttovideo', 't2v', 'generatevideo'],
      },
      {
        id: 'speech',
        dimension: 'kind',
        value: 'speech',
        label: 'Speech',
        hint: 'Speech recognition, synthesis, or voice-only chat',
        keywords: ['speech', 'audio', 'tts', 'asr', 'voice'],
      },
      {
        id: 'text',
        dimension: 'kind',
        value: 'text',
        label: 'Text',
        hint: 'Reads and writes text only',
        keywords: ['text', 'textonly', 'llm'],
      },
      {
        id: 'open',
        dimension: 'weights',
        value: 'open',
        label: 'Open',
        hint: 'Open weights; can be self-hosted',
        keywords: ['open', 'opensource', 'openweights', 'openweight', 'selfhost'],
      },
      {
        id: 'closed',
        dimension: 'weights',
        value: 'closed',
        label: 'Closed',
        hint: 'Weights not public; API only',
        keywords: ['closed', 'proprietary', 'closedsource'],
      },
      {
        id: 'east',
        dimension: 'region',
        value: 'east',
        label: 'China',
        hint: 'Vendors headquartered in China (incl. Hong Kong, Macau, Taiwan)',
        keywords: ['china', 'chinese', 'domestic'],
      },
      {
        id: 'west',
        dimension: 'region',
        value: 'west',
        label: 'Global',
        hint: 'Vendors headquartered outside China',
        keywords: ['global', 'foreign', 'overseas', 'us', 'international', 'western'],
      },
    ],
    trackShortcuts: [
      {
        id: 'context',
        label: 'Longest context',
        hint: 'Ranked by how much text can be read at once',
        keywords: ['context', 'longcontext', 'memory', 'window'],
      },
      {
        id: 'cheapest',
        label: 'Cheapest',
        hint: 'Ranked by output price, low to high',
        keywords: ['cheap', 'cheapest', 'price', 'lowcost', 'budget'],
      },
      {
        id: 'value',
        label: 'Best value',
        hint: 'Ranked by price advantage at equal intelligence',
        keywords: ['value', 'costeffective', 'worth'],
      },
      {
        id: 'newest',
        label: 'Newest',
        hint: 'Ranked by release date, newest first',
        keywords: ['newest', 'latest', 'new', 'recent'],
      },
    ],
    hintSep: '; ',
  },

  insights: {
    modality: { text: 'text', image: 'images', audio: 'audio', video: 'video', pdf: 'files' },
    joinList: (items) => items.join(', '),
    benchWinVs: (label, mine, runner) => `${label}: ${mine} vs ${runner}`,
    benchWinFirst: (label, mine) => `${label} #1: ${mine}`,
    soloRank: (label, rank, text, poolSize) => `${label} #${rank} overall: ${text} (${poolSize} models)`,
    cheaperVs: (percent, mine, next) => `Output ${percent}% cheaper: ${mine} vs ${next}`,
    cheapestSolo: (usd) => `Lowest output price: ${usd} / 1M tokens`,
    longerCtxVs: (mine, next) => `Longer context: ${mine} vs ${next}`,
    longestCtx: (mine) => `Longest context: ${mine}`,
    longerOutVs: (mine, next) => `Longer single output: ${mine} vs ${next}`,
    longestOut: (mine) => `Longest single output: ${mine}`,
    newerCutoffVs: (mine, other) => `Fresher knowledge: cutoff ${mine}, theirs ${other}`,
    newestCutoff: (mine) => `Freshest knowledge: cutoff ${mine}`,
    openWeightsText: 'Open weights; can be self-hosted',
    canRead: (mods, duel) => `Can read ${mods.join(', ')}${duel ? '; the other cannot' : ''}`,
    canGenerate: (mods) => `Can generate ${mods.join(', ')}`,
    reasoningModeText: 'Has a deep-thinking mode',
    officialSuffix: ' (official)',
    selfReportSuffix: ' (vendor-reported)',
    presetTop2: 'Top 2 by intelligence',
    presetEastWest: 'Global #1 vs China #1',
    presetOpenClosed: 'Closed #1 vs open #1',
    presetNewest: 'Newest releases',
  },

  format: {
    minutes: (n) => `${n} min`,
    hours: (n) => `${n} hr`,
    days: (n) => `${n} days`,
    perMTok: (price) => `$${price} / 1M tokens`,
    yearOnly: (year) => year,
    fullDate: (year, month, day) => `${EN_MONTHS[month - 1]} ${day}, ${year}`,
    activeParams: (activeB) => ` (${activeB}B active)`,
    paramsInferred: ' · inferred from model name',
    yes: 'Yes',
    no: 'No',
    modality: { text: 'text', image: 'images', audio: 'audio', video: 'video', pdf: 'files' },
    joinList: (items) => items.join(', '),
  },
};

const ja: LibDict = {
  persona: {
    superlative: {
      intelligence: '最も賢い',
      coding: '最もコードが書ける',
      memory: '記憶力が最も高い',
      value: '最もコスパが高い',
      cheap: '最も安い',
    },
    domainPrefix: {
      all: '世界',
      open: 'オープンソースモデルの中',
      east: '中国企業の中',
      west: '海外企業の中',
      million: '100万トークン級コンテキストのモデルの中',
      vision: '画像がわかるモデルの中',
      top10: 'トップ10の中',
    },
    champion: (prefix, superlative) => `${prefix}で${superlative}モデル`,
    priceWords: ['激安', '安め', '中価格', 'やや高め', '超高価'],
    memoryWords: ['記憶短め', '記憶は普通', '記憶力は良い', '記憶力はとても良い', '長文が読める'],
    contextAnchors: [
      '長編小説シリーズを一気に読める',
      'ハリー・ポッター全7巻を一気に読める',
      '『三体』三部作を一気に読める',
      '『三体』1冊を一気に読める',
      '中編小説1冊を一気に読める',
      '長い論文を一気に読める',
      '一度に読めるのは数千字程度',
    ],
    fallback: '上流には基本情報のみ収録されており、公開された評価成績はまだない',
    visionCapable: '画像対応',
    reasoningCapable: '深い思考型',
    ranked: (rank, extras) =>
      `総合知能 世界${rank}位${extras.length > 0 ? `、${extras.join('、')}` : ''}`,
    describe: (bits, openWeights) => `${bits.join('、')}の${openWeights ? 'オープンソースモデル' : 'モデル'}`,
  },

  aptitude: {
    bars: {
      smart: { label: '賢さ', blurb: '総合知能。Epoch AI の Capabilities Index を採用。十数の学術評価を1つのスコアに統合したもの。' },
      code: { label: 'コーディング', blurb: 'コードを書き、ソフトウェア工学をこなす力。そのモデルで入手できる最も信頼できるコーディング評価を採用。' },
      memory: { label: '記憶力', blurb: 'コンテキストウィンドウ。一度に読み込める文字数。大きいほど長文書やコードベース全体を一気に読める。' },
      cheap: { label: '安さ', blurb: '出力100万トークンあたりの価格。バーが長いほど安い。' },
    },
    verdicts: ['入門', '弱め', '中程度', 'とても強い', 'トップ'],
    priceVerdicts: ['超高価', 'やや高め', '適正', '安い', '激安'],
    entered: '参加済み',
    worldRank: (rank) => `世界#${rank}`,
    missingSmart: '公開された総合知能の成績はまだない。未測定は賢くないという意味ではない。',
    missingCode: '公開されたコーディング評価の成績が見つからない。不明は書けないという意味ではない。',
    missingMemory: 'コンテキストウィンドウは非公開。',
    missingCheap: 'テキスト出力の公表価格なし。',
    smartTitle: (eci, total, rank) =>
      `総合知能指数 ${eci}、成績のある${total}モデル中${rank}位。\n出典：Epoch AI Capabilities Index。`,
    codeRankedLine: (poolSize, rank) =>
      `同じベンチマークで同じ種類の測定者に測られた${poolSize}モデル中${rank}位。\n`,
    codeSmallPoolLine: (poolSize) =>
      `同じリーグ・同じ測定者で成績のあるモデルは${poolSize}件のみ。サンプルが少なすぎて段階を付けない。\n`,
    selfReportedNote: 'ベンダー自己申告、独立した検証なし。',
    thirdPartyNote: '第三者による実測。',
    poolNote:
      '段階はこのリーグ内でのみ計算——評価ハーネスが変われば同じモデルでも20〜30点変わるため、ここでは点数ではなく順位を表示。',
    memoryTitle: (ctx, chars, total, percentile) =>
      `コンテキストウィンドウ ${ctx} tokens、約${chars}漢字。\nウィンドウが判明している${total}モデル中 第${percentile}パーセンタイル。`,
    cheapTitle: (price, total, percent) =>
      `出力100万トークンあたり${price}ドル。\n公表価格のある${total}のテキストモデルのうち${percent}%より安い。`,
  },

  champions: {
    smartDetail: (count) => `総合知能指数、テスト済み${count}モデル中1位`,
    topPercent: (n) => `上位${n}%`,
    codeDetail: (leagues) => `第三者コーディングベンチマーク${leagues}件の平均順位が最高`,
    valueDetail: (rank) => `知能世界#${rank}、価格は同格より大幅に安い`,
    cheapDetail: '第三者評価の成績があるモデルの中で出力が最安',
    memoryDetail: 'コンテキストウィンドウ：一度に読み込める文字数',
    daysAgo: (days) => (days <= 0 ? '今日' : `${days}日前`),
    releasedOn: (date) => `${date} リリース`,
    eastDetail: (rank) => `中国トップ、世界#${rank}`,
    openDetail: (rank) => `オープンソースNo.1、世界#${rank}`,
  },

  traits: {
    label: {
      strongest: '世界一',
      top5: 'トップ5',
      top10: 'トップ10',
      'best-coder': 'コーディングNo.1',
      coder: 'コーディング上手',
      'best-memory': '記憶力No.1',
      million: '100万トークン記憶',
      'best-value': 'コスパ王',
      cheapest: '最安',
      cheap: '激安',
      costly: '超高価',
      newborn: '生まれたて',
      elder: '古参',
      retired: '引退済み',
      open: 'オープン',
      reasoning: '熟考型',
    },
    strongestTitle: '総合知能指数で世界一',
    topNTitle: (rank) => `総合知能 第${rank}位`,
    bestCoderTitle: '第三者コーディングベンチマークの平均順位で世界一',
    coderTitle: (rank) => `第三者コーディングベンチマーク平均順位 第${rank}位`,
    bestMemoryTitle: 'コンテキストウィンドウ世界最大',
    millionTitle: 'コンテキストウィンドウが100万トークンに到達',
    bestValueTitle: (rank) => `1ドルあたりの知能で第${rank}位`,
    cheapestTitle: '出力単価が世界最安',
    cheapTitle: '出力単価が最も安い15%に入る',
    costlyTitle: '出力単価が最も高い5%に入る',
    newbornTitle: (days) => `${days}日前にリリース`,
    elderTitle: (years) => `リリースから${years}年以上`,
    retiredTitle: (date) => `${date} に提供終了`,
    openTitle: 'ウェイト公開、セルフホスト可能',
    reasoningTitle: '推論型モデル、回答前に考える',
  },

  search: {
    concepts: [
      {
        id: 'multimodal',
        dimension: 'kind',
        value: 'multimodal',
        label: 'マルチモーダル',
        hint: 'テキストのみ以外の全て：画像を見る、音を聞く、画像・動画を生成',
        keywords: ['マルチモーダル', 'multimodal', 'mm'],
      },
      {
        id: 'vision',
        dimension: 'kind',
        value: 'vision',
        label: 'ビジョン',
        hint: '画像や動画を見て、テキストを出力',
        keywords: ['ビジョン', '画像理解', 'vision', 'vl', 'vlm'],
      },
      {
        id: 'omni',
        dimension: 'kind',
        value: 'omni',
        label: 'オムニ',
        hint: '音声も画像もわかる',
        keywords: ['オムニ', 'omni'],
      },
      {
        id: 'image-gen',
        dimension: 'kind',
        value: 'image-gen',
        label: '画像生成',
        hint: '出力に画像を含む',
        keywords: ['画像生成', 'imagegen', 'texttoimage', 't2i'],
      },
      {
        id: 'video-gen',
        dimension: 'kind',
        value: 'video-gen',
        label: '動画生成',
        hint: '出力に動画を含む',
        keywords: ['動画生成', 'videogen', 'texttovideo', 't2v'],
      },
      {
        id: 'speech',
        dimension: 'kind',
        value: 'speech',
        label: '音声',
        hint: '音声認識・音声合成、または音声だけの対話',
        keywords: ['音声', '音声認識', '音声合成', 'speech', 'audio', 'tts', 'asr', 'voice'],
      },
      {
        id: 'text',
        dimension: 'kind',
        value: 'text',
        label: 'テキスト',
        hint: 'テキストだけ読み書きする',
        keywords: ['テキスト', 'テキストのみ', 'text', 'llm'],
      },
      {
        id: 'open',
        dimension: 'weights',
        value: 'open',
        label: 'オープン',
        hint: 'ウェイト公開、セルフホスト可能',
        keywords: ['オープン', 'オープンソース', 'オープンウェイト', 'open', 'opensource', 'openweights'],
      },
      {
        id: 'closed',
        dimension: 'weights',
        value: 'closed',
        label: 'クローズド',
        hint: 'ウェイト非公開、APIのみ',
        keywords: ['クローズド', '非公開', 'closed', 'proprietary'],
      },
      {
        id: 'east',
        dimension: 'region',
        value: 'east',
        label: '中国',
        hint: '本社が中国（香港・マカオ・台湾を含む）の企業',
        keywords: ['中国', '中国製', 'china', 'chinese'],
      },
      {
        id: 'west',
        dimension: 'region',
        value: 'west',
        label: '海外',
        hint: '本社が中国以外の企業',
        keywords: ['海外', '国外', 'foreign', 'overseas', 'global'],
      },
    ],
    trackShortcuts: [
      {
        id: 'context',
        label: 'コンテキスト最長',
        hint: '一度に読み込める文字数で並べ替え',
        keywords: ['コンテキスト', '長文', '記憶', 'context', 'longcontext'],
      },
      {
        id: 'cheapest',
        label: '最安',
        hint: '出力単価の安い順',
        keywords: ['安い', '最安', '価格', 'cheap', 'cheapest', 'price'],
      },
      {
        id: 'value',
        label: '最高コスパ',
        hint: '同等の知能での価格優位で並べ替え',
        keywords: ['コスパ', 'お得', 'value'],
      },
      {
        id: 'newest',
        label: '最新リリース',
        hint: 'リリース日の新しい順',
        keywords: ['最新', '新着', 'newest', 'latest', 'new'],
      },
    ],
    hintSep: '；',
  },

  insights: {
    modality: { text: 'テキスト', image: '画像', audio: '音声', video: '動画', pdf: 'ファイル' },
    joinList: (items) => items.join('・'),
    benchWinVs: (label, mine, runner) => `${label}：${mine} 対 ${runner}`,
    benchWinFirst: (label, mine) => `${label} 1位：${mine}`,
    soloRank: (label, rank, text, poolSize) => `${label} 全体${rank}位：${text}（${poolSize}モデル）`,
    cheaperVs: (percent, mine, next) => `出力価格が${percent}%安い：${mine} 対 ${next}`,
    cheapestSolo: (usd) => `出力価格が最安：${usd} / 100万トークン`,
    longerCtxVs: (mine, next) => `コンテキストがより長い：${mine} 対 ${next}`,
    longestCtx: (mine) => `コンテキスト最長：${mine}`,
    longerOutVs: (mine, next) => `単次出力がより長い：${mine} 対 ${next}`,
    longestOut: (mine) => `単次出力最長：${mine}`,
    newerCutoffVs: (mine, other) => `知識が新しい：カットオフ${mine}、相手は${other}`,
    newestCutoff: (mine) => `知識が最新：カットオフ${mine}`,
    openWeightsText: 'オープンウェイト、セルフホスト可能',
    canRead: (mods, duel) => `${mods.join('・')}が読める${duel ? '、相手は不可' : ''}`,
    canGenerate: (mods) => `${mods.join('・')}を生成できる`,
    reasoningModeText: '深い思考モードあり',
    officialSuffix: '（公式発表）',
    selfReportSuffix: '（ベンダー自己申告）',
    presetTop2: '総合知能トップ2',
    presetEastWest: '海外トップ対中国トップ',
    presetOpenClosed: 'クローズドNo.1対オープンNo.1',
    presetNewest: '最新リリース同士',
  },

  format: {
    minutes: (n) => `${n}分`,
    hours: (n) => `${n}時間`,
    days: (n) => `${n}日`,
    perMTok: (price) => `$${price} / 100万トークン`,
    yearOnly: (year) => `${year}年`,
    fullDate: (year, month, day) => `${year}年${month}月${day}日`,
    activeParams: (activeB) => `（アクティブ ${activeB}B）`,
    paramsInferred: ' · 型番から推定',
    yes: 'はい',
    no: 'いいえ',
    modality: { text: 'テキスト', image: '画像', audio: '音声', video: '動画', pdf: 'ファイル' },
    joinList: (items) => items.join('、'),
  },
};

const ko: LibDict = {
  persona: {
    superlative: {
      intelligence: '가장 똑똑한',
      coding: '코딩을 가장 잘하는',
      memory: '기억력이 가장 좋은',
      value: '가성비가 가장 좋은',
      cheap: '가장 저렴한',
    },
    domainPrefix: {
      all: '전 세계에서',
      open: '오픈소스 모델 중에서',
      east: '중국 기업 중에서',
      west: '해외 기업 중에서',
      million: '100만 토큰 컨텍스트 모델 중에서',
      vision: '이미지를 이해하는 모델 중에서',
      top10: '톱10 중에서',
    },
    champion: (prefix, superlative) => `${prefix} ${superlative} 모델`,
    priceWords: ['초저가', '저렴', '중간 가격', '다소 비쌈', '초고가'],
    memoryWords: ['기억력 짧음', '기억력 보통', '기억력 좋음', '기억력 아주 좋음', '장문 독해 가능'],
    contextAnchors: [
      '장편소설 전 시리즈를 한 번에 읽을 수 있음',
      '해리 포터 전 7권을 한 번에 읽을 수 있음',
      '『삼체』 3부작을 한 번에 읽을 수 있음',
      '『삼체』 한 권을 한 번에 읽을 수 있음',
      '중편소설 한 권을 한 번에 읽을 수 있음',
      '긴 논문 한 편을 한 번에 읽을 수 있음',
      '한 번에 몇천 자 정도만 읽을 수 있음',
    ],
    fallback: '업스트림에 기본 정보만 수록되어 있고 공개된 평가 성적이 아직 없음',
    visionCapable: '이미지를 볼 수 있는',
    reasoningCapable: '깊이 생각하는',
    ranked: (rank, extras) =>
      `종합 지능 세계 ${rank}위${extras.length > 0 ? `, ${extras.join(', ')}` : ''}`,
    describe: (bits, openWeights) => `${bits.join(', ')} ${openWeights ? '오픈소스 ' : ''}모델`,
  },

  aptitude: {
    bars: {
      smart: { label: '똑똑함', blurb: '종합 지능. Epoch AI의 Capabilities Index를 사용. 10여 개 학술 평가를 하나의 점수로 통합한 것.' },
      code: { label: '코딩', blurb: '코드를 작성하고 소프트웨어 엔지니어링을 하는 능력. 이 모델에 대해 가장 신뢰할 수 있는 코딩 평가를 사용.' },
      memory: { label: '기억력', blurb: '컨텍스트 윈도우. 한 번에 읽을 수 있는 분량. 클수록 긴 문서나 코드베이스 전체를 한 번에 읽을 수 있음.' },
      cheap: { label: '저렴함', blurb: '출력 100만 토큰당 가격. 바가 길수록 저렴.' },
    },
    verdicts: ['입문', '약함', '보통', '강함', '최상위'],
    priceVerdicts: ['초고가', '다소 비쌈', '적정', '저렴', '초저렴'],
    entered: '참가함',
    worldRank: (rank) => `세계 #${rank}`,
    missingSmart: '공개된 종합 지능 성적이 아직 없음. 측정되지 않았다고 해서 똑똑하지 않다는 뜻은 아님.',
    missingCode: '공개된 코딩 평가 성적을 찾지 못함. 모른다고 해서 못 쓴다는 뜻은 아님.',
    missingMemory: '컨텍스트 윈도우 미공개.',
    missingCheap: '텍스트 출력 공개 가격 없음.',
    smartTitle: (eci, total, rank) =>
      `종합 지능 지수 ${eci}, 성적이 있는 ${total}개 모델 중 ${rank}위.\n출처: Epoch AI Capabilities Index.`,
    codeRankedLine: (poolSize, rank) =>
      `같은 벤치마크에서 같은 유형의 측정자로 측정된 ${poolSize}개 모델 중 ${rank}위.\n`,
    codeSmallPoolLine: (poolSize) =>
      `같은 리그·같은 측정자로 성적이 있는 모델이 ${poolSize}개뿐이라 표본이 적어 등급을 부여하지 않음.\n`,
    selfReportedNote: '벤더 자체 보고, 독립 검증 없음.',
    thirdPartyNote: '제3자 실측.',
    poolNote:
      '등급은 이 리그 내부에서만 계산됨 — 평가 하네스가 바뀌면 같은 모델도 20~30점 차이가 날 수 있으므로 점수 대신 순위를 표시.',
    memoryTitle: (ctx, chars, total, percentile) =>
      `컨텍스트 윈도우 ${ctx} tokens, 약 ${chars} 한자.\n윈도우가 알려진 ${total}개 모델 중 ${percentile}번째 백분위.`,
    cheapTitle: (price, total, percent) =>
      `출력 100만 토큰당 ${price}달러.\n가격이 공개된 ${total}개 텍스트 모델 중 ${percent}%보다 저렴.`,
  },

  champions: {
    smartDetail: (count) => `종합 지능 지수, 테스트된 ${count}개 모델 중 1위`,
    topPercent: (n) => `상위 ${n}%`,
    codeDetail: (leagues) => `제3자 코딩 벤치마크 ${leagues}개 평균 순위 최고`,
    valueDetail: (rank) => `지능 세계 #${rank}, 가격은 동급 대비 훨씬 저렴`,
    cheapDetail: '제3자 평가 성적이 있는 모델 중 출력 최저가',
    memoryDetail: '컨텍스트 윈도우: 한 번에 읽을 수 있는 분량',
    daysAgo: (days) => (days <= 0 ? '오늘' : `${days}일 전`),
    releasedOn: (date) => `${date} 출시`,
    eastDetail: (rank) => `중국 1위, 세계 #${rank}`,
    openDetail: (rank) => `오픈소스 1위, 세계 #${rank}`,
  },

  traits: {
    label: {
      strongest: '세계 1위',
      top5: '톱5',
      top10: '톱10',
      'best-coder': '코딩 1위',
      coder: '코딩 강자',
      'best-memory': '기억력 최고',
      million: '100만 토큰 기억',
      'best-value': '가성비 왕',
      cheapest: '전체 최저가',
      cheap: '초저가',
      costly: '초고가',
      newborn: '갓 태어남',
      elder: '원로',
      retired: '은퇴함',
      open: '오픈소스',
      reasoning: '깊이 생각함',
    },
    strongestTitle: '종합 지능 지수 세계 1위',
    topNTitle: (rank) => `종합 지능 ${rank}위`,
    bestCoderTitle: '제3자 코딩 벤치마크 평균 순위 세계 1위',
    coderTitle: (rank) => `제3자 코딩 벤치마크 평균 순위 ${rank}위`,
    bestMemoryTitle: '컨텍스트 윈도우 세계 최대',
    millionTitle: '컨텍스트 윈도우 100만 토큰 달성',
    bestValueTitle: (rank) => `1달러당 지능 ${rank}위`,
    cheapestTitle: '출력 단가 세계 최저',
    cheapTitle: '출력 단가 최저 15% 구간',
    costlyTitle: '출력 단가 최고가 5% 구간',
    newbornTitle: (days) => `${days}일 전 출시`,
    elderTitle: (years) => `출시 ${years}년 이상 경과`,
    retiredTitle: (date) => `${date} 서비스 종료`,
    openTitle: '가중치 공개, 직접 배포 가능',
    reasoningTitle: '추론형 모델, 답하기 전에 먼저 생각함',
  },

  search: {
    concepts: [
      {
        id: 'multimodal',
        dimension: 'kind',
        value: 'multimodal',
        label: '멀티모달',
        hint: '순수 텍스트 외 전부: 그림을 보고, 소리를 듣고, 이미지·영상을 생성',
        keywords: ['멀티모달', 'multimodal', 'mm'],
      },
      {
        id: 'vision',
        dimension: 'kind',
        value: 'vision',
        label: '비전',
        hint: '이미지나 영상을 보고 텍스트로 출력',
        keywords: ['비전', '이미지이해', 'vision', 'vl', 'vlm'],
      },
      {
        id: 'omni',
        dimension: 'kind',
        value: 'omni',
        label: '옴니',
        hint: '소리도 듣고 화면도 봄',
        keywords: ['옴니', 'omni'],
      },
      {
        id: 'image-gen',
        dimension: 'kind',
        value: 'image-gen',
        label: '이미지 생성',
        hint: '출력에 이미지 포함',
        keywords: ['이미지생성', 'imagegen', 'texttoimage', 't2i'],
      },
      {
        id: 'video-gen',
        dimension: 'kind',
        value: 'video-gen',
        label: '영상 생성',
        hint: '출력에 영상 포함',
        keywords: ['영상생성', '비디오생성', 'videogen', 'texttovideo', 't2v'],
      },
      {
        id: 'speech',
        dimension: 'kind',
        value: 'speech',
        label: '음성',
        hint: '음성 인식, 음성 합성 또는 듣기만 하는 음성 대화',
        keywords: ['음성', '음성인식', '음성합성', 'speech', 'audio', 'tts', 'asr', 'voice'],
      },
      {
        id: 'text',
        dimension: 'kind',
        value: 'text',
        label: '텍스트',
        hint: '텍스트만 읽고 씀',
        keywords: ['텍스트', '텍스트만', 'text', 'llm'],
      },
      {
        id: 'open',
        dimension: 'weights',
        value: 'open',
        label: '오픈소스',
        hint: '가중치 공개, 직접 배포 가능',
        keywords: ['오픈소스', '오픈웨이트', 'open', 'opensource', 'openweights'],
      },
      {
        id: 'closed',
        dimension: 'weights',
        value: 'closed',
        label: '클로즈드',
        hint: '가중치 비공개, API만 가능',
        keywords: ['클로즈드', '비공개', 'closed', 'proprietary'],
      },
      {
        id: 'east',
        dimension: 'region',
        value: 'east',
        label: '중국',
        hint: '본사가 중국(홍콩·마카오·대만 포함)인 기업',
        keywords: ['중국', '중국산', 'china', 'chinese'],
      },
      {
        id: 'west',
        dimension: 'region',
        value: 'west',
        label: '해외',
        hint: '본사가 중국 밖인 기업',
        keywords: ['해외', '외국', 'foreign', 'overseas', 'global'],
      },
    ],
    trackShortcuts: [
      {
        id: 'context',
        label: '가장 긴 컨텍스트',
        hint: '한 번에 읽을 수 있는 분량 순',
        keywords: ['컨텍스트', '긴컨텍스트', '기억', 'context', 'longcontext'],
      },
      {
        id: 'cheapest',
        label: '최저가',
        hint: '출력 단가 낮은 순',
        keywords: ['저렴', '최저가', '가격', 'cheap', 'cheapest', 'price'],
      },
      {
        id: 'value',
        label: '최고 가성비',
        hint: '동일 지능 대비 가격 우위 순',
        keywords: ['가성비', 'value'],
      },
      {
        id: 'newest',
        label: '최신 출시',
        hint: '출시일 최신순',
        keywords: ['최신', '새로운', 'newest', 'latest', 'new'],
      },
    ],
    hintSep: '; ',
  },

  insights: {
    modality: { text: '텍스트', image: '이미지', audio: '음성', video: '영상', pdf: '파일' },
    joinList: (items) => items.join(', '),
    benchWinVs: (label, mine, runner) => `${label}: ${mine} 대 ${runner}`,
    benchWinFirst: (label, mine) => `${label} 1위: ${mine}`,
    soloRank: (label, rank, text, poolSize) => `${label} 전체 ${rank}위: ${text}(${poolSize}개 모델)`,
    cheaperVs: (percent, mine, next) => `출력 가격 ${percent}% 저렴: ${mine} 대 ${next}`,
    cheapestSolo: (usd) => `최저 출력 가격: ${usd} / 100만 토큰`,
    longerCtxVs: (mine, next) => `더 긴 컨텍스트: ${mine} 대 ${next}`,
    longestCtx: (mine) => `가장 긴 컨텍스트: ${mine}`,
    longerOutVs: (mine, next) => `더 긴 단일 출력: ${mine} 대 ${next}`,
    longestOut: (mine) => `가장 긴 단일 출력: ${mine}`,
    newerCutoffVs: (mine, other) => `더 최신 지식: 컷오프 ${mine}, 상대는 ${other}`,
    newestCutoff: (mine) => `가장 최신 지식: 컷오프 ${mine}`,
    openWeightsText: '오픈 웨이트, 직접 배포 가능',
    canRead: (mods, duel) => `${mods.join(', ')} 읽기 가능${duel ? ', 상대는 불가' : ''}`,
    canGenerate: (mods) => `${mods.join(', ')} 생성 가능`,
    reasoningModeText: '깊은 사고 모드 있음',
    officialSuffix: ' (공식 발표)',
    selfReportSuffix: ' (벤더 자체 보고)',
    presetTop2: '종합 지능 상위 2인',
    presetEastWest: '해외 1위 대 중국 1위',
    presetOpenClosed: '클로즈드 1위 대 오픈 1위',
    presetNewest: '최신 출시',
  },

  format: {
    minutes: (n) => `${n}분`,
    hours: (n) => `${n}시간`,
    days: (n) => `${n}일`,
    perMTok: (price) => `$${price} / 100만 토큰`,
    yearOnly: (year) => `${year}년`,
    fullDate: (year, month, day) => `${year}년 ${month}월 ${day}일`,
    activeParams: (activeB) => ` (활성 ${activeB}B)`,
    paramsInferred: ' · 모델명에서 추론',
    yes: '예',
    no: '아니요',
    modality: { text: '텍스트', image: '이미지', audio: '음성', video: '영상', pdf: '파일' },
    joinList: (items) => items.join(', '),
  },
};

/** 四语言齐备由 Record<Lang, LibDict> 强制，漏译编译报错。 */
export const libDict: Record<Lang, LibDict> = { zh, en, ja, ko };
