/**
 * 页面层字典：各页面专属的标题、说明、空态与表头文案。
 *
 * 规则（docs/I18N.md）：
 * - 新增 key 必须四语言一次写全，Record<Lang, PagesDict> 强制；
 * - zh 一律逐字复制改造前的原文（中文版渲染逐字节不变是第一目标）；
 * - 榜单名 / 厂商名不翻（SWE-bench Verified、OpenAI…），说明文字翻译；
 * - 「国外/国内」按读者视角译 Global / China（core-dict 已处理，这里不重复）。
 */

import type { Lang } from './types';

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface PagesDict {
  /** 首页 */
  home: {
    /** 样本数据提示中 <code> 之前的部分（含末尾空格） */
    sampleNoticeBefore: string;
    /** 样本数据提示中 <code> 之后的部分（含开头空格） */
    sampleNoticeAfter: string;
    /** 顶栏状态行里的更新日期（只有月日） */
    updatedDate: (month: number, day: number) => string;
  };

  /** 时间线页与厂商页共用 */
  timeline: {
    /** 年月分组标题。zh 是 2026.09，其余语言按各自语序 */
    monthHeading: (year: number, month: number) => string;
    /** 当月发布数量 */
    releases: (n: number) => string;
  };

  /** 时间线页 */
  chronicle: {
    intro: (total: number) => string;
    /** 牌子悬停：厂商 · 日期（+ 仅精确到月） */
    titleDate: (date: string, monthOnly: boolean) => string;
  };

  /** 对比页 */
  compare: {
    title: string;
  };

  /** 排行榜页 */
  leaderboard: {
    intro: (tracks: number, models: number) => string;
    viewAll: (n: number) => string;
    dataNote: string;
  };

  /** 全部模型总表页 */
  allModels: {
    title: string;
    intro: (total: number, alive: number) => string;
    back: string;
    dataNote: string;
  };

  /** 模型详情页 */
  model: {
    /** 找不到模型时的 metadata 标题 */
    unknownResident: string;
    /** metadata 描述。ctx / price 为 null 时各语言用自己的「未知」措辞 */
    metaDescription: (vendor: string, name: string, ctx: number | null, price: number | null) => string;
    /** 名牌上厂商链接 */
    vendorModels: (vendor: string) => string;
    /** 名牌上的综合智力名次 */
    eciRank: (rank: number) => string;
    /** 名牌上的类型入口，如「视觉模型」 */
    kindModels: (label: string) => string;
    /** 上下文换算成体感的那行小字 */
    memoryAnchor: (anchor: string) => string;
    roomTitle: string;
    computerTitle: (label: string) => string;
    /** 电脑各档位的悬停说明 */
    computerLabels: {
      none: string;
      crt: string;
      laptop: string;
      dual: string;
      battlestation: string;
    };
    /** 电脑下方的赛制说明（与 ModelRoom 的 SWE_LEAGUE 同名对照） */
    computerLeague: {
      epoch: string;
      vendor: string;
      proScale: string;
      proVendor: string;
    };
    noCodingScores: string;
    pieceComputer: string;
    pieceShelf: string;
    pieceBlackboard: string;
    pieceCalendar: string;
    pieceFridge: string;
    shelfValue: (shelf: number, ctx: string) => string;
    noShelf: string;
    blackboardScored: string;
    blackboardEmpty: string;
    blackboardTitle: string;
    calendarStopped: (cutoff: string) => string;
    calendarUnknown: string;
    calendarTitle: string;
    fridgeValue: string;
    fridgeTitle: string;
    gateOpenLabel: string;
    gateClosedLabel: string;
    gateOpenValue: string;
    gateClosedValue: string;
    gateOpenTitle: string;
    gateClosedTitle: string;
    originSection: string;
    battleSection: string;
    aimeLabel: string;
    gpqaLabel: string;
    arcLabel: string;
    fictionLabel: string;
    battleNote: string;
    codingLedgerTitle: string;
  };

  /** 厂商页 */
  vendor: {
    metaTitle: (name: string) => string;
    stats: (total: number, retired: number) => string;
    officialSite: string;
    /** 类型摘要导航的 aria-label */
    kindNavLabel: string;
    /** 类型 chip 的悬停提示：hint + 「点开是总表里筛好的名单」 */
    kindChipTitle: (hint: string) => string;
    unknownDate: string;
    /** 名牌小字的日期部分：day 为 null 时只精确到月 */
    shortDate: (month: number, day: number | null) => string;
    backToPlaza: string;
  };

  /** 素材署名页 */
  credits: {
    charactersTitle: string;
    charactersIntro: string;
    /** 借用形象的来历说明（人名 / 作品名不翻） */
    basis: {
      linuxdo: string;
      deepseek: string;
      zfox: string;
      grok: string;
      doubao: string;
    };
    dataTitle: string;
    epoch: string;
    metadataLine: string;
    livebench: string;
    arenaIntro: string;
    arenaDataset: string;
    arenaDatasetFallback: string;
    /** 数据集链接与 CC-BY 链接之间的分隔符 */
    arenaSep: string;
    arenaChanges: string;
    font: string;
  };

  /** 隐私与免责页 */
  privacy: {
    title: string;
    /** 「最后更新」一行 */
    updated: string;
    sections: { h: string; body: string; link?: { text: string; href: string } }[];
  };
}

const zh: PagesDict = {
  home: {
    sampleNoticeBefore: '当前显示的是本地样本数据。运行 ',
    sampleNoticeAfter: ' 获取真实数据。',
    updatedDate: (month, day) => `${month} 月 ${day} 日`,
  },

  timeline: {
    monthHeading: (year, month) => `${year}.${String(month).padStart(2, '0')}`,
    releases: (n) => `${n} 个发布`,
  },

  chronicle: {
    intro: (total) => `${total} 个模型按发布月份排列，最新的在上。彩色名字表示有第三方综合评测成绩。`,
    titleDate: (date, monthOnly) => `${date}${monthOnly ? '（仅精确到月）' : ''}`,
  },

  compare: {
    title: '模型对比',
  },

  leaderboard: {
    intro: (tracks, models) =>
      `分数全部来自第三方公开评测，按榜单分开比较，跨榜不混算。当前 ${tracks} 个榜单可开榜，覆盖 ${models} 个模型。`,
    viewAll: (n) => `查全部 ${n} 个模型 →`,
    dataNote:
      '分数来自 Epoch AI（CC-BY 4.0）、LiveBench（Apache-2.0）与 LMArena 官方数据集（CC-BY 4.0），每 12 小时同步一次。本站不使用 Artificial Analysis 的数据，它禁止再分发。',
  },

  allModels: {
    title: '全部模型',
    intro: (total, alive) =>
      `共 ${total} 个模型，其中 ${alive} 个在役。点列名排序，点模型名进房间。「—」表示没有公开数据，不是零。`,
    back: '← 回排行榜',
    dataNote:
      '综合智力来自 Epoch AI（CC-BY 4.0）；编程一列显示的是在同一赛制、同一测量方的模型里的分位档，原始分数与赛制见悬停提示与角色房间。本站不使用 Artificial Analysis 与 LMArena 的数据，前者禁止再分发，后者禁止自动化抓取。',
  },

  model: {
    unknownResident: '未知居民',
    metaDescription: (vendor, name, ctx, price) =>
      `${vendor}的${name}：上下文 ${ctx ?? '未知'} tokens，输出单价 ${price ?? '未知'} 美元每百万 tokens。数据每 12 小时自动同步。`,
    vendorModels: (vendor) => `${vendor}的全部模型 →`,
    eciRank: (rank) => `综合智力第 ${rank} 名`,
    kindModels: (label) => `${label}模型`,
    memoryAnchor: (anchor) => `记性换算成体感：${anchor}`,
    roomTitle: '她的房间',
    computerTitle: (label) => `编程能力：${label}`,
    computerLabels: {
      none: '盖着布的桌子',
      crt: '老式显像管',
      laptop: '一台笔记本',
      dual: '双屏工作站',
      battlestation: '多屏黑客洞',
    },
    computerLeague: {
      epoch: 'SWE-bench Verified · Epoch AI 统一复跑',
      vendor: 'SWE-bench Verified · 厂商自报，未经第三方复核',
      proScale: 'SWE-Bench Pro · Scale AI 官方榜',
      proVendor: 'SWE-Bench Pro · 厂商系统卡自评，未经第三方复核',
    },
    noCodingScores: '没有公开的编程评测成绩',
    pieceComputer: '电脑',
    pieceShelf: '书架',
    pieceBlackboard: '黑板',
    pieceCalendar: '日历',
    pieceFridge: '冰箱',
    shelfValue: (shelf, ctx) => `${shelf} 层 · 记忆 ${ctx}`,
    noShelf: '没有书架',
    blackboardScored: '数学与科学推理',
    blackboardEmpty: '一块空黑板',
    blackboardTitle: '数学与科学推理成绩',
    calendarStopped: (cutoff) => `知识停在 ${cutoff}`,
    calendarUnknown: '知识截止日期未公开',
    calendarTitle: '知识截止日期',
    fridgeValue: '支持上下文缓存，能存记忆',
    fridgeTitle: '上下文缓存',
    gateOpenLabel: '敞开的门',
    gateClosedLabel: '门禁',
    gateOpenValue: '开源权重，谁都能进',
    gateClosedValue: '闭源，权重不公开',
    gateOpenTitle: '开源权重',
    gateClosedTitle: '闭源',
    originSection: '身世',
    battleSection: '战绩',
    aimeLabel: 'AIME 数学',
    gpqaLabel: 'GPQA Diamond 科学',
    arcLabel: 'ARC-AGI-2 抽象推理',
    fictionLabel: 'Fiction.liveBench 长文本',
    battleNote:
      '综合智力、数学、科学、抽象推理与长文本数据来自 Epoch AI（CC-BY 4.0）。写「未参赛」的项目表示该模型没有被这项评测收录，不代表它做不到——本站不会用估算值填补空缺。',
    codingLedgerTitle: '编程战绩（按赛制分列）',
  },

  vendor: {
    metaTitle: (name) => `${name}的全部模型`,
    stats: (total, retired) => `共 ${total} 个模型${retired > 0 ? ` · ${retired} 个已退役` : ''}`,
    officialSite: '官网 ↗',
    kindNavLabel: '按类型看这家的模型',
    kindChipTitle: (hint) => `${hint}。点开是总表里筛好的名单`,
    unknownDate: '发布日期不详',
    shortDate: (month, day) =>
      day != null
        ? `${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`
        : `${String(month).padStart(2, '0')} 月`,
    backToPlaza: '← 回到广场',
  },

  credits: {
    charactersTitle: '角色形象',
    charactersIntro:
      '全部角色都是本站手绘的原创像素画。没有公认娘化形象的厂商，按它的标志与品牌色设计；发饰上的标志是像素化的改写，只用于辨认，商标归各自所有者。下面这些形象借用了已有的设定：',
    basis: {
      linuxdo: 'linux.do 社区「AI娘们的互动小剧场」系列里的形象',
      deepseek: '社区二创形象「DeepSeek娘」',
      zfox: '社区流传的 Z.ai 黑狐娘形象',
      grok: 'xAI 在 Grok 里推出的官方二次元形象',
      doubao: '字节跳动豆包的官方 3D 形象',
    },
    dataTitle: '数据',
    epoch: '评测成绩：Epoch AI《AI Benchmarking Hub》，CC-BY 4.0。本站按榜单分列展示，不做跨榜混算。',
    metadataLine:
      '模型元数据（发布日期、定价、上下文）：models.dev，MIT；缺项时由 LiteLLM、OpenRouter、Vercel AI Gateway 公开目录补齐事实字段。',
    livebench: '编程分项：LiveBench，Apache-2.0。',
    arenaIntro: '竞技场成绩（文生图、文生视频、图像与视频编辑、文本、搜索、文档）：',
    arenaDataset: 'LMArena 官方榜单数据集',
    arenaDatasetFallback: 'LMArena 官方榜单数据集（lmarena-ai/leaderboard-dataset）',
    arenaSep: '，',
    arenaChanges:
      '。本站做过两处改动：把上游的模型名匹配到站内的模型条目，以及按本站的赛制分列重新排序；分数本身原样引用，未做换算。这些分数是真人盲投的偏好分，与学术评测不可比，因此单独成榜。',
    font: '中文像素字体：Fusion Pixel Font（缝合像素字体），OFL-1.1。',
  },

  privacy: {
    title: '隐私与免责',
    updated: '最后更新：2026-11-06',
    sections: [
      {
        h: '网站统计（Cloudflare Web Analytics）',
        body: '本站接入了 Cloudflare Web Analytics 来了解整体访问情况（页面浏览量、来源、设备与国家等聚合信息）。它不使用 Cookie、不收集 IP 地址等个人数据、不做跨站跟踪，所有数据都是聚合统计。详见',
        link: { text: 'Cloudflare 隐私政策', href: 'https://www.cloudflare.com/privacypolicy/' },
      },
      {
        h: '我们收集什么',
        body: '除上述聚合统计外，本站不收集任何个人信息：没有账号系统、没有表单、没有广告脚本与跟踪 Cookie。你的浏览行为不会被用于识别你个人——本站甚至没有一台能接收数据的应用服务器，所有页面都是构建期生成的静态文件。',
      },
      {
        h: '浏览器本地存储（localStorage）',
        body: '本站唯一会「记住」的东西是你的语言选择。点击语言切换器时，浏览器会把 amw-lang 这个键存进你设备的 localStorage，下次访问直接把你送到对应语言。它只保存在你的浏览器里，不随请求发出，本站无法读取。清除浏览器的站点数据即可删除。',
      },
      {
        h: '托管方（GitHub Pages）',
        body: '本站由 GitHub Pages 托管。访问时 GitHub 会依据其隐私声明记录标准的服务器日志（如 IP 地址、时间戳），用于安全与运维。详见',
        link: {
          text: 'GitHub General Privacy Statement',
          href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
        },
      },
      {
        h: '第三方链接',
        body: '站内大量链接指向第三方站点（榜单主页、厂商官网、Bilibili、YouTube 等）。点击之后的行为适用对方站点的隐私政策，与本站无关。',
      },
      {
        h: '数据准确性与免责',
        body: '站内分数与排名来自公开的第三方评测与厂商自报（自报均已明确标注），每 12 小时同步一次，可能存在滞后、转录误差或上游修正。所有名次与对比仅供参考，不构成任何购买或选型建议。模型与厂商名称为其各自所有者的商标，本站与任何厂商均无隶属关系。',
      },
      {
        h: '联系我们',
        body: '隐私或数据相关问题，欢迎在本站的 GitHub 仓库提交',
        link: { text: 'Issue', href: 'https://github.com/liyupi/ai-model-world/issues' },
      },
    ],
  },
};

const en: PagesDict = {
  home: {
    sampleNoticeBefore: 'Showing local sample data. Run ',
    sampleNoticeAfter: ' to fetch real data.',
    updatedDate: (month, day) => `${EN_MONTHS[month - 1]} ${day}`,
  },

  timeline: {
    monthHeading: (year, month) => `${EN_MONTHS[month - 1]} ${year}`,
    releases: (n) => `${n} released`,
  },

  chronicle: {
    intro: (total) =>
      `${total} models arranged by release month, newest first. Colored names have third-party general benchmark scores.`,
    titleDate: (date, monthOnly) => `${date}${monthOnly ? ' (month only)' : ''}`,
  },

  compare: {
    title: 'Compare Models',
  },

  leaderboard: {
    intro: (tracks, models) =>
      `All scores come from public third-party benchmarks, compared per benchmark and never mixed across them. ${tracks} benchmarks currently ranked, covering ${models} models.`,
    viewAll: (n) => `Browse all ${n} models →`,
    dataNote:
      'Scores come from Epoch AI (CC-BY 4.0), LiveBench (Apache-2.0), and the official LMArena dataset (CC-BY 4.0), synced every 12 hours. This site does not use Artificial Analysis data, which prohibits redistribution.',
  },

  allModels: {
    title: 'All Models',
    intro: (total, alive) =>
      `${total} models in total, ${alive} active. Click a column header to sort, a model name to enter its room. "—" means no public data, not zero.`,
    back: '← Back to leaderboard',
    dataNote:
      'General intelligence comes from Epoch AI (CC-BY 4.0). The coding column shows the percentile band among models in the same league measured by the same party; raw scores and leagues are in the hover tips and the model’s room. This site does not use data from Artificial Analysis or LMArena — the former prohibits redistribution, the latter prohibits automated scraping.',
  },

  model: {
    unknownResident: 'Unknown resident',
    metaDescription: (vendor, name, ctx, price) =>
      `${name} by ${vendor}: context window ${ctx ?? 'unknown'} tokens, output ${price != null ? `$${price}` : 'price unknown'} per million tokens. Data is synced automatically every 12 hours.`,
    vendorModels: (vendor) => `All models by ${vendor} →`,
    eciRank: (rank) => `Intelligence #${rank}`,
    kindModels: (label) => `${label} models`,
    memoryAnchor: (anchor) => `Memory in everyday terms: ${anchor}`,
    roomTitle: 'Her Room',
    computerTitle: (label) => `Coding ability: ${label}`,
    computerLabels: {
      none: 'A covered desk',
      crt: 'An old CRT',
      laptop: 'A laptop',
      dual: 'Dual-screen workstation',
      battlestation: 'Multi-screen battlestation',
    },
    computerLeague: {
      epoch: 'SWE-bench Verified · rerun by Epoch AI',
      vendor: 'SWE-bench Verified · vendor self-reported, not independently verified',
      proScale: 'SWE-Bench Pro · Scale AI official board',
      proVendor: 'SWE-Bench Pro · vendor system-card self-evaluation, not independently verified',
    },
    noCodingScores: 'No public coding benchmark results',
    pieceComputer: 'Computer',
    pieceShelf: 'Bookshelf',
    pieceBlackboard: 'Blackboard',
    pieceCalendar: 'Calendar',
    pieceFridge: 'Fridge',
    shelfValue: (shelf, ctx) => `${shelf} shelves · memory ${ctx}`,
    noShelf: 'No bookshelf',
    blackboardScored: 'Math & science reasoning',
    blackboardEmpty: 'An empty blackboard',
    blackboardTitle: 'Math & science reasoning scores',
    calendarStopped: (cutoff) => `Knowledge stops at ${cutoff}`,
    calendarUnknown: 'Knowledge cutoff undisclosed',
    calendarTitle: 'Knowledge cutoff',
    fridgeValue: 'Supports context caching — it can store memories',
    fridgeTitle: 'Context caching',
    gateOpenLabel: 'An open gate',
    gateClosedLabel: 'A locked gate',
    gateOpenValue: 'Open weights — anyone can enter',
    gateClosedValue: 'Closed source — weights not public',
    gateOpenTitle: 'Open weights',
    gateClosedTitle: 'Closed source',
    originSection: 'Origins',
    battleSection: 'Battle Record',
    aimeLabel: 'AIME Math',
    gpqaLabel: 'GPQA Diamond Science',
    arcLabel: 'ARC-AGI-2 Abstract Reasoning',
    fictionLabel: 'Fiction.liveBench Long Text',
    battleNote:
      'General intelligence, math, science, abstract reasoning, and long-text data come from Epoch AI (CC-BY 4.0). "Not ranked" means the model was not included in that benchmark — not that it cannot do it. This site never fills gaps with estimates.',
    codingLedgerTitle: 'Coding Record (by league)',
  },

  vendor: {
    metaTitle: (name) => `All models by ${name}`,
    stats: (total, retired) => `${total} models${retired > 0 ? ` · ${retired} retired` : ''}`,
    officialSite: 'Official site ↗',
    kindNavLabel: "Browse this vendor's models by type",
    kindChipTitle: (hint) => `${hint}. Click to see the filtered list in the full table`,
    unknownDate: 'Release date unknown',
    shortDate: (month, day) => (day != null ? `${EN_MONTHS[month - 1]} ${day}` : EN_MONTHS[month - 1]),
    backToPlaza: '← Back to the plaza',
  },

  credits: {
    charactersTitle: 'Character Artwork',
    charactersIntro:
      'All characters are original pixel art hand-drawn for this site. Vendors without a well-known gijinka persona are designed from their logo and brand colors; the logo hair accessories are pixelated reinterpretations for recognition only — trademarks belong to their respective owners. The following characters borrow existing designs:',
    basis: {
      linuxdo: 'Characters from the "AI娘们的互动小剧场" series in the linux.do community',
      deepseek: 'The community fan-made persona "DeepSeek娘"',
      zfox: 'The community-circulated Z.ai black-fox girl design',
      grok: 'The official anime-style persona xAI introduced in Grok',
      doubao: 'The official 3D persona of ByteDance’s Doubao',
    },
    dataTitle: 'Data',
    epoch: 'Benchmark scores: Epoch AI "AI Benchmarking Hub", CC-BY 4.0. Scores are listed per benchmark and never mixed across benchmarks.',
    metadataLine:
      'Model metadata (release date, pricing, context): models.dev, MIT; missing factual fields are filled from the public catalogs of LiteLLM, OpenRouter, and Vercel AI Gateway.',
    livebench: 'Coding scores: LiveBench, Apache-2.0.',
    arenaIntro: 'Arena scores (text-to-image, text-to-video, image & video editing, text, search, document): ',
    arenaDataset: 'the official LMArena leaderboard dataset',
    arenaDatasetFallback: 'the official LMArena leaderboard dataset (lmarena-ai/leaderboard-dataset)',
    arenaSep: ', ',
    arenaChanges:
      '. We made two changes: matching upstream model names to entries on this site, and re-sorting into this site’s per-league layout; the scores themselves are quoted unchanged. These are human blind-vote preference scores, not comparable to academic benchmarks, so they form their own leaderboards.',
    font: 'Chinese pixel font: Fusion Pixel Font, OFL-1.1.',
  },

  privacy: {
    title: 'Privacy & Disclaimer',
    updated: 'Last updated: 2026-11-06',
    sections: [
      {
        h: 'Site analytics (Cloudflare Web Analytics)',
        body: 'This site uses Cloudflare Web Analytics to understand overall traffic (aggregated page views, referrers, device types, and countries). It uses no cookies, collects no personal data such as IP addresses, and does not track you across sites — every metric is an aggregate statistic. See the',
        link: { text: 'Cloudflare Privacy Policy', href: 'https://www.cloudflare.com/privacypolicy/' },
      },
      {
        h: 'What we collect',
        body: 'Beyond the aggregate statistics above, this site collects no personal information: no accounts, no forms, no ad scripts, and no tracking cookies. Your browsing is never used to identify you — there isn’t even an application server that could receive your data; every page is a static file generated at build time.',
      },
      {
        h: 'Browser local storage',
        body: 'The only thing this site remembers is your language choice. When you use the language switcher, your browser stores a key called amw-lang in your device’s localStorage, so your next visit opens in that language. It stays in your browser, is never sent with requests, and we cannot read it. Clear your browser’s site data to remove it.',
      },
      {
        h: 'Hosting (GitHub Pages)',
        body: 'This site is hosted on GitHub Pages. GitHub records standard server logs (such as IP address and timestamp) under its own privacy statement, for security and operations. See the',
        link: {
          text: 'GitHub General Privacy Statement',
          href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
        },
      },
      {
        h: 'Third-party links',
        body: 'Pages link out to many third-party sites (benchmark homepages, vendor sites, Bilibili, YouTube, and more). Once you follow them, the destination site’s privacy policy applies, not ours.',
      },
      {
        h: 'Accuracy and disclaimer',
        body: 'Scores and rankings come from public third-party benchmarks and vendor self-reports (self-reported figures are always labeled), synced every 12 hours, and may lag, contain transcription errors, or be revised upstream. All rankings and comparisons are for reference only and do not constitute purchasing or selection advice. Model and vendor names are trademarks of their respective owners; this site is not affiliated with any vendor.',
      },
      {
        h: 'Contact',
        body: 'For privacy or data questions, please open an',
        link: { text: 'issue', href: 'https://github.com/liyupi/ai-model-world/issues' },
      },
    ],
  },
};

const ja: PagesDict = {
  home: {
    sampleNoticeBefore: '現在はローカルのサンプルデータを表示中。',
    sampleNoticeAfter: ' を実行して実データを取得。',
    updatedDate: (month, day) => `${month}月${day}日`,
  },

  timeline: {
    monthHeading: (year, month) => `${year}年${month}月`,
    releases: (n) => `${n}件のリリース`,
  },

  chronicle: {
    intro: (total) =>
      `${total}モデルをリリース月順に並べ、最新が上。色付きの名前は第三者の総合評価の成績あり。`,
    titleDate: (date, monthOnly) => `${date}${monthOnly ? '（月のみ）' : ''}`,
  },

  compare: {
    title: 'モデル比較',
  },

  leaderboard: {
    intro: (tracks, models) =>
      `スコアはすべて第三者の公開評価から。ベンチマークごとに比較し、跨いだ混算はしない。現在 ${tracks} 件のベンチマークが開榜可能で、${models} モデルをカバー。`,
    viewAll: (n) => `全${n}モデルを見る →`,
    dataNote:
      'スコアは Epoch AI（CC-BY 4.0）、LiveBench（Apache-2.0）、LMArena 公式データセット（CC-BY 4.0）から取得し、12時間ごとに同期。Artificial Analysis のデータは再配布が禁止されているため使用しない。',
  },

  allModels: {
    title: '全モデル',
    intro: (total, alive) =>
      `全${total}モデル、うち${alive}が現役。列名でソート、モデル名で部屋へ。「—」は公開データなし。ゼロではない。`,
    back: '← ランキングに戻る',
    dataNote:
      '総合知能は Epoch AI（CC-BY 4.0）より。コーディング列は同一リーグ・同一測定者のモデル内でのパーセンタイル帯を示す。元のスコアとリーグはホバーと部屋ページに記載。Artificial Analysis と LMArena のデータは使用しない。前者は再配布禁止、後者は自動取得禁止のため。',
  },

  model: {
    unknownResident: '不明な住人',
    metaDescription: (vendor, name, ctx, price) =>
      `${vendor}の${name}：コンテキスト ${ctx ?? '不明'} tokens、出力単価 ${price ?? '不明'} ドル/100万tokens。データは12時間ごとに自動同期。`,
    vendorModels: (vendor) => `${vendor}の全モデル →`,
    eciRank: (rank) => `総合知能 第${rank}位`,
    kindModels: (label) => `${label}モデル`,
    memoryAnchor: (anchor) => `記憶力を体感に換算：${anchor}`,
    roomTitle: '彼女の部屋',
    computerTitle: (label) => `コーディング能力：${label}`,
    computerLabels: {
      none: '布をかけた机',
      crt: '古いブラウン管',
      laptop: 'ノートPC',
      dual: 'デュアル画面ワークステーション',
      battlestation: 'マルチ画面ハッカー基地',
    },
    computerLeague: {
      epoch: 'SWE-bench Verified · Epoch AI 統一再現テスト',
      vendor: 'SWE-bench Verified · ベンダー自己申告・第三者未検証',
      proScale: 'SWE-Bench Pro · Scale AI 公式ボード',
      proVendor: 'SWE-Bench Pro · ベンダーのシステムカード自己評価・第三者未検証',
    },
    noCodingScores: '公開されたコーディング評価の成績なし',
    pieceComputer: 'パソコン',
    pieceShelf: '本棚',
    pieceBlackboard: '黒板',
    pieceCalendar: 'カレンダー',
    pieceFridge: '冷蔵庫',
    shelfValue: (shelf, ctx) => `${shelf}段 · 記憶 ${ctx}`,
    noShelf: '本棚なし',
    blackboardScored: '数学と科学の推論',
    blackboardEmpty: '空の黒板',
    blackboardTitle: '数学・科学推論の成績',
    calendarStopped: (cutoff) => `知識は ${cutoff} まで`,
    calendarUnknown: '知識カットオフ未公開',
    calendarTitle: '知識カットオフ',
    fridgeValue: 'コンテキストキャッシュ対応。記憶を保存できる',
    fridgeTitle: 'コンテキストキャッシュ',
    gateOpenLabel: '開いた門',
    gateClosedLabel: '閉じた門',
    gateOpenValue: 'オープンウェイト。誰でも入れる',
    gateClosedValue: 'クローズドソース。ウェイト非公開',
    gateOpenTitle: 'オープンウェイト',
    gateClosedTitle: 'クローズドソース',
    originSection: '出自',
    battleSection: '戦績',
    aimeLabel: 'AIME 数学',
    gpqaLabel: 'GPQA Diamond 科学',
    arcLabel: 'ARC-AGI-2 抽象推論',
    fictionLabel: 'Fiction.liveBench 長文',
    battleNote:
      '総合知能・数学・科学・抽象推論・長文のデータは Epoch AI（CC-BY 4.0）より。「未参加」はその評価に収録されていないという意味で、できないという意味ではない。当サイトは推定値で空白を埋めない。',
    codingLedgerTitle: 'コーディング戦績（リーグ別）',
  },

  vendor: {
    metaTitle: (name) => `${name}の全モデル`,
    stats: (total, retired) => `全${total}モデル${retired > 0 ? ` · うち${retired}は引退済み` : ''}`,
    officialSite: '公式サイト ↗',
    kindNavLabel: 'この企業のモデルをタイプで見る',
    kindChipTitle: (hint) => `${hint}。クリックすると一覧表で絞り込んだリストへ`,
    unknownDate: 'リリース日不明',
    shortDate: (month, day) => (day != null ? `${month}/${day}` : `${month}月`),
    backToPlaza: '← 広場に戻る',
  },

  credits: {
    charactersTitle: 'キャラクターデザイン',
    charactersIntro:
      'すべてのキャラクターは当サイトが手描きしたオリジナルのピクセルアート。公認の娘化イメージがない企業はロゴとブランドカラーからデザイン。髪飾りのロゴは識別のためのピクセル化した翻案で、商標は各所有者に帰属。以下のキャラクターは既存の設定を借りている：',
    basis: {
      linuxdo: 'linux.do コミュニティの「AI娘们的互动小剧场」シリーズのキャラクター',
      deepseek: 'コミュニティ二次創作キャラクター「DeepSeek娘」',
      zfox: 'コミュニティで流通している Z.ai の黒狐娘イメージ',
      grok: 'xAI が Grok で公開した公式二次元キャラクター',
      doubao: 'ByteDance 豆包（Doubao）の公式3Dキャラクター',
    },
    dataTitle: 'データ',
    epoch: '評価スコア：Epoch AI『AI Benchmarking Hub』、CC-BY 4.0。ベンチマークごとに表示し、跨いだ混算はしない。',
    metadataLine:
      'モデルのメタデータ（リリース日・価格・コンテキスト）：models.dev（MIT）。欠損項目は LiteLLM、OpenRouter、Vercel AI Gateway の公開カタログで事実フィールドを補完。',
    livebench: 'コーディング部門：LiveBench、Apache-2.0。',
    arenaIntro: 'アリーナ成績（テキストから画像・動画生成、画像・動画編集、テキスト、検索、ドキュメント）：',
    arenaDataset: 'LMArena 公式リーダーボードデータセット',
    arenaDatasetFallback: 'LMArena 公式リーダーボードデータセット（lmarena-ai/leaderboard-dataset）',
    arenaSep: '、',
    arenaChanges:
      '。当サイトでの変更は2点：上流のモデル名をサイト内のモデル条目に対応づけたことと、当サイトのリーグ別に並べ替えたこと。スコア自体は換算せずそのまま引用。これらは人間の盲投票による偏好スコアで、学術評価とは比較できないため独立したランキングとしている。',
    font: '中国語ピクセルフォント：Fusion Pixel Font、OFL-1.1。',
  },

  privacy: {
    title: 'プライバシーと免責',
    updated: '最終更新：2026-11-06',
    sections: [
      {
        h: 'アクセス解析（Cloudflare Web Analytics）',
        body: '本サイトではアクセス状況（ページビュー、参照元、デバイス、国などの集計情報）を把握するため、Cloudflare Web Analytics を利用しています。Cookie は使わず、IP アドレスなどの個人データは収集せず、サイト横断のトラッキングも行いません。すべて集計統計です。詳しくは',
        link: { text: 'Cloudflare プライバシーポリシー', href: 'https://www.cloudflare.com/privacypolicy/' },
      },
      {
        h: '収集するもの',
        body: '上記の集計統計を除き、本サイトは個人情報を一切収集しません。アカウント、フォーム、広告スクリプト、トラッキング Cookie はありません。閲覧行動が個人の特定に使われることはありません。そもそもデータを受け取るアプリケーションサーバーがなく、全ページはビルド時に生成された静的ファイルです。',
      },
      {
        h: 'ブラウザのローカルストレージ',
        body: '本サイトが「記憶」するのは言語選択だけです。言語スイッチャーを使うと、amw-lang というキーがお使いの端末の localStorage に保存され、次回アクセス時にその言語で開きます。ブラウザ内にのみ保存され、リクエストと共に送信されることはなく、私たちが読むこともできません。ブラウザのサイトデータを削除すれば消去できます。',
      },
      {
        h: 'ホスティング（GitHub Pages）',
        body: '本サイトは GitHub Pages でホストされています。アクセス時に GitHub がセキュリティと運用のため、独自のプライバシーステートメントに基づき標準的なサーバーログ（IP アドレスやタイムスタンプなど）を記録します。詳しくは',
        link: {
          text: 'GitHub General Privacy Statement',
          href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
        },
      },
      {
        h: '第三者リンク',
        body: '各ページには第三者サイト（ベンチマークの公式ページ、各社公式サイト、Bilibili、YouTube など）へのリンクが多数あります。遷移後の行動にはリンク先のプライバシーポリシーが適用され、本サイトとは関係ありません。',
      },
      {
        h: 'データの正確性と免責',
        body: 'スコアとランキングは公開の第三者ベンチマークおよびベンダー自己申告（自己申告は必ず明記）に由来し、12 時間ごとに同期されますが、遅延・転記ミス・上流の修正がありえます。順位と比較はあくまで参考情報であり、購入や選定の助言ではありません。モデル名・企業名はそれぞれの所有者の商標であり、本サイトはいかなるベンダーとも提携関係にありません。',
      },
      {
        h: '連絡先',
        body: 'プライバシーやデータに関するご質問は、GitHub リポジトリの',
        link: { text: 'Issue', href: 'https://github.com/liyupi/ai-model-world/issues' },
      },
    ],
  },
};

const ko: PagesDict = {
  home: {
    sampleNoticeBefore: '현재 로컬 샘플 데이터를 표시 중입니다. ',
    sampleNoticeAfter: '를 실행해 실제 데이터를 가져오세요.',
    updatedDate: (month, day) => `${month}월 ${day}일`,
  },

  timeline: {
    monthHeading: (year, month) => `${year}년 ${month}월`,
    releases: (n) => `${n}개 출시`,
  },

  chronicle: {
    intro: (total) =>
      `${total}개 모델을 출시 월별로 정렬했으며 최신이 위에 있습니다. 색이 있는 이름은 제3자 종합 평가 성적이 있는 모델입니다.`,
    titleDate: (date, monthOnly) => `${date}${monthOnly ? ' (월 단위)' : ''}`,
  },

  compare: {
    title: '모델 비교',
  },

  leaderboard: {
    intro: (tracks, models) =>
      `모든 점수는 제3자 공개 평가에서 가져오며, 벤치마크별로 비교하고 서로 섞지 않습니다. 현재 ${tracks}개 벤치마크가 개설 가능하며 ${models}개 모델을 커버합니다.`,
    viewAll: (n) => `전체 모델 ${n}개 보기 →`,
    dataNote:
      '점수는 Epoch AI(CC-BY 4.0), LiveBench(Apache-2.0), LMArena 공식 데이터셋(CC-BY 4.0)에서 가져오며 12시간마다 동기화됩니다. Artificial Analysis 데이터는 재배포가 금지되어 사용하지 않습니다.',
  },

  allModels: {
    title: '전체 모델',
    intro: (total, alive) =>
      `총 ${total}개 모델, 그중 ${alive}개가 현역입니다. 열 이름을 눌러 정렬하고, 모델 이름을 눌러 방으로 들어가세요. "—"는 공개 데이터가 없다는 뜻이며 0이 아닙니다.`,
    back: '← 리더보드로 돌아가기',
    dataNote:
      '종합 지능은 Epoch AI(CC-BY 4.0)에서 가져옵니다. 코딩 열은 같은 리그, 같은 측정 주체의 모델들 사이의 백분위 구간을 보여줍니다. 원래 점수와 리그는 호버 팁과 모델의 방에서 확인하세요. 이 사이트는 Artificial Analysis와 LMArena 데이터를 사용하지 않습니다. 전자는 재배포 금지, 후자는 자동화 수집 금지입니다.',
  },

  model: {
    unknownResident: '알 수 없는 주민',
    metaDescription: (vendor, name, ctx, price) =>
      `${vendor}의 ${name}: 컨텍스트 ${ctx ?? '알 수 없음'} tokens, 출력 단가 ${price ?? '알 수 없음'} USD/백만 tokens. 데이터는 12시간마다 자동 동기화됩니다.`,
    vendorModels: (vendor) => `${vendor}의 모든 모델 →`,
    eciRank: (rank) => `종합 지능 ${rank}위`,
    kindModels: (label) => `${label} 모델`,
    memoryAnchor: (anchor) => `기억력을 체감으로 환산: ${anchor}`,
    roomTitle: '그녀의 방',
    computerTitle: (label) => `코딩 능력: ${label}`,
    computerLabels: {
      none: '천을 덮은 책상',
      crt: '구형 CRT',
      laptop: '노트북',
      dual: '듀얼 스크린 워크스테이션',
      battlestation: '멀티 스크린 배틀스테이션',
    },
    computerLeague: {
      epoch: 'SWE-bench Verified · Epoch AI 통일 재실행',
      vendor: 'SWE-bench Verified · 벤더 자체 보고, 제3자 검증 없음',
      proScale: 'SWE-Bench Pro · Scale AI 공식 보드',
      proVendor: 'SWE-Bench Pro · 벤더 시스템 카드 자체 평가, 제3자 검증 없음',
    },
    noCodingScores: '공개된 코딩 평가 성적 없음',
    pieceComputer: '컴퓨터',
    pieceShelf: '책장',
    pieceBlackboard: '칠판',
    pieceCalendar: '달력',
    pieceFridge: '냉장고',
    shelfValue: (shelf, ctx) => `${shelf}단 · 기억 ${ctx}`,
    noShelf: '책장 없음',
    blackboardScored: '수학·과학 추론',
    blackboardEmpty: '빈 칠판',
    blackboardTitle: '수학·과학 추론 성적',
    calendarStopped: (cutoff) => `지식은 ${cutoff}까지`,
    calendarUnknown: '지식 컷오프 미공개',
    calendarTitle: '지식 컷오프',
    fridgeValue: '컨텍스트 캐싱 지원, 기억 저장 가능',
    fridgeTitle: '컨텍스트 캐시',
    gateOpenLabel: '열린 문',
    gateClosedLabel: '닫힌 문',
    gateOpenValue: '오픈 웨이트, 누구나 들어올 수 있음',
    gateClosedValue: '클로즈드 소스, 가중치 비공개',
    gateOpenTitle: '오픈 웨이트',
    gateClosedTitle: '클로즈드 소스',
    originSection: '내력',
    battleSection: '전적',
    aimeLabel: 'AIME 수학',
    gpqaLabel: 'GPQA Diamond 과학',
    arcLabel: 'ARC-AGI-2 추상 추론',
    fictionLabel: 'Fiction.liveBench 장문',
    battleNote:
      '종합 지능, 수학, 과학, 추상 추론, 장문 데이터는 Epoch AI(CC-BY 4.0)에서 가져옵니다. "미참여"는 해당 평가에 포함되지 않았다는 뜻이며, 못한다는 뜻이 아닙니다. 이 사이트는 추정치로 빈칸을 채우지 않습니다.',
    codingLedgerTitle: '코딩 전적(리그별)',
  },

  vendor: {
    metaTitle: (name) => `${name}의 모든 모델`,
    stats: (total, retired) => `모델 ${total}개${retired > 0 ? ` · ${retired}개 은퇴` : ''}`,
    officialSite: '공식 사이트 ↗',
    kindNavLabel: '이 기업의 모델을 유형별로 보기',
    kindChipTitle: (hint) => `${hint}. 클릭하면 전체 표에서 필터링된 목록으로 이동`,
    unknownDate: '출시일 불명',
    shortDate: (month, day) => (day != null ? `${month}. ${day}.` : `${month}월`),
    backToPlaza: '← 광장으로 돌아가기',
  },

  credits: {
    charactersTitle: '캐릭터 디자인',
    charactersIntro:
      '모든 캐릭터는 이 사이트가 직접 그린 오리지널 픽셀 아트입니다. 공인된 모에화 이미지가 없는 기업은 로고와 브랜드 컬러로 디자인했으며, 머리 장식의 로고는 식별을 위한 픽셀화된 각색으로 상표권은 각 소유자에게 있습니다. 다음 캐릭터들은 기존 설정을 빌려왔습니다:',
    basis: {
      linuxdo: 'linux.do 커뮤니티의 「AI娘们的互动小剧场」 시리즈 캐릭터',
      deepseek: '커뮤니티 2차 창작 캐릭터 「DeepSeek娘」',
      zfox: '커뮤니티에 알려진 Z.ai 검은 여우 소녀 이미지',
      grok: 'xAI가 Grok에서 선보인 공식 2D 캐릭터',
      doubao: 'ByteDance Doubao의 공식 3D 캐릭터',
    },
    dataTitle: '데이터',
    epoch: '평가 점수: Epoch AI "AI Benchmarking Hub", CC-BY 4.0. 벤치마크별로 분리해 표시하며 서로 섞지 않습니다.',
    metadataLine:
      '모델 메타데이터(출시일, 가격, 컨텍스트): models.dev, MIT. 누락 항목은 LiteLLM, OpenRouter, Vercel AI Gateway 공개 카탈로그로 사실 필드를 보완합니다.',
    livebench: '코딩 부문: LiveBench, Apache-2.0.',
    arenaIntro: '아레나 성적(텍스트→이미지, 텍스트→동영상, 이미지·동영상 편집, 텍스트, 검색, 문서): ',
    arenaDataset: 'LMArena 공식 리더보드 데이터셋',
    arenaDatasetFallback: 'LMArena 공식 리더보드 데이터셋(lmarena-ai/leaderboard-dataset)',
    arenaSep: ', ',
    arenaChanges:
      '. 이 사이트에서 변경한 것은 두 가지입니다: 상류의 모델 이름을 사이트 내 모델 항목에 매칭한 것과 이 사이트의 리그별로 재정렬한 것입니다. 점수 자체는 변환 없이 그대로 인용합니다. 이 점수는 실제 사용자의 블라인드 투표 선호도 점수로 학술 평가와 비교할 수 없으므로 별도의 리더보드로 구성했습니다.',
    font: '중국어 픽셀 폰트: Fusion Pixel Font, OFL-1.1.',
  },

  privacy: {
    title: '개인정보 및 면책',
    updated: '최종 업데이트: 2026-11-06',
    sections: [
      {
        h: '사이트 분석(Cloudflare Web Analytics)',
        body: '이 사이트는 전체 방문 현황(페이지 조회수, 유입 경로, 기기, 국가 등 집계 정보)을 파악하기 위해 Cloudflare Web Analytics 를 사용합니다. 쿠키를 사용하지 않고 IP 주소 같은 개인 데이터를 수집하지 않으며 사이트 간 추적도 하지 않습니다. 모든 데이터는 집계 통계입니다. 자세한 내용은',
        link: { text: 'Cloudflare 개인정보 처리방침', href: 'https://www.cloudflare.com/privacypolicy/' },
      },
      {
        h: '수집하는 정보',
        body: '위의 집계 통계를 제외하면 이 사이트는 어떤 개인정보도 수집하지 않습니다. 계정도, 폼도, 광고 스크립트도, 추적 쿠키도 없습니다. 여러분의 열람 행위가 개인 식별에 사용되는 일은 없습니다. 애초에 데이터를 받을 애플리케이션 서버가 없으며, 모든 페이지는 빌드 시점에 생성된 정적 파일입니다.',
      },
      {
        h: '브라우저 로컬 스토리지',
        body: '이 사이트가 유일하게 「기억」하는 것은 언어 선택입니다. 언어 전환기를 사용하면 amw-lang 이라는 키가 기기의 localStorage 에 저장되어 다음 방문 때 해당 언어로 바로 열립니다. 브라우저 안에만 저장되며 요청과 함께 전송되지 않고 저희가 읽을 수도 없습니다. 브라우저의 사이트 데이터를 삭제하면 지워집니다.',
      },
      {
        h: '호스팅(GitHub Pages)',
        body: '이 사이트는 GitHub Pages 에서 호스팅됩니다. 방문 시 GitHub 이 보안과 운영을 위해 자체 개인정보 처리방침에 따라 표준 서버 로그(IP 주소, 타임스탬프 등)를 기록합니다. 자세한 내용은',
        link: {
          text: 'GitHub General Privacy Statement',
          href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
        },
      },
      {
        h: '제3자 링크',
        body: '각 페이지에는 제3자 사이트(벤치마크 홈페이지, 각 사 공식 사이트, Bilibili, YouTube 등)로 향하는 링크가 많습니다. 이동 후의 행위에는 해당 사이트의 개인정보 처리방침이 적용되며 본 사이트와는 무관합니다.',
      },
      {
        h: '데이터 정확성과 면책',
        body: '점수와 순위는 공개된 제3자 벤치마크와 벤더 자체 보고(자체 보고는 항상 표기)에서 비롯되며 12 시간마다 동기화되지만, 지연·전사 오류·상위 소스 수정이 있을 수 있습니다. 모든 순위와 비교는 참고용이며 구매나 선택에 대한 조언이 아닙니다. 모델명과 기업명은 각 소유자의 상표이며, 본 사이트는 어떤 벤더와도 제휴 관계가 없습니다.',
      },
      {
        h: '문의',
        body: '개인정보 또는 데이터 관련 문의는 GitHub 저장소의',
        link: { text: 'Issue', href: 'https://github.com/liyupi/ai-model-world/issues' },
      },
    ],
  },
};

/** 四语言齐备由 Record<Lang, PagesDict> 强制，漏译编译报错。 */
export const pagesDict: Record<Lang, PagesDict> = { zh, en, ja, ko };
