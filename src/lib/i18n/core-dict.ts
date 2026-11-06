/**
 * 核心字典：站名、导航、广场、类型、状态、页脚等全站共用文案。
 *
 * 架子的设计要点：所有页面文案都由结构化数据套模板生成，不展示上游返回的任何自由文本，
 * 所以增加一门语言 = 增加一份字典，不需要翻译服务，也不存在「新模型出现时某语言版滞后」的问题。
 * 视图组件一律接收 `lang` 参数；四语言齐备由 Record<Lang, CoreDict> 强制，漏译编译报错。
 *
 * 文案原则（第三次改版后定下来的）：
 *
 * 1. **直说**。界面文字负责让人一秒看懂，拟人化留给画面和角色。
 * 2. **不说废话**。用户点进来是看格局的，不是来听站点自述的。
 * 3. 保留少量有信息量的拟人词：「刚出生」比「新发布」多传达了「时间很短」的语气。
 *
 * 非中文版的两处视角换算（产品负责人确认）：
 * - 「国外/国内」→ Global / China（读者视角在海外）
 * - 「评测视频」链接 → YouTube（见 ReviewLinks 与 docs/I18N.md）
 */

import type { Lang } from './types';

export interface CoreDict {
  siteName: string;
  siteTagline: string;
  siteDescription: string;

  nav: {
    plaza: string;
    chronicle: string;
    leaderboard: string;
    compare: string;
  };

  /** 无障碍标签：只给读屏软件，不出现在视觉上 */
  a11y: {
    mainNav: string;
    pageNav: string;
  };

  continent: {
    west: string;
    east: string;
  };

  /** 擂台赛道名。键与 Benchmarks 的字段以及派生指标对应。 */
  track: {
    eci: string;
    swe_bench_verified: string;
    value: string;
    memory: string;
    cheap: string;
    hardcore: string;
    webdev_arena_elo: string;
  };

  /** 角色属性的展示标签 */
  attr: {
    releaseDate: string;
    knowledgeCutoff: string;
    contextWindow: string;
    maxOutput: string;
    inputPrice: string;
    outputPrice: string;
    params: string;
    license: string;
    openWeights: string;
    modalities: string;
    toolCall: string;
    reasoning: string;
    promptCaching: string;
    /** 模型类型（文本 / 视觉 / …），见 kind.ts */
    kind: string;
  };

  /**
   * 模型类型的名称与一句话解释。键对应 kind.ts 的 ModelKind。
   * 名称要短到能当筛选按钮，解释要让外行一眼明白判定依据。
   */
  kind: {
    label: Record<'text' | 'vision' | 'omni' | 'image-gen' | 'video-gen' | 'speech', string>;
    hint: Record<'text' | 'vision' | 'omni' | 'image-gen' | 'video-gen' | 'speech', string>;
    /** 上游没标模态时的兜底 */
    unknown: string;
    /** 筛选条上「类型」这一组的标题 */
    filterLabel: string;
    /** 跨类的「多模态」筛选：除纯文本以外的全部 */
    multimodal: string;
    multimodalHint: string;
    /** 首页「按类型看」那一块的标题 */
    sectionTitle: string;
    /** 每张类型卡上大数字后面的单位 */
    countUnit: string;
    /** 卡片悬停提示：「点开看全部 N 个 xx 模型」 */
    viewAll: (n: number, label: string) => string;
  };

  /** 数据缺失与可信度提示。这些措辞是这个站的诚信底线，改动需谨慎。 */
  unknown: {
    /** 完全拿不到参数量时的提示。对应角色身上的雾化斗篷。 */
    sizeEstimated: string;
    /** 有参数量但来自型号名推断而非官方权重文件时的提示 */
    sizeApprox: string;
    notRanked: string;
    noData: string;
    singleSource: string;
    /** 只被多源发现收录、缺少价格与上下文的模型 */
    incomplete: string;
    /** 只精确到月的发布日期 */
    monthOnly: (year: number, month: number) => string;
  };

  status: {
    newborn: string;
    retired: string;
    /** 距今天数 */
    ageDays: (days: number) => string;
    ageYears: (years: number) => string;
  };

  /** 头顶冠冕的说明 */
  crown: {
    gold: string;
    laurel: string;
    silver: string;
  };

  /** 首页广场 */
  plaza: {
    /** 区域标题后的计数 */
    vendorCount: (n: number) => string;
    /** 折叠区：数据太少、进不了默认广场的厂商 */
    moreVendors: (n: number) => string;
    /** 按厂商实力分的街区。分组依据见 roster.ts 的 tierOf */
    tier: {
      top: string;
      main: string;
      unscored: string;
    };
    tierHint: {
      top: string;
      main: string;
      unscored: string;
    };
    /** 本家有更新的型号、但它没资格换下门面时，屋子下面那条提示 */
    newer: (name: string) => string;
    newerHint: (name: string, date: string) => string;
  };

  /** 首屏「今日格局」冠军横条 */
  champions: {
    title: string;
    smart: string;
    code: string;
    value: string;
    cheap: string;
    memory: string;
    newest: string;
    east: string;
    open: string;
  };

  /** 顶栏状态 */
  hud: {
    updatedAt: (date: string) => string;
    modelCount: (models: number, vendors: number) => string;
  };

  footer: {
    dataFrom: string;
    artFrom: string;
    credits: string;
    /** 隐私与免责页 */
    privacy: string;
    /** 站长署名前缀，拼成「作者：程序员鱼皮」 */
    author: string;
    /** 引流按钮前的引语 */
    alsoVisit: string;
    /** 开源仓库入口 */
    sourceCode: string;
    sourceCodeHint: string;
  };

  /**
   * 模型详情页名牌上的两个站外入口。本站只给链接不搬运正文。
   * zh 指向 B 站搜索与鱼皮 AI 导航；en/ja/ko 指向 YouTube 搜索（不渲染 article）。
   */
  reviews: {
    video: string;
    article: string;
    videoHint: (name: string) => string;
    articleHint: string;
  };
}

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const zh: CoreDict = {
  siteName: '大模型世界',
  siteTagline: '一眼看懂大模型的当下格局',
  siteDescription:
    '把每个大模型画成一个像素角色，用能力条和排行榜把「谁最聪明、谁最会编程、谁最便宜」摆在明面上。数据来自第三方公开评测，每 12 小时自动同步。',

  nav: {
    plaza: '广场',
    chronicle: '时间线',
    leaderboard: '排行榜',
    compare: '对比',
  },

  a11y: {
    mainNav: '主导航',
    pageNav: '本页导航',
  },

  continent: {
    west: '国外',
    east: '国内',
  },

  track: {
    eci: '综合智力',
    swe_bench_verified: '编程',
    value: '性价比',
    memory: '上下文',
    cheap: '最便宜',
    hardcore: '硬核推理',
    webdev_arena_elo: '实战口碑',
  },

  attr: {
    releaseDate: '发布日期',
    knowledgeCutoff: '知识截止',
    contextWindow: '上下文窗口',
    maxOutput: '单次最大输出',
    inputPrice: '输入价格',
    outputPrice: '输出价格',
    params: '参数量',
    license: '开源许可',
    openWeights: '开放权重',
    modalities: '支持的输入',
    toolCall: '工具调用',
    reasoning: '深度思考',
    promptCaching: '提示缓存',
    kind: '模型类型',
  },

  kind: {
    label: {
      text: '文本',
      vision: '视觉',
      omni: '全模态',
      'image-gen': '图像生成',
      'video-gen': '视频生成',
      speech: '语音',
    },
    hint: {
      text: '只读文字、只写文字的对话模型',
      vision: '除了文字还能看图片或视频，输出文字',
      omni: '能听声音、也能看图，文字、图、声音一起理解',
      'image-gen': '能生成图片',
      'video-gen': '能生成视频',
      speech: '语音识别、语音合成或语音对话，不看图',
    },
    unknown: '类型未知',
    filterLabel: '类型',
    multimodal: '多模态',
    multimodalHint: '除纯文本以外的全部：能看图、能听声、能出图出视频',
    sectionTitle: '按类型看',
    countUnit: '个',
    viewAll: (n, label) => `查看全部 ${n} 个${label}模型`,
  },

  unknown: {
    sizeEstimated: '体型为估算值，官方从未公布参数量',
    sizeApprox: '参数量由型号名推断，非官方权重实测',
    notRanked: '未参评',
    noData: '暂无数据',
    singleSource: '单源数据，未经交叉校验',
    incomplete: '资料不全',
    monthOnly: (year, month) => `${year} 年 ${month} 月`,
  },

  status: {
    newborn: '刚出生',
    retired: '已退役',
    ageDays: (days) => `${days} 天前发布`,
    ageYears: (years) => `发布 ${years} 年`,
  },

  crown: {
    gold: '全球第一',
    laurel: '全球前五',
    silver: '全球前十',
  },

  plaza: {
    vendorCount: (n) => `${n} 家`,
    moreVendors: (n) => `还有 ${n} 家资料不全的厂商`,
    tier: {
      top: '头部',
      main: '主力',
      unscored: '尚无评测',
    },
    tierHint: {
      top: '实力排名前十的厂商，按各家头号模型的综合智力算',
      main: '参加过第三方综合评测的厂商',
      unscored: '还没有任何第三方综合评测成绩',
    },
    newer: (name) => `本家更新：${name}`,
    newerHint: (name, date) =>
      `${name} 发布于 ${date}，比屋里这位更新。\n` +
      '屋里站的是这家当下实力第一的一位，而新型号往往还没拿到第三方评测成绩，\n' +
      '所以不会仅因为「更新」就换人。点这行可以直接去看它。',
  },

  champions: {
    title: '今日格局',
    smart: '最聪明',
    code: '最会编程',
    value: '最划算',
    cheap: '最便宜',
    memory: '记性最好',
    newest: '最新发布',
    east: '国内第一',
    open: '开源第一',
  },

  hud: {
    updatedAt: (date) => `数据更新于 ${date}`,
    modelCount: (models, vendors) => `${models} 个模型 · ${vendors} 家厂商`,
  },

  footer: {
    dataFrom: '数据来自',
    artFrom: '字体',
    credits: '素材署名',
    privacy: '隐私与免责',
    author: '作者',
    alsoVisit: '也看看',
    sourceCode: '源码开源',
    sourceCodeHint: '本站代码、数据管线与抓取脚本全部开源（MIT），在 GitHub 上',
  },

  reviews: {
    video: '查看评测视频',
    article: '查看评测文章',
    videoHint: (name) => `站外链接：到 B 站搜「${name} 测评」，看别人实测的视频`,
    articleHint: '站外链接：鱼皮 AI 导航的「模型动态」，新模型的实测与横向对比文章',
  },
};

const en: CoreDict = {
  siteName: 'AI Model World',
  siteTagline: 'The LLM landscape at a glance',
  siteDescription:
    'Every major AI model drawn as a pixel character, with ability bars and leaderboards showing who is smartest, who codes best, and who is cheapest. Data comes from public third-party benchmarks, synced automatically every 12 hours.',

  nav: {
    plaza: 'Plaza',
    chronicle: 'Timeline',
    leaderboard: 'Leaderboard',
    compare: 'Compare',
  },

  a11y: {
    mainNav: 'Main navigation',
    pageNav: 'Page sections',
  },

  continent: {
    west: 'Global',
    east: 'China',
  },

  track: {
    eci: 'Intelligence',
    swe_bench_verified: 'Coding',
    value: 'Value',
    memory: 'Context',
    cheap: 'Cheapest',
    hardcore: 'Hard Reasoning',
    webdev_arena_elo: 'WebDev Arena',
  },

  attr: {
    releaseDate: 'Release Date',
    knowledgeCutoff: 'Knowledge Cutoff',
    contextWindow: 'Context Window',
    maxOutput: 'Max Output',
    inputPrice: 'Input Price',
    outputPrice: 'Output Price',
    params: 'Parameters',
    license: 'License',
    openWeights: 'Open Weights',
    modalities: 'Input Modalities',
    toolCall: 'Tool Calling',
    reasoning: 'Reasoning',
    promptCaching: 'Prompt Caching',
    kind: 'Model Type',
  },

  kind: {
    label: {
      text: 'Text',
      vision: 'Vision',
      omni: 'Omni',
      'image-gen': 'Image Gen',
      'video-gen': 'Video Gen',
      speech: 'Speech',
    },
    hint: {
      text: 'Chat models that only read and write text',
      vision: 'Can also see images or video, outputs text',
      omni: 'Understands audio, images, and text together',
      'image-gen': 'Generates images',
      'video-gen': 'Generates video',
      speech: 'Speech recognition, synthesis, or voice chat; cannot see',
    },
    unknown: 'Unknown type',
    filterLabel: 'Type',
    multimodal: 'Multimodal',
    multimodalHint: 'Everything except text-only: sees images, hears audio, or generates images/video',
    sectionTitle: 'Browse by Type',
    countUnit: '',
    viewAll: (n, label) => `View all ${n} ${label} models`,
  },

  unknown: {
    sizeEstimated: 'Size is an estimate; the vendor has never disclosed parameter count',
    sizeApprox: 'Parameter count inferred from the model name, not measured from official weights',
    notRanked: 'Not ranked',
    noData: 'No data',
    singleSource: 'Single-source data, not cross-verified',
    incomplete: 'Incomplete data',
    monthOnly: (year, month) => `${EN_MONTHS[month - 1]} ${year}`,
  },

  status: {
    newborn: 'New',
    retired: 'Retired',
    ageDays: (days) => `Released ${days} days ago`,
    ageYears: (years) => `Released ${years} years ago`,
  },

  crown: {
    gold: 'Global #1',
    laurel: 'Global Top 5',
    silver: 'Global Top 10',
  },

  plaza: {
    vendorCount: (n) => `${n}`,
    moreVendors: (n) => `${n} more vendors with incomplete data`,
    tier: {
      top: 'Top',
      main: 'Main',
      unscored: 'Unranked',
    },
    tierHint: {
      top: 'The ten strongest vendors, ranked by the general intelligence of their flagship model',
      main: 'Vendors that have appeared in third-party general benchmarks',
      unscored: 'No third-party general benchmark results yet',
    },
    newer: (name) => `Newer from this vendor: ${name}`,
    newerHint: (name, date) =>
      `${name} was released on ${date}, newer than the model in this room.\n` +
      "The room shows the vendor's strongest model today; new releases often have no\n" +
      'third-party benchmark scores yet, so being newer alone does not take the spot. Click to view it.',
  },

  champions: {
    title: "Today's Landscape",
    smart: 'Smartest',
    code: 'Best at Coding',
    value: 'Best Value',
    cheap: 'Cheapest',
    memory: 'Longest Memory',
    newest: 'Newest',
    east: 'China #1',
    open: 'Open-Weight #1',
  },

  hud: {
    updatedAt: (date) => `Data updated ${date}`,
    modelCount: (models, vendors) => `${models} models · ${vendors} vendors`,
  },

  footer: {
    dataFrom: 'Data from',
    artFrom: 'Font',
    credits: 'Credits',
    privacy: 'Privacy & Disclaimer',
    author: 'Author',
    alsoVisit: 'Also visit',
    sourceCode: 'Open source',
    sourceCodeHint: 'The site code, data pipeline, and scrapers are all open source (MIT) on GitHub',
  },

  reviews: {
    video: 'Watch reviews',
    article: 'Read reviews',
    videoHint: (name) => `External link: search YouTube for "${name} review" to see hands-on videos`,
    articleHint: 'External link: hands-on and comparison articles about new models',
  },
};

const ja: CoreDict = {
  siteName: 'AIモデルワールド',
  siteTagline: '大規模モデルの今を一目で',
  siteDescription:
    '主要なAIモデルをピクセルキャラクターとして描き、能力バーとランキングで「誰が一番賢いか、誰がコーディングに強いか、誰が一番安いか」を一目で示します。データは第三者の公開ベンチマークから12時間ごとに自動同期。',

  nav: {
    plaza: '広場',
    chronicle: 'タイムライン',
    leaderboard: 'ランキング',
    compare: '比較',
  },

  a11y: {
    mainNav: 'メインナビゲーション',
    pageNav: 'ページ内ナビゲーション',
  },

  continent: {
    west: '海外',
    east: '中国',
  },

  track: {
    eci: '総合知能',
    swe_bench_verified: 'コーディング',
    value: 'コスパ',
    memory: 'コンテキスト',
    cheap: '最安',
    hardcore: 'ハード推論',
    webdev_arena_elo: '実戦評価',
  },

  attr: {
    releaseDate: 'リリース日',
    knowledgeCutoff: '知識カットオフ',
    contextWindow: 'コンテキストウィンドウ',
    maxOutput: '最大出力',
    inputPrice: '入力価格',
    outputPrice: '出力価格',
    params: 'パラメータ数',
    license: 'ライセンス',
    openWeights: 'オープンウェイト',
    modalities: '対応入力',
    toolCall: 'ツール呼び出し',
    reasoning: '推論',
    promptCaching: 'プロンプトキャッシュ',
    kind: 'モデルタイプ',
  },

  kind: {
    label: {
      text: 'テキスト',
      vision: 'ビジョン',
      omni: 'オムニ',
      'image-gen': '画像生成',
      'video-gen': '動画生成',
      speech: '音声',
    },
    hint: {
      text: 'テキストの読み書きだけの対話モデル',
      vision: 'テキストに加えて画像や動画を理解し、テキストを出力',
      omni: '音声も画像も理解し、テキスト・画像・音声をまとめて処理',
      'image-gen': '画像を生成できる',
      'video-gen': '動画を生成できる',
      speech: '音声認識・音声合成・音声対話。画像は見ない',
    },
    unknown: 'タイプ不明',
    filterLabel: 'タイプ',
    multimodal: 'マルチモーダル',
    multimodalHint: 'テキスト以外の全て：画像を見る、音を聞く、画像・動画を生成',
    sectionTitle: 'タイプで見る',
    countUnit: '個',
    viewAll: (n, label) => `${label}モデル ${n}件をすべて見る`,
  },

  unknown: {
    sizeEstimated: 'サイズは推定値。公式がパラメータ数を公開したことがない',
    sizeApprox: 'パラメータ数は型番から推定。公式ウェイトの実測ではない',
    notRanked: '未参加',
    noData: 'データなし',
    singleSource: '単一ソースのデータ、クロス検証なし',
    incomplete: '情報不足',
    monthOnly: (year, month) => `${year}年${month}月`,
  },

  status: {
    newborn: '生まれたて',
    retired: '引退済み',
    ageDays: (days) => `${days}日前にリリース`,
    ageYears: (years) => `${years}年前にリリース`,
  },

  crown: {
    gold: '世界一',
    laurel: '世界トップ5',
    silver: '世界トップ10',
  },

  plaza: {
    vendorCount: (n) => `${n}社`,
    moreVendors: (n) => `ほかに情報不足の企業が${n}社`,
    tier: {
      top: 'トップ',
      main: '主力',
      unscored: '未評価',
    },
    tierHint: {
      top: '各社の旗艦モデルの総合知能で上位10社',
      main: '第三者の総合評価に参加したことのある企業',
      unscored: '第三者の総合評価の成績がまだない',
    },
    newer: (name) => `新モデル：${name}`,
    newerHint: (name, date) =>
      `${name} は ${date} にリリースされ、部屋にいるモデルより新しい。\n` +
      '部屋に立つのは現時点で実力トップのモデル。新型はまだ第三者評価の\n' +
      '成績がないことが多く、「新しい」だけでは交代しない。クリックで詳細へ。',
  },

  champions: {
    title: '今日の勢力図',
    smart: '最も賢い',
    code: 'コーディング最強',
    value: '最高コスパ',
    cheap: '最安',
    memory: '記憶力No.1',
    newest: '最新',
    east: '中国トップ',
    open: 'オープンソースNo.1',
  },

  hud: {
    updatedAt: (date) => `データ更新：${date}`,
    modelCount: (models, vendors) => `${models}モデル · ${vendors}社`,
  },

  footer: {
    dataFrom: 'データ提供',
    artFrom: 'フォント',
    credits: 'クレジット',
    privacy: 'プライバシーと免責',
    author: '作者',
    alsoVisit: 'こちらも',
    sourceCode: 'オープンソース',
    sourceCodeHint: 'このサイトのコード・データパイプライン・取得スクリプトはすべてMITでGitHubに公開',
  },

  reviews: {
    video: 'レビュー動画を見る',
    article: 'レビュー記事を読む',
    videoHint: (name) => `外部リンク：YouTubeで「${name} review」を検索して実測動画を見る`,
    articleHint: '外部リンク：新モデルの実測・比較記事',
  },
};

const ko: CoreDict = {
  siteName: 'AI 모델 월드',
  siteTagline: 'LLM 판도를 한눈에',
  siteDescription:
    '주요 AI 모델을 픽셀 캐릭터로 그리고, 능력치 바와 리더보드로 누가 가장 똑똑하고, 코딩을 잘하고, 저렴한지 한눈에 보여줍니다. 데이터는 제3자 공개 벤치마크에서 12시간마다 자동 동기화됩니다.',

  nav: {
    plaza: '광장',
    chronicle: '타임라인',
    leaderboard: '리더보드',
    compare: '비교',
  },

  a11y: {
    mainNav: '주 내비게이션',
    pageNav: '페이지 내 내비게이션',
  },

  continent: {
    west: '해외',
    east: '중국',
  },

  track: {
    eci: '종합 지능',
    swe_bench_verified: '코딩',
    value: '가성비',
    memory: '컨텍스트',
    cheap: '최저가',
    hardcore: '하드 추론',
    webdev_arena_elo: '실전 평가',
  },

  attr: {
    releaseDate: '출시일',
    knowledgeCutoff: '지식 컷오프',
    contextWindow: '컨텍스트 윈도우',
    maxOutput: '최대 출력',
    inputPrice: '입력 가격',
    outputPrice: '출력 가격',
    params: '파라미터 수',
    license: '라이선스',
    openWeights: '오픈 웨이트',
    modalities: '지원 입력',
    toolCall: '도구 호출',
    reasoning: '추론',
    promptCaching: '프롬프트 캐싱',
    kind: '모델 유형',
  },

  kind: {
    label: {
      text: '텍스트',
      vision: '비전',
      omni: '옴니',
      'image-gen': '이미지 생성',
      'video-gen': '영상 생성',
      speech: '음성',
    },
    hint: {
      text: '텍스트만 읽고 쓰는 대화 모델',
      vision: '텍스트 외에 이미지나 영상을 보고 텍스트로 출력',
      omni: '소리도 듣고 그림도 보며 텍스트·이미지·음성을 함께 이해',
      'image-gen': '이미지를 생성할 수 있음',
      'video-gen': '영상을 생성할 수 있음',
      speech: '음성 인식, 음성 합성 또는 음성 대화. 그림은 보지 않음',
    },
    unknown: '유형 알 수 없음',
    filterLabel: '유형',
    multimodal: '멀티모달',
    multimodalHint: '순수 텍스트 외 전부: 그림을 보고, 소리를 듣고, 이미지·영상을 생성',
    sectionTitle: '유형별 보기',
    countUnit: '개',
    viewAll: (n, label) => `${label} 모델 ${n}개 모두 보기`,
  },

  unknown: {
    sizeEstimated: '크기는 추정치. 공식이 파라미터 수를 공개한 적 없음',
    sizeApprox: '파라미터 수는 모델명에서 추론. 공식 가중치 실측이 아님',
    notRanked: '미참여',
    noData: '데이터 없음',
    singleSource: '단일 소스 데이터, 교차 검증 안 됨',
    incomplete: '정보 부족',
    monthOnly: (year, month) => `${year}년 ${month}월`,
  },

  status: {
    newborn: '갓 태어남',
    retired: '은퇴함',
    ageDays: (days) => `${days}일 전 출시`,
    ageYears: (years) => `${years}년 전 출시`,
  },

  crown: {
    gold: '세계 1위',
    laurel: '세계 톱5',
    silver: '세계 톱10',
  },

  plaza: {
    vendorCount: (n) => `${n}개사`,
    moreVendors: (n) => `정보가 부족한 기업 ${n}곳 더`,
    tier: {
      top: '톱',
      main: '주력',
      unscored: '평가 없음',
    },
    tierHint: {
      top: '각 사 대표 모델의 종합 지능 기준 상위 10개사',
      main: '제3자 종합 평가에 참여한 적 있는 기업',
      unscored: '아직 제3자 종합 평가 성적이 없음',
    },
    newer: (name) => `이 회사의 신모델: ${name}`,
    newerHint: (name, date) =>
      `${name}은(는) ${date}에 출시되어 방에 있는 모델보다 새롭습니다.\n` +
      '방에는 현재 실력 1위 모델이 서 있습니다. 신형은 대개 아직 제3자 평가\n' +
      '성적이 없어서, 새롭다는 이유만으로 교체되지 않습니다. 클릭하면 볼 수 있습니다.',
  },

  champions: {
    title: '오늘의 판도',
    smart: '가장 똑똑',
    code: '코딩 최강',
    value: '최고 가성비',
    cheap: '최저가',
    memory: '기억력 최고',
    newest: '최신',
    east: '중국 1위',
    open: '오픈소스 1위',
  },

  hud: {
    updatedAt: (date) => `데이터 업데이트: ${date}`,
    modelCount: (models, vendors) => `모델 ${models}개 · 기업 ${vendors}곳`,
  },

  footer: {
    dataFrom: '데이터 제공',
    artFrom: '폰트',
    credits: '크레딧',
    privacy: '개인정보 및 면책',
    author: '제작',
    alsoVisit: '함께 보기',
    sourceCode: '오픈소스',
    sourceCodeHint: '이 사이트의 코드, 데이터 파이프라인, 수집 스크립트는 모두 MIT로 GitHub에 공개',
  },

  reviews: {
    video: '리뷰 영상 보기',
    article: '리뷰 기사 읽기',
    videoHint: (name) => `외부 링크: YouTube에서 "${name} review"를 검색해 실측 영상 보기`,
    articleHint: '외부 링크: 신모델 실측·비교 기사',
  },
};

/** 四语言齐备由 Record<Lang, CoreDict> 强制，漏译编译报错。 */
export const coreDict: Record<Lang, CoreDict> = { zh, en, ja, ko };
