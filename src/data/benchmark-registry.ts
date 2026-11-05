/**
 * 榜单注册表：把 Epoch 的榜单 id 翻译成普通人能看懂的中文名、一句话说明与分类。
 *
 * 这是 `coding-leagues.ts` 在全部榜单上的推广，是第三处**人类常识层**：
 * 机器能读出「这个模型在 HLE 上拿了 46%」，读不出「HLE 是一套连博士都答不好的
 * 刁钻题，46% 已经是前沿水平」。
 *
 * 与前两处注册表遵循同一条铁律：**查表而非逻辑，未收录的榜单自动兜底**。
 * Epoch 新增一个榜单，下一次同步它就会带着自动生成的标签出现在排行榜里，
 * 不需要改一行代码。这里补一条只是让它有中文名和说明，不补也不会坏。
 *
 * 编程类条目直接从 `CODING_LEAGUES` 派生，不在这里重复维护——
 * 两张表各改一份迟早会对不上。
 */

import { CODING_LEAGUES } from './coding-leagues';
import type { Lang, LText } from '@/lib/i18n/types';

/**
 * 分类的内部 id。刻意保留中文取值：它是管线产物（`scores[].league` 的分组键）与
 * `isCodingBenchmark` 等逻辑判据，不是展示文案。展示名见 BENCHMARK_CATEGORIES。
 */
export type BenchmarkCategory =
  | '综合'
  | '数学'
  | '知识与推理'
  | '编程'
  | '智能体'
  | '长文本'
  | '多模态'
  | '游戏与谜题'
  | '写作'
  | '其他';

export interface BenchmarkCategoryInfo {
  id: BenchmarkCategory;
  /** 分类的展示名，四语言齐备 */
  name: LText;
}

/** 分类在界面上的排列顺序：先是所有人都想问的「谁最强」，然后按关注度递减 */
export const BENCHMARK_CATEGORIES: BenchmarkCategoryInfo[] = [
  { id: '综合', name: { zh: '综合', en: 'General', ja: '総合', ko: '종합' } },
  { id: '编程', name: { zh: '编程', en: 'Coding', ja: 'コーディング', ko: '코딩' } },
  { id: '数学', name: { zh: '数学', en: 'Math', ja: '数学', ko: '수학' } },
  { id: '知识与推理', name: { zh: '知识与推理', en: 'Knowledge & Reasoning', ja: '知識と推論', ko: '지식·추론' } },
  { id: '智能体', name: { zh: '智能体', en: 'Agents', ja: 'エージェント', ko: '에이전트' } },
  { id: '长文本', name: { zh: '长文本', en: 'Long Context', ja: '長文脈', ko: '긴 컨텍스트' } },
  { id: '多模态', name: { zh: '多模态', en: 'Multimodal', ja: 'マルチモーダル', ko: '멀티모달' } },
  { id: '游戏与谜题', name: { zh: '游戏与谜题', en: 'Games & Puzzles', ja: 'ゲームとパズル', ko: '게임·퍼즐' } },
  { id: '写作', name: { zh: '写作', en: 'Writing', ja: 'ライティング', ko: '글쓰기' } },
  { id: '其他', name: { zh: '其他', en: 'Other', ja: 'その他', ko: '기타' } },
];

export interface BenchmarkInfo {
  /** 中文短名，尽量不超过六个字；没有通行译法的保留英文原名 */
  label: string;
  /** 上游榜单的官方英文名。en/ja/ko 语言一律用它展示（榜单名不翻译）。 */
  nameEn: string;
  /** 一句人话：它量什么、一般人为什么该关心。zh 为原文，en/ja/ko 为人工翻译。 */
  blurb: LText;
  category: BenchmarkCategory;
  /** 分数越高越好。目前收录的榜单全部为真，留这个字段是给「越低越好」的榜单（如错误率）预留 */
  higherIsBetter: boolean;
  /** 同类里的默认展示优先级，数字越小越靠前 */
  priority: number;
  /** 榜单方主页，用于署名与跳转 */
  homepage: string | null;
}

type Entry = Omit<BenchmarkInfo, 'higherIsBetter'> & { higherIsBetter?: boolean };

/**
 * 非编程榜单。id 与管线 `scores[].league` 一致：一般是 Epoch `benchmark_metadata.csv`
 * 的文件名去掉 `.csv` 与 `_external`，少数沿用管线的历史字段名（`eci`、`aime`、`fiction_live`），
 * Epoch 原名通过下面的 ALIASES 归一过来。
 */
const GENERAL: Record<string, Entry> = {
  // ── 综合 ──
  eci: {
    label: '综合智力',
    nameEn: 'Epoch Capabilities Index',
    blurb: {
      zh: 'Epoch Capabilities Index，把十几项学术评测归并成一个总分。想看综合实力，先看这一栏。',
      en: 'Epoch Capabilities Index merges a dozen academic benchmarks into one score. For overall capability, look here first.',
      ja: 'Epoch Capabilities Index。十数の学術評価を1つの総合点にまとめたもの。総合実力を知りたいならまずこの列。',
      ko: 'Epoch Capabilities Index. 10여 개 학술 평가를 하나의 총점으로 통합. 종합 실력은 이 열부터 확인.',
    },
    category: '综合',
    priority: 1,
    homepage: 'https://epoch.ai/benchmarks/eci',
  },
  simplebench: {
    label: 'SimpleBench',
    nameEn: 'SimpleBench',
    blurb: {
      zh: '一套普通人能轻松答对、模型却常常答错的常识题。分数越高越少犯「一看就傻」的错。',
      en: 'Common-sense questions that people answer easily but models often miss. Higher scores mean fewer obviously silly mistakes.',
      ja: '人間なら簡単に正解できるのにモデルがよく間違える常識問題。高いほど「見ればわかる」ミスが少ない。',
      ko: '사람은 쉽게 맞히지만 모델이 자주 틀리는 상식 문제. 점수가 높을수록 황당한 실수가 적음.',
    },
    category: '综合',
    priority: 20,
    homepage: 'https://simple-bench.com/',
  },

  // ── 数学 ──
  frontiermath_tiers_1_3_v2: {
    label: 'FrontierMath',
    nameEn: 'FrontierMath',
    blurb: {
      zh: '由职业数学家出的原创难题，连数学博士都要花几小时甚至几天。分数是解出的比例，能过一成就是前沿水平。',
      en: 'Original problems written by professional mathematicians that take math PhDs hours or even days. The score is the fraction solved; above 10% is frontier level.',
      ja: 'プロの数学者によるオリジナル難問。数学博士でも数時間から数日かかる。スコアは正解率で、1割超えれば最先端。',
      ko: '직업 수학자가 출제한 오리지널 난제. 수학 박사도 몇 시간에서 며칠 걸림. 점수는 정답 비율로 10%만 넘어도 최전선 수준.',
    },
    category: '数学',
    priority: 10,
    homepage: 'https://epoch.ai/frontiermath',
  },
  frontiermath: {
    label: 'FrontierMath（旧版）',
    nameEn: 'FrontierMath (legacy)',
    blurb: {
      zh: 'FrontierMath 2025 年初的版本，已被新题库取代。留作历史对照。',
      en: 'The early-2025 version of FrontierMath, superseded by a new problem set. Kept for historical reference.',
      ja: '2025年初頭のFrontierMath。新しい問題集に置き換え済み。歴史比較用に残す。',
      ko: '2025년 초 버전의 FrontierMath. 새 문제 세트로 대체됨. 역사적 비교용으로 유지.',
    },
    category: '数学',
    priority: 11,
    homepage: 'https://epoch.ai/frontiermath',
  },
  frontiermath_tier_4_v2: {
    label: 'FrontierMath 第四层',
    nameEn: 'FrontierMath Tier 4',
    blurb: {
      zh: 'FrontierMath 里最难的一层，研究级别的问题，绝大多数模型接近零分。',
      en: 'The hardest tier of FrontierMath: research-level problems where most models score near zero.',
      ja: 'FrontierMathの最難関層。研究レベルの問題で、ほとんどのモデルはほぼ0点。',
      ko: 'FrontierMath의 최상위 난이도. 연구 수준의 문제로 대부분의 모델이 0점에 근접.',
    },
    category: '数学',
    priority: 12,
    homepage: 'https://epoch.ai/frontiermath',
  },
  frontiermath_tier_4: {
    label: 'FrontierMath 第四层（旧版）',
    nameEn: 'FrontierMath Tier 4 (legacy)',
    blurb: {
      zh: 'FrontierMath 第四层 2025 年中的版本，已被新题库取代。',
      en: 'The mid-2025 version of FrontierMath Tier 4, superseded by a new problem set.',
      ja: '2025年半ばのFrontierMath Tier 4。新しい問題集に置き換え済み。',
      ko: '2025년 중반 버전의 FrontierMath Tier 4. 새 문제 세트로 대체됨.',
    },
    category: '数学',
    priority: 13,
    homepage: 'https://epoch.ai/frontiermath',
  },
  aime: {
    label: 'AIME 数学',
    nameEn: 'AIME',
    blurb: {
      zh: '美国高中数学邀请赛难度的模拟题，是数学竞赛能力的通行标尺。答对比例，满分 100。',
      en: 'Mock problems at the difficulty of the American Invitational Mathematics Examination — the standard yardstick for competition math. Percentage correct, out of 100.',
      ja: '全米数学招待試験（AIME）レベルの模擬問題。数学コンテスト力の標準指標。正答率、満点100。',
      ko: '미국 고등학교 수학 초청 시험(AIME) 수준의 모의 문제. 수학 경시 능력의 표준 지표. 정답률, 만점 100.',
    },
    category: '数学',
    priority: 20,
    homepage: 'https://epoch.ai/benchmarks/otis-mock-aime-2024-2025',
  },
  math_level_5: {
    label: 'MATH 五级',
    nameEn: 'MATH Level 5',
    blurb: {
      zh: 'MATH 题库里难度最高的一档，高中竞赛水平。老榜单，顶尖模型早已接近满分。',
      en: 'The hardest level of the MATH dataset, high-school competition level. An old benchmark; top models are long since near perfect.',
      ja: 'MATHデータセットの最難度レベル、高校コンテスト水準。古いベンチマークでトップモデルはとうにほぼ満点。',
      ko: 'MATH 데이터셋의 최고 난이도, 고교 경시 수준. 오래된 벤치마크로 상위 모델은 이미 거의 만점.',
    },
    category: '数学',
    priority: 30,
    homepage: 'https://epoch.ai/benchmarks/math-level-5',
  },
  proofbench: {
    label: 'ProofBench',
    nameEn: 'ProofBench',
    blurb: {
      zh: '不是算出答案，而是写出完整证明并由人评判。考的是数学推理的严谨程度。',
      en: 'Not just computing an answer — the model must write a complete proof, judged by humans. Tests the rigor of mathematical reasoning.',
      ja: '答えを出すのではなく、完全な証明を書き人が評価する。数学的推論の厳密さを測る。',
      ko: '답을 구하는 것이 아니라 완전한 증명을 쓰고 사람이 평가. 수학적 추론의 엄밀성 측정.',
    },
    category: '数学',
    priority: 35,
    homepage: null,
  },
  gsm8k: {
    label: 'GSM8K',
    nameEn: 'GSM8K',
    blurb: {
      zh: '小学应用题。早期用来测数学能力，如今顶尖模型全部接近满分，只对小模型还有区分度。',
      en: 'Grade-school word problems. Once used to test math ability; top models are now all near perfect, so it only distinguishes smaller models.',
      ja: '小学生の文章題。かつて数学力の測定に使われたが、今やトップモデルは全てほぼ満点。小さなモデルの見分けにしか効かない。',
      ko: '초등 수준 문장제 문제. 과거 수학 능력 측정에 사용됐지만 지금은 상위 모델이 모두 거의 만점. 소형 모델 구분에만 의미.',
    },
    category: '数学',
    priority: 60,
    homepage: null,
  },

  // ── 知识与推理 ──
  hle: {
    label: 'HLE 终极考试',
    nameEn: "Humanity's Last Exam",
    blurb: {
      zh: "Humanity's Last Exam，各学科专家出的刁钻题，专为难住模型而设计。能过四成就是当今顶尖。",
      en: "Humanity's Last Exam: tricky questions from experts across disciplines, designed to stump models. Above 40% is today's cutting edge.",
      ja: 'Humanity\'s Last Exam。各分野の専門家がモデルを困らせるために作った難問。4割超えれば現在のトップレベル。',
      ko: "Humanity's Last Exam. 각 분야 전문가가 모델을 어렵게 하려고 만든 문제. 40%를 넘으면 현 시점 최고 수준.",
    },
    category: '知识与推理',
    priority: 10,
    homepage: 'https://lastexam.ai/',
  },
  hle_tools: {
    label: 'HLE 终极考试（可用工具）',
    nameEn: "Humanity's Last Exam (with tools)",
    blurb: {
      zh: "Humanity's Last Exam 允许联网搜索、跑代码的测法，分数会比闭卷高一截，不能和闭卷那一栏放在一起比。",
      en: "Humanity's Last Exam with web search and code execution allowed. Scores run well above the closed-book version and must not be compared with it.",
      ja: 'Humanity\'s Last Examにネット検索とコード実行を許可した測定方式。スコアは持込不可よりかなり高くなり、並べて比較はできない。',
      ko: "Humanity's Last Exam에 웹 검색과 코드 실행을 허용한 방식. 점수가 클로즈드북보다 훨씬 높아 함께 비교 불가.",
    },
    category: '知识与推理',
    priority: 11,
    homepage: 'https://lastexam.ai/',
  },
  gpqa_diamond: {
    label: 'GPQA 科学',
    nameEn: 'GPQA Diamond',
    blurb: {
      zh: '博士级别的物理、化学、生物选择题，题目设计到「谷歌也搜不到答案」。随机乱猜是 25 分。',
      en: 'PhD-level multiple-choice questions in physics, chemistry, and biology, designed to be un-Googleable. Random guessing scores 25.',
      ja: '博士レベルの物理・化学・生物の選択問題。「ググっても答えが出ない」設計。ランダムで25点。',
      ko: '박사 수준의 물리·화학·생물 객관식 문제. "구글로도 답을 찾을 수 없게" 설계. 무작위 추측은 25점.',
    },
    category: '知识与推理',
    priority: 20,
    homepage: 'https://epoch.ai/benchmarks/gpqa-diamond',
  },
  arc_agi_2: {
    label: 'ARC-AGI-2',
    nameEn: 'ARC-AGI-2',
    blurb: {
      zh: '看几组图形样例找规律的智力题，人类轻松、模型艰难。专门测「没见过的题会不会做」。',
      en: 'Pattern-recognition puzzles from a few visual examples — easy for humans, hard for models. Specifically tests whether the model can handle problems it has never seen.',
      ja: 'いくつかの図形例から法則を見つける知能問題。人間には簡単、モデルには難しい。「見たことのない問題が解けるか」を専門に測る。',
      ko: '몇 개의 도형 예시에서 규칙을 찾는 지능 문제. 사람에겐 쉽고 모델에겐 어려움. "본 적 없는 문제를 풀 수 있는가"를 전문으로 측정.',
    },
    category: '知识与推理',
    priority: 30,
    homepage: 'https://arcprize.org/',
  },
  arc_agi: {
    label: 'ARC-AGI（第一代）',
    nameEn: 'ARC-AGI-1',
    blurb: {
      zh: 'ARC-AGI 的第一代题库，已被第二代取代。',
      en: 'The first-generation ARC-AGI problem set, superseded by the second generation.',
      ja: 'ARC-AGIの第1世代問題集。第2世代に置き換え済み。',
      ko: 'ARC-AGI 1세대 문제 세트. 2세대로 대체됨.',
    },
    category: '知识与推理',
    priority: 31,
    homepage: 'https://arcprize.org/',
  },
  simpleqa_verified: {
    label: 'SimpleQA 事实问答',
    nameEn: 'SimpleQA Verified',
    blurb: {
      zh: '一问一答的冷门事实题，测的是「知不知道」和「会不会瞎编」。分数低的模型更容易一本正经地胡说。',
      en: 'Short-answer questions on obscure facts, testing both knowledge and the tendency to fabricate. Low scorers are more likely to confidently make things up.',
      ja: '一問一答のマイナーな事実問題。「知っているか」と「でたらめを言わないか」を測る。低スコアのモデルほど平然と嘘をつきやすい。',
      ko: '일문일답식 생소한 사실 문제. "아는가"와 "지어내지 않는가"를 측정. 점수가 낮을수록 진지하게 허위를 말하기 쉬움.',
    },
    category: '知识与推理',
    priority: 40,
    homepage: 'https://www.kaggle.com/benchmarks/deepmind/simpleqa-verified',
  },
  mmlu: {
    label: 'MMLU',
    nameEn: 'MMLU',
    blurb: {
      zh: '横跨 57 个学科的大学水平选择题，曾是最通行的知识广度标尺。如今顶尖模型已接近饱和。',
      en: 'University-level multiple choice across 57 subjects; once the standard measure of knowledge breadth. Top models are now near saturation.',
      ja: '57科目にまたがる大学レベルの選択問題。かつて知識の広さの標準指標だった。現在トップモデルはほぼ飽和。',
      ko: '57개 학문 분야의 대학 수준 객관식. 한때 지식 범위의 표준 지표. 현재 상위 모델은 거의 포화.',
    },
    category: '知识与推理',
    priority: 50,
    homepage: null,
  },
  critpt: {
    label: 'CritPt 物理',
    nameEn: 'CritPt',
    blurb: {
      zh: '研究级别的物理问题，由在职物理学家出题。测的是能不能做前沿科研级的推理。',
      en: 'Research-level physics problems written by practicing physicists. Tests frontier research-grade reasoning.',
      ja: '現役の物理学者が出題する研究レベルの物理問題。最先端の科研レベルの推論ができるかを測る。',
      ko: '현직 물리학자가 출제한 연구 수준의 물리 문제. 최전선 연구급 추론 능력 측정.',
    },
    category: '知识与推理',
    priority: 55,
    homepage: null,
  },
  bbh: {
    label: 'BIG-Bench Hard',
    nameEn: 'BIG-Bench Hard',
    blurb: {
      zh: '从 BIG-Bench 里挑出的一批模型当年做不好的推理题。老榜单，参考意义有限。',
      en: 'A selection of reasoning problems from BIG-Bench that models once struggled with. An old benchmark of limited relevance today.',
      ja: 'BIG-Benchから当時のモデルが苦手だった推論問題を抜粋。古いベンチマークで参考価値は限定的。',
      ko: 'BIG-Bench에서 당시 모델들이 못 풀던 추론 문제를 추린 것. 오래된 벤치마크로 참고 가치가 제한적.',
    },
    category: '知识与推理',
    priority: 70,
    homepage: null,
  },
  hella_swag: {
    label: 'HellaSwag',
    nameEn: 'HellaSwag',
    blurb: {
      zh: '给一段情景补上最合理的下一句，测常识推理。早期榜单，顶尖模型已接近满分。',
      en: 'Pick the most plausible continuation of a scenario; tests common-sense reasoning. An early benchmark, near-perfect for top models.',
      ja: '状況に最も自然な続きを選ぶ常識推論テスト。初期のベンチマークで、トップモデルはほぼ満点。',
      ko: '상황에 가장 자연스러운 다음 문장을 고르는 상식 추론 테스트. 초기 벤치마크로 상위 모델은 거의 만점.',
    },
    category: '知识与推理',
    priority: 80,
    homepage: null,
  },
  wino_grande: {
    label: 'WinoGrande',
    nameEn: 'WinoGrande',
    blurb: {
      zh: '指代消解的常识题（「它」指的是哪个？）。早期榜单，已经饱和。',
      en: 'Common-sense coreference questions (what does "it" refer to?). An early benchmark, now saturated.',
      ja: '照応解決の常識問題（「それ」は何を指す？）。初期のベンチマークで、すでに飽和。',
      ko: '지시 해소 상식 문제("그것"은 무엇을 가리키는가?). 초기 벤치마크로 이미 포화.',
    },
    category: '知识与推理',
    priority: 81,
    homepage: null,
  },
  piqa: {
    label: 'PIQA',
    nameEn: 'PIQA',
    blurb: {
      zh: '物理常识题：要达成某个目的，哪种做法可行？早期榜单。',
      en: 'Physical common sense: which approach achieves a given goal? An early benchmark.',
      ja: '物理常識問題：目的を達成するにはどの方法が有効か。初期のベンチマーク。',
      ko: '물리 상식 문제: 목표를 달성하려면 어떤 방법이 가능한가? 초기 벤치마크.',
    },
    category: '知识与推理',
    priority: 82,
    homepage: null,
  },
  bool_q: {
    label: 'BoolQ',
    nameEn: 'BoolQ',
    blurb: {
      zh: '读一段文字回答是或否。早期阅读理解榜单。',
      en: 'Read a passage and answer yes or no. An early reading-comprehension benchmark.',
      ja: '文章を読んで「はい/いいえ」で答える。初期の読解ベンチマーク。',
      ko: '글을 읽고 예/아니오로 답하는 초기 독해 벤치마크.',
    },
    category: '知识与推理',
    priority: 83,
    homepage: null,
  },
  open_book_qa: {
    label: 'OpenBookQA',
    nameEn: 'OpenBookQA',
    blurb: {
      zh: '小学科学知识的开卷选择题。早期榜单。',
      en: 'Open-book multiple choice on elementary science. An early benchmark.',
      ja: '小学レベルの科学知識の持込可選択問題。初期のベンチマーク。',
      ko: '초등 과학 지식의 오픈북 객관식. 초기 벤치마크.',
    },
    category: '知识与推理',
    priority: 84,
    homepage: null,
  },
  common_sense_qa_2: {
    label: 'CommonsenseQA 2',
    nameEn: 'CommonsenseQA 2.0',
    blurb: {
      zh: '由人专门出来难住模型的常识判断题。早期榜单。',
      en: 'Common-sense judgments written specifically to trip up models. An early benchmark.',
      ja: 'モデルを惑わせるために人が作った常識判断問題。初期のベンチマーク。',
      ko: '모델을 어렵게 하려고 사람이 만든 상식 판단 문제. 초기 벤치마크.',
    },
    category: '知识与推理',
    priority: 85,
    homepage: null,
  },
  science_qa: {
    label: 'ScienceQA',
    nameEn: 'ScienceQA',
    blurb: {
      zh: '中小学科学题，部分带图。早期多模态榜单。',
      en: 'K-12 science questions, some with images. An early multimodal benchmark.',
      ja: '小中学校の理科問題。一部画像付き。初期のマルチモーダルベンチマーク。',
      ko: '초중등 과학 문제, 일부 그림 포함. 초기 멀티모달 벤치마크.',
    },
    category: '知识与推理',
    priority: 86,
    homepage: null,
  },
  arc_ai2: {
    label: 'ARC（AI2 科学题）',
    nameEn: 'ARC (AI2)',
    blurb: {
      zh: 'AI2 出的小学到初中科学选择题，与 ARC-AGI 无关。早期榜单。',
      en: "AI2's grade- and middle-school science multiple choice; unrelated to ARC-AGI. An early benchmark.",
      ja: 'AI2による小・中学校レベルの理科選択問題。ARC-AGIとは無関係。初期のベンチマーク。',
      ko: 'AI2의 초·중등 과학 객관식. ARC-AGI와 무관. 초기 벤치마크.',
    },
    category: '知识与推理',
    priority: 87,
    homepage: null,
  },
  trivia_qa: {
    label: 'TriviaQA',
    nameEn: 'TriviaQA',
    blurb: {
      zh: '百科知识问答。早期榜单。',
      en: 'Trivia questions on encyclopedic knowledge. An early benchmark.',
      ja: '百科知識のクイズ。初期のベンチマーク。',
      ko: '백과 지식 퀴즈. 초기 벤치마크.',
    },
    category: '知识与推理',
    priority: 88,
    homepage: null,
  },
  lambada: {
    label: 'LAMBADA',
    nameEn: 'LAMBADA',
    blurb: {
      zh: '读完一段话预测最后一个词，测长距离的语言理解。早期榜单。',
      en: 'Predict the final word of a passage, testing long-range language understanding. An early benchmark.',
      ja: '文章を読んで最後の単語を予測。長距離の言語理解を測る。初期のベンチマーク。',
      ko: '문장을 읽고 마지막 단어를 예측. 장거리 언어 이해 측정. 초기 벤치마크.',
    },
    category: '知识与推理',
    priority: 89,
    homepage: null,
  },
  superglue: {
    label: 'SuperGLUE',
    nameEn: 'SuperGLUE',
    blurb: {
      zh: '一组经典自然语言理解任务的合集。早期榜单，已经饱和。',
      en: 'A collection of classic natural-language understanding tasks. An early benchmark, now saturated.',
      ja: '古典的な自然言語理解タスクの集まり。初期のベンチマークで、すでに飽和。',
      ko: '고전적인 자연어 이해 과제 모음. 초기 벤치마크로 이미 포화.',
    },
    category: '知识与推理',
    priority: 90,
    homepage: null,
  },
  adversarial_nli: {
    label: 'ANLI',
    nameEn: 'ANLI',
    blurb: {
      zh: '对抗式的自然语言推理题：两句话之间是蕴含、矛盾还是无关。早期榜单。',
      en: 'Adversarial natural-language inference: is the relation between two sentences entailment, contradiction, or neutral. An early benchmark.',
      ja: '敵対的な自然言語推論：2文の関係は含意・矛盾・無関係のどれか。初期のベンチマーク。',
      ko: '적대적 자연어 추론: 두 문장의 관계가 함의·모순·무관 중 무엇인지. 초기 벤치마크.',
    },
    category: '知识与推理',
    priority: 91,
    homepage: null,
  },
  forecastbench: {
    label: 'ForecastBench',
    nameEn: 'ForecastBench',
    blurb: {
      zh: '预测尚未发生的事件，事后按结果打分。测的是判断力而不是记忆力。',
      en: 'Predict events that have not happened yet; scored after the fact. Tests judgment, not memory.',
      ja: 'まだ起きていない出来事を予測し、結果が出てから採点。記憶力ではなく判断力を測る。',
      ko: '아직 일어나지 않은 사건을 예측하고 결과가 나온 뒤 채점. 기억력이 아닌 판단력 측정.',
    },
    category: '知识与推理',
    priority: 45,
    homepage: 'https://www.forecastbench.org/',
  },
  deepresearchbench: {
    label: '深度研究',
    nameEn: 'DeepResearchBench',
    blurb: {
      zh: '给一个开放的研究课题，让模型上网查资料写出报告，由人评质量。',
      en: 'Given an open research topic, the model searches the web and writes a report, graded by humans.',
      ja: 'オープンな研究課題を与え、モデルがネットで調べてレポートを書き、人が品質を評価。',
      ko: '개방형 연구 주제를 주고 모델이 웹에서 자료를 조사해 보고서를 작성, 사람이 품질 평가.',
    },
    category: '知识与推理',
    priority: 48,
    homepage: null,
  },
  weirdml: {
    label: 'WeirdML',
    nameEn: 'WeirdML',
    blurb: {
      zh: '一批刻意古怪的小型机器学习任务，模型要自己写代码训练并拿到成绩。考的是解决陌生问题的能力。',
      en: 'A set of deliberately odd small machine-learning tasks; the model writes its own code, trains, and gets results. Tests handling of unfamiliar problems.',
      ja: '意図的に風変わりな小型機械学習タスク群。モデルが自分でコードを書き学習して成績を出す。見知らぬ問題への対処力を測る。',
      ko: '의도적으로 엉뚱한 소형 머신러닝 과제 모음. 모델이 직접 코드를 작성해 학습하고 성과를 냄. 낯선 문제 해결 능력 측정.',
    },
    category: '知识与推理',
    priority: 58,
    homepage: 'https://htihle.github.io/weirdml.html',
  },

  // ── 智能体 ──
  metr_time_horizons: {
    label: '独立工作时长',
    nameEn: 'METR Time Horizons',
    blurb: {
      zh: 'METR 的时间跨度：模型能可靠独立完成的任务，换成人来做要花多久。单位是时间，越长说明能独立干越大的活。',
      en: "METR's time horizon: how long a task would take a human, if the model can complete it reliably on its own. Measured in time; longer means it can handle bigger jobs independently.",
      ja: 'METRのタイムホライズン：モデルが自力で確実にこなせるタスクを人がやるとどのくらいかかるか。単位は時間で、長いほど大きな仕事を独力でこなせる。',
      ko: 'METR의 시간 범위: 모델이 스스로 안정적으로 완수할 수 있는 작업을 사람이 하면 얼마나 걸리는가. 단위는 시간이며 길수록 더 큰 일을 독립적으로 처리 가능.',
    },
    category: '智能体',
    priority: 10,
    homepage: 'https://metr.org/',
  },
  os_world: {
    label: 'OSWorld 操作电脑',
    nameEn: 'OSWorld',
    blurb: {
      zh: '在真实的电脑桌面上点鼠标敲键盘完成任务，比如改表格、发邮件。考的是能不能替你操作电脑。',
      en: 'Complete tasks on a real computer desktop — clicking, typing, editing spreadsheets, sending email. Tests whether the model can operate a computer for you.',
      ja: '実際のPCデスクトップでマウスとキーボードを操作し、表の編集やメール送信などのタスクをこなす。PC操作を代行できるかを測る。',
      ko: '실제 컴퓨터 데스크톱에서 마우스와 키보드로 표 수정, 이메일 발송 등의 작업을 수행. 컴퓨터를 대신 조작할 수 있는지 측정.',
    },
    category: '智能体',
    priority: 20,
    homepage: 'https://os-world.github.io/',
  },
  osworld_2: {
    label: 'OSWorld 2.0',
    nameEn: 'OSWorld 2.0',
    blurb: {
      zh: 'OSWorld 的第二代题库，任务更长更杂，与第一代分数不可直接比较。',
      en: 'The second-generation OSWorld task set: longer and more varied tasks. Not directly comparable with first-generation scores.',
      ja: 'OSWorldの第2世代問題集。タスクがより長く多岐にわたる。第1世代のスコアとは直接比較できない。',
      ko: 'OSWorld 2세대 문제 세트. 작업이 더 길고 다양. 1세대 점수와 직접 비교 불가.',
    },
    category: '智能体',
    priority: 21,
    homepage: 'https://os-world.github.io/',
  },
  osworld_2_partial: {
    label: 'OSWorld 2.0 部分得分',
    nameEn: 'OSWorld 2.0 (partial)',
    blurb: {
      zh: 'Anthropic 发布文里的 OSWorld 2.0 口径，完成一部分也给分。和 OpenAI 公布的离线集口径不是一回事，不能放在一起比。',
      en: "The OSWorld 2.0 setup from Anthropic's announcement, with partial credit for incomplete tasks. Not the same setup as OpenAI's offline set — do not compare them side by side.",
      ja: 'Anthropicの発表におけるOSWorld 2.0の測定口径。途中までの完了にも部分点を与える。OpenAI公表のオフラインセットの口径とは別物で、並べて比較はできない。',
      ko: 'Anthropic 발표문의 OSWorld 2.0 측정 방식. 일부 완료에도 부분 점수 부여. OpenAI가 공개한 오프라인 세트 방식과는 다르므로 함께 비교 불가.',
    },
    category: '智能体',
    priority: 22,
    homepage: 'https://osworld-v2.xlang.ai/',
  },
  osworld_2_offline: {
    label: 'OSWorld 2.0 离线集',
    nameEn: 'OSWorld 2.0 (offline set)',
    blurb: {
      zh: 'OpenAI 发布文里的 OSWorld 2.0 口径：离线题集的部分得分。和 Anthropic 公布的口径不是一回事，不能放在一起比。',
      en: "The OSWorld 2.0 setup from OpenAI's announcement: partial credit on the offline task set. Not the same setup as Anthropic's — do not compare them side by side.",
      ja: 'OpenAIの発表におけるOSWorld 2.0の測定口径：オフライン問題集での部分点。Anthropic公表の口径とは別物で、並べて比較はできない。',
      ko: 'OpenAI 발표문의 OSWorld 2.0 측정 방식: 오프라인 문제 세트의 부분 점수. Anthropic이 공개한 방식과는 다르므로 함께 비교 불가.',
    },
    category: '智能体',
    priority: 23,
    homepage: 'https://osworld-v2.xlang.ai/',
  },
  automationbench: {
    label: 'AutomationBench',
    nameEn: 'AutomationBench',
    blurb: {
      zh: 'Zapier 出的业务流程测试：用 47 个工具跑完销售、市场、客服、财务里的端到端流程。考的是能不能替你把一整套办公流程跑通。',
      en: "Zapier's business-process test: complete end-to-end workflows across sales, marketing, support, and finance using 47 tools. Tests whether the model can run an entire office process for you.",
      ja: 'Zapierによる業務プロセステスト。47のツールで営業・マーケ・CS・財務のエンドツーエンド業務をこなす。一連のオフィス業務を任せられるかを測る。',
      ko: 'Zapier의 업무 프로세스 테스트: 47개 도구로 영업·마케팅·고객지원·재무의 엔드투엔드 업무 완수. 사무 업무 전체를 맡길 수 있는지 측정.',
    },
    category: '智能体',
    priority: 24,
    homepage: 'https://zapier.com/benchmarks',
  },
  agents_last_exam: {
    label: "Agents' Last Exam",
    nameEn: "Agents' Last Exam",
    blurb: {
      zh: '横跨 55 个细分行业的长流程专业工作，看智能体能不能独立干完一件有经济价值的活。',
      en: 'Long professional workflows spanning 55 industries, testing whether an agent can independently complete work of economic value.',
      ja: '55の業界にまたがる長い専門業務。エージェントが経済的価値のある仕事を独力でやり遂げられるかを見る。',
      ko: '55개 세부 산업에 걸친 장기 전문 업무. 에이전트가 경제적 가치가 있는 일을 독립적으로 완수할 수 있는지 측정.',
    },
    category: '智能体',
    priority: 25,
    homepage: 'https://agents-last-exam.org/',
  },
  terminal_bench_science: {
    label: 'Terminal-Bench 科研版',
    nameEn: 'Terminal-Bench Science',
    blurb: {
      zh: 'Terminal-Bench 的科研分支：在终端里独立完成科学研究类任务。',
      en: 'The scientific-research branch of Terminal-Bench: complete research tasks independently in a terminal.',
      ja: 'Terminal-Benchの科学研究版。ターミナルで研究系タスクを自力でこなす。',
      ko: 'Terminal-Bench의 과학 연구 버전. 터미널에서 연구 작업을 독립적으로 수행.',
    },
    category: '智能体',
    priority: 26,
    homepage: 'https://www.tbench.ai/',
  },
  vending_bench_2: {
    label: '经营售货机',
    nameEn: 'Vending-Bench 2',
    blurb: {
      zh: 'Vending-Bench：让模型经营一台虚拟售货机一整年——进货、定价、付租金。分数是最后账上的钱，考的是长期不犯糊涂。',
      en: 'Vending-Bench: the model runs a virtual vending machine for a full year — restocking, pricing, paying rent. The score is the final balance, testing long-term consistency.',
      ja: 'Vending-Bench：仮想の自動販売機を1年間経営させる——仕入れ、価格設定、家賃支払い。スコアは最終的な残高。長期にわたり判断を誤らない力を測る。',
      ko: 'Vending-Bench: 모델이 가상 자판기를 1년간 운영 — 재고 구매, 가격 책정, 임대료 납부. 점수는 최종 잔액. 장기간 흔들리지 않는 능력 측정.',
    },
    category: '智能体',
    priority: 30,
    homepage: 'https://andonlabs.com/evals/vending-bench',
  },
  the_agent_company: {
    label: '虚拟公司实习',
    nameEn: 'TheAgentCompany',
    blurb: {
      zh: 'TheAgentCompany：在一家模拟的软件公司里干活——查文档、发消息、写代码、填表。考的是当员工的综合本事。',
      en: 'TheAgentCompany: work in a simulated software company — read docs, send messages, write code, fill forms. Tests general employee skills.',
      ja: 'TheAgentCompany：模擬のソフトウェア会社で働く——ドキュメントを読み、メッセージを送り、コードを書き、フォームを埋める。社員としての総合スキルを測る。',
      ko: 'TheAgentCompany: 모의 소프트웨어 회사에서 근무 — 문서 열람, 메시지 전송, 코드 작성, 양식 작성. 직원으로서의 종합 역량 측정.',
    },
    category: '智能体',
    priority: 40,
    homepage: 'https://the-agent-company.com/',
  },
  apex_agents: {
    label: 'APEX 专业任务',
    nameEn: 'APEX-Agents',
    blurb: {
      zh: '投行、律所、咨询公司的真实工作任务，由业内专家出题与评分。',
      en: 'Real work tasks from investment banking, law, and consulting, written and graded by industry experts.',
      ja: '投資銀行・法律事務所・コンサルの実務タスク。業界の専門家が出題と採点を担当。',
      ko: '투자은행·로펌·컨설팅의 실제 업무 과제. 업계 전문가가 출제와 채점.',
    },
    category: '智能体',
    priority: 45,
    homepage: null,
  },
  gdpval: {
    label: 'GDPval 职业任务',
    nameEn: 'GDPval',
    blurb: {
      zh: 'OpenAI 出的一组覆盖多个行业的真实职业任务，由专家把模型的产出与人类专业人士的成果盲比。分数是胜率。',
      en: "OpenAI's set of real occupational tasks across industries; experts blindly compare model output against human professionals' work. The score is the win rate.",
      ja: 'OpenAIによる複数業界の実際の職務タスク集。専門家がモデルの成果物と人間のプロの成果をブラインド比較。スコアは勝率。',
      ko: 'OpenAI가 만든 여러 산업의 실제 직무 과제. 전문가가 모델 결과물과 인간 전문가의 결과물을 블라인드 비교. 점수는 승률.',
    },
    category: '智能体',
    priority: 46,
    homepage: null,
  },
  rli: {
    label: '远程工作指数',
    nameEn: 'Remote Labor Index',
    blurb: {
      zh: 'Remote Labor Index：从自由职业平台上取的真实外包项目，看模型能独立交付多少。分数普遍很低，说明离「替代远程工作者」还远。',
      en: 'Remote Labor Index: real freelance projects from gig platforms, measuring how much the model can deliver independently. Scores are generally low — replacing remote workers is still far off.',
      ja: 'Remote Labor Index：フリーランスプラットフォームの実際の案件を使い、モデルがどれだけ独力で納品できるかを測る。スコアは全般に低く、「リモートワーカーの代替」はまだ遠い。',
      ko: 'Remote Labor Index: 프리랜서 플랫폼의 실제 외주 프로젝트로 모델이 독립적으로 얼마나 납품할 수 있는지 측정. 점수가 전반적으로 낮아 "원격 근로자 대체"는 아직 멂.',
    },
    category: '智能体',
    priority: 47,
    homepage: null,
  },
  cybench: {
    label: 'Cybench 网络安全',
    nameEn: 'Cybench',
    blurb: {
      zh: '夺旗赛（CTF）风格的网络安全题，测攻防能力。',
      en: 'Capture-the-flag style cybersecurity challenges, testing offensive and defensive skills.',
      ja: 'CTF（Capture the Flag）形式のサイバーセキュリティ問題。攻防の能力を測る。',
      ko: 'CTF(Capture the Flag) 스타일의 사이버 보안 문제. 공방 능력 측정.',
    },
    category: '智能体',
    priority: 60,
    homepage: 'https://cybench.github.io/',
  },
  exploitbench: {
    label: 'ExploitBench',
    nameEn: 'ExploitBench',
    blurb: {
      zh: '给一个真实的软件漏洞，看模型能不能写出利用代码。安全评测，不是日常能力。',
      en: 'Given a real software vulnerability, can the model write working exploit code. A security evaluation, not an everyday capability.',
      ja: '実在のソフトウェア脆弱性を与え、悪用コードを書けるかを見る。セキュリティ評価であり日常の能力ではない。',
      ko: '실제 소프트웨어 취약점을 주고 익스플로잇 코드를 작성할 수 있는지 측정. 보안 평가이며 일상적 능력이 아님.',
    },
    category: '智能体',
    priority: 61,
    homepage: null,
  },
  posttrainbench: {
    label: 'PostTrainBench',
    nameEn: 'PostTrainBench',
    blurb: {
      zh: '让模型自己去微调一个更小的模型，考的是「会不会炼丹」。',
      en: 'The model must fine-tune a smaller model by itself — testing machine-learning engineering skill.',
      ja: 'モデル自身に小さなモデルをファインチューニングさせる。MLエンジニアリングの腕を測る。',
      ko: '모델이 스스로 더 작은 모델을 파인튜닝. ML 엔지니어링 능력 측정.',
    },
    category: '智能体',
    priority: 65,
    homepage: null,
  },
  blueprint_bench_2: {
    label: 'BlueprintBench',
    nameEn: 'BlueprintBench',
    blurb: {
      zh: '看房屋照片画出平面图，测空间理解与工程绘图能力。',
      en: 'Draw a floor plan from photos of a house, testing spatial understanding and engineering drawing.',
      ja: '家の写真から平面図を描く。空間理解と製図能力を測る。',
      ko: '집 사진을 보고 평면도를 그리기. 공간 이해와 제도 능력 측정.',
    },
    category: '智能体',
    priority: 70,
    homepage: null,
  },
  cad_eval: {
    label: 'CAD 建模',
    nameEn: 'CAD-Eval',
    blurb: {
      zh: '按文字描述生成三维 CAD 模型，考的是工程建模能力。',
      en: 'Generate 3D CAD models from text descriptions, testing engineering modeling ability.',
      ja: 'テキストの記述から3D CADモデルを生成。工学的モデリング能力を測る。',
      ko: '텍스트 설명으로 3D CAD 모델 생성. 엔지니어링 모델링 능력 측정.',
    },
    category: '智能体',
    priority: 71,
    homepage: null,
  },
  surface_evolver_bench: {
    label: 'Surface Evolver',
    nameEn: 'Surface Evolver Bench',
    blurb: {
      zh: '用一款专业的曲面数值软件完成计算任务，考的是驾驭陌生专业工具的能力。',
      en: 'Complete computation tasks in a specialized surface-evolution tool, testing the ability to master unfamiliar professional software.',
      ja: '専門の曲面数値ソフトで計算タスクをこなす。未知の専門ツールを使いこなす力を測る。',
      ko: '전문 곡면 수치 소프트웨어로 계산 작업 수행. 낯선 전문 도구를 다루는 능력 측정.',
    },
    category: '智能体',
    priority: 72,
    homepage: null,
  },

  // ── 长文本 ──
  fiction_live: {
    label: '长文本记忆',
    nameEn: 'Fiction.liveBench',
    blurb: {
      zh: 'Fiction.liveBench：读一篇长小说后回答细节问题。很多模型号称能读百万字，实测读到一半就忘了前面。',
      en: 'Fiction.liveBench: answer detail questions after reading a full novel. Many models claim million-token memory but forget the first half by the middle.',
      ja: 'Fiction.liveBench：長編小説を読んだ後に細部の質問に答える。百万字読めると謳うモデルも、実測では途中で前半を忘れがち。',
      ko: 'Fiction.liveBench: 장편 소설을 읽고 세부 질문에 답하기. 백만 자를 읽는다는 모델도 실측하면 중간에 앞부분을 잊는 경우가 많음.',
    },
    category: '长文本',
    priority: 10,
    homepage: 'https://fiction.live/stories/Fiction-liveBench',
  },
  cl_bench: {
    label: 'CL-bench 长上下文',
    nameEn: 'CL-bench',
    blurb: {
      zh: '在很长的上下文里做推理与检索，测的是长文本的实际可用程度。',
      en: 'Reasoning and retrieval over very long contexts, testing how usable long context really is.',
      ja: '非常に長いコンテキストで推論と検索を行う。長文脈の実際の使い勝手を測る。',
      ko: '매우 긴 컨텍스트에서 추론과 검색 수행. 긴 텍스트의 실제 활용도 측정.',
    },
    category: '长文本',
    priority: 20,
    homepage: null,
  },
  cl_bench_life: {
    label: 'CL-bench 生活版',
    nameEn: 'CL-bench Life',
    blurb: {
      zh: 'CL-bench 的日常生活场景分支。',
      en: 'The everyday-life scenarios branch of CL-bench.',
      ja: 'CL-benchの日常生活シナリオ版。',
      ko: 'CL-bench의 일상생활 시나리오 버전.',
    },
    category: '长文本',
    priority: 21,
    homepage: null,
  },

  /*
   * ── 生成类竞技场（LMArena，CC-BY 4.0）──
   *
   * 这几条补的是别处补不上的一块：图像与视频**生成**模型此前在站内一个分数都没有，
   * 因为它们清一色是闭源商业模型，学术基准要么只测开源、要么停在 2023 年那一代。
   *
   * 量纲是人类盲投的 Bradley-Terry 分，与学术评测的通过率不可比，所以各自单独成榜，
   * 不进综合智力。优先级排在多模态类目靠前，因为对这两类模型来说它是**唯一**的成绩。
   */
  arena_text_to_image: {
    label: '文生图竞技场',
    nameEn: 'Text-to-Image Arena',
    blurb: {
      zh: '同一句提示词让两个模型各画一张，真人盲选哪张更好，几百万次投票攒出的分。图像模型目前唯一的公开横评。',
      en: 'Two models each draw from the same prompt and humans blindly pick the better image; the score aggregates millions of votes. The only public head-to-head for image models today.',
      ja: '同じプロンプトで2つのモデルがそれぞれ描き、人がどちらが良いかブラインド投票。数百万票から算出。画像モデル唯一の公開横評価。',
      ko: '같은 프롬프트로 두 모델이 각각 이미지를 생성하고 사람들이 블라인드 투표. 수백만 표를 집계한 점수. 이미지 모델의 유일한 공개 비교 평가.',
    },
    category: '多模态',
    priority: 1,
    homepage: 'https://arena.ai/leaderboard/text-to-image',
  },
  arena_text_to_video: {
    label: '文生视频竞技场',
    nameEn: 'Text-to-Video Arena',
    blurb: {
      zh: '同一句提示词生成两段视频，真人盲选。Veo、Sora、可灵这些闭源模型能放在一起比，靠的就是这种投票。',
      en: 'Same prompt, two videos, blind human vote. This voting is what makes closed models like Veo, Sora, and Kling comparable at all.',
      ja: '同じプロンプトで2本の動画を生成し、人がブラインド投票。Veo、Sora、Klingなどのクローズドモデルを並べて比較できるのはこの投票のおかげ。',
      ko: '같은 프롬프트로 두 개의 영상을 생성하고 사람들이 블라인드 투표. Veo, Sora, Kling 같은 클로즈드 모델을 함께 비교할 수 있는 것은 이 투표 덕분.',
    },
    category: '多模态',
    priority: 2,
    homepage: 'https://arena.ai/leaderboard/text-to-video',
  },
  arena_image_edit: {
    label: '图像编辑竞技场',
    nameEn: 'Image Edit Arena',
    blurb: {
      zh: '给一张图加一句修改要求，看谁改得更合心意。考的是听懂指令并且只改该改的地方。',
      en: 'Given an image plus an edit instruction, which model edits it better. Tests following instructions while changing only what was asked.',
      ja: '画像と修正指示を渡し、より意図に沿って編集できるかを競う。指示を理解し、必要な部分だけを直す力を測る。',
      ko: '이미지와 수정 요구를 주고 누가 더 의도에 맞게 수정하는지 평가. 지시를 이해하고 필요한 부분만 바꾸는 능력 측정.',
    },
    category: '多模态',
    priority: 3,
    homepage: 'https://arena.ai/leaderboard/image-edit',
  },
  arena_image_to_video: {
    label: '图生视频竞技场',
    nameEn: 'Image-to-Video Arena',
    blurb: {
      zh: '拿一张静态图让它动起来，真人盲选哪段更自然。',
      en: 'Animate a still image; humans blindly vote for the more natural result.',
      ja: '静止画を動かし、どちらが自然かを人がブラインド投票。',
      ko: '정지 이미지를 움직이게 만들고 더 자연스러운 쪽을 사람들이 블라인드 투표.',
    },
    category: '多模态',
    priority: 4,
    homepage: 'https://arena.ai/leaderboard/image-to-video',
  },
  arena_video_edit: {
    label: '视频编辑竞技场',
    nameEn: 'Video Edit Arena',
    blurb: {
      zh: '给一段视频加一句修改要求，看谁改得更好。',
      en: 'Given a video plus an edit instruction, which model edits it better.',
      ja: '動画と修正指示を渡し、より良く編集できるかを競う。',
      ko: '영상과 수정 요구를 주고 누가 더 잘 수정하는지 평가.',
    },
    category: '多模态',
    priority: 5,
    homepage: 'https://arena.ai/leaderboard/video-edit',
  },
  arena_search: {
    label: '联网搜索竞技场',
    nameEn: 'Search Arena',
    blurb: {
      zh: '带联网能力的模型回答时效性问题，真人盲选谁查得准、答得实在。',
      en: 'Web-enabled models answer time-sensitive questions; humans blindly vote for who searches accurately and answers honestly.',
      ja: '検索機能付きモデルが時事問題に回答。誰が正確に調べ、誠実に答えるかを人がブラインド投票。',
      ko: '웹 검색 가능한 모델이 시의성 질문에 답변. 누가 정확히 찾고 성실히 답하는지 사람들이 블라인드 투표.',
    },
    category: '智能体',
    priority: 40,
    homepage: 'https://arena.ai/leaderboard/search',
  },
  arena_document: {
    label: '文档理解竞技场',
    nameEn: 'Document Arena',
    blurb: {
      zh: '丢一份文档进去提问，真人盲选谁读得更明白。',
      en: 'Ask questions about an uploaded document; humans blindly vote for who understood it better.',
      ja: 'ドキュメントを渡して質問。誰がより正確に読み取れたかを人がブラインド投票。',
      ko: '문서를 넣고 질문. 누가 더 정확히 이해했는지 사람들이 블라인드 투표.',
    },
    category: '长文本',
    priority: 40,
    homepage: 'https://arena.ai/leaderboard/document',
  },

  // ── 多模态 ──
  chartography: {
    label: 'Chartography 读图表',
    nameEn: 'Chartography',
    blurb: {
      zh: '看懂各种统计图表并回答问题，考的是从图里准确读出数字和趋势。',
      en: 'Understand statistical charts and answer questions, testing accurate reading of numbers and trends from figures.',
      ja: 'さまざまな統計チャートを読み解き質問に答える。図から数字や傾向を正確に読み取る力を測る。',
      ko: '다양한 통계 차트를 이해하고 질문에 답하기. 그림에서 숫자와 추세를 정확히 읽는 능력 측정.',
    },
    category: '多模态',
    priority: 5,
    homepage: null,
  },
  video_mme: {
    label: '视频理解',
    nameEn: 'Video-MME',
    blurb: {
      zh: 'Video-MME：看一段视频回答问题，从几秒的短片到一小时的长片都有。',
      en: 'Video-MME: answer questions about videos ranging from a few seconds to an hour long.',
      ja: 'Video-MME：数秒の短編から1時間の長編まで、動画を見て質問に答える。',
      ko: 'Video-MME: 몇 초짜리부터 한 시간짜리까지 영상을 보고 질문에 답하기.',
    },
    category: '多模态',
    priority: 10,
    homepage: 'https://video-mme.github.io/',
  },
  geobench: {
    label: '看图猜地点',
    nameEn: 'GeoBench',
    blurb: {
      zh: 'GeoBench：给一张街景照片猜出在哪个国家。测的是视觉细节与地理知识。',
      en: 'GeoBench: guess the country from a street-view photo. Tests visual detail and geographic knowledge.',
      ja: 'GeoBench：ストリートビューの写真から国を当てる。視覚の細部と地理知識を測る。',
      ko: 'GeoBench: 거리 사진을 보고 어느 나라인지 맞히기. 시각적 디테일과 지리 지식 측정.',
    },
    category: '多模态',
    priority: 20,
    homepage: null,
  },
  vpct: {
    label: '视觉物理预测',
    nameEn: 'VPCT',
    blurb: {
      zh: 'VPCT：看一张小球与斜坡的图，预测球会滚进哪个杯子。测视觉直觉物理。',
      en: 'VPCT: given a picture of a ball and ramps, predict which cup the ball rolls into. Tests intuitive visual physics.',
      ja: 'VPCT：ボールと斜面の図を見て、ボールがどのカップに転がるか予測。視覚的な直感物理を測る。',
      ko: 'VPCT: 공과 경사로 그림을 보고 공이 어느 컵에 굴러 들어갈지 예측. 시각적 직관 물리 측정.',
    },
    category: '多模态',
    priority: 30,
    homepage: null,
  },
  spatialviz_bench: {
    label: '空间想象',
    nameEn: 'SpatialViz-Bench',
    blurb: {
      zh: 'SpatialViz-Bench：折纸、旋转、拼接之类的空间想象题。',
      en: 'SpatialViz-Bench: spatial-imagination problems like paper folding, rotation, and assembly.',
      ja: 'SpatialViz-Bench：折り紙、回転、組み立てなどの空間把握問題。',
      ko: 'SpatialViz-Bench: 종이접기, 회전, 조립 같은 공간 상상 문제.',
    },
    category: '多模态',
    priority: 31,
    homepage: null,
  },
  mindcube: {
    label: 'MindCube 空间',
    nameEn: 'MindCube',
    blurb: {
      zh: '从几张不同视角的照片里建立空间关系。',
      en: 'Build spatial relationships from photos taken from different viewpoints.',
      ja: '異なる視点の写真から空間関係を組み立てる。',
      ko: '서로 다른 시점의 사진들로 공간 관계 구성.',
    },
    category: '多模态',
    priority: 32,
    homepage: null,
  },
  gbaeval: {
    label: 'GBA 游戏评测',
    nameEn: 'GBAEval',
    blurb: {
      zh: '看画面操作掌机游戏，测的是视觉理解加实时决策。',
      en: 'Play handheld console games from the screen, testing visual understanding plus real-time decisions.',
      ja: '画面を見て携帯ゲーム機を操作。視覚理解とリアルタイム判断を測る。',
      ko: '화면을 보고 휴대용 게임기 조작. 시각 이해와 실시간 판단 측정.',
    },
    category: '多模态',
    priority: 40,
    homepage: null,
  },

  // ── 游戏与谜题 ──
  chess_puzzles: {
    label: '国际象棋残局',
    nameEn: 'Chess Puzzles',
    blurb: {
      zh: '给一个棋局找出最佳着法。分数是解对的比例，随机乱走约 5 分。',
      en: 'Find the best move in a chess position. The score is the fraction solved; random moves score about 5.',
      ja: 'チェスの局面で最善手を見つける。スコアは正解率で、ランダムでは約5点。',
      ko: '체스 포지션에서 최선의 수 찾기. 점수는 정답 비율이며 무작위는 약 5점.',
    },
    category: '游戏与谜题',
    priority: 10,
    homepage: 'https://epoch.ai/benchmarks/chess-puzzles',
  },
  balrog: {
    label: 'BALROG 游戏',
    nameEn: 'BALROG',
    blurb: {
      zh: '玩 NetHack、我的世界之类的文字或像素游戏，看能推进多少进度。',
      en: 'Play text or pixel games like NetHack and Minecraft, measuring how much progress the model makes.',
      ja: 'NetHackやMinecraftのようなテキスト・ピクセルゲームをプレイし、どれだけ進めるかを測る。',
      ko: 'NetHack, 마인크래프트 같은 텍스트·픽셀 게임을 플레이해 진행도를 측정.',
    },
    category: '游戏与谜题',
    priority: 20,
    homepage: 'https://balrogai.com/',
  },
  mystery_game_puzzles: {
    label: '推理游戏谜题',
    nameEn: 'Mystery Game Puzzles',
    blurb: {
      zh: 'Epoch 自建的一组推理小游戏，测的是在规则未知的环境里摸索规律。',
      en: "Epoch's own set of small reasoning games, testing the ability to discover rules in an unknown environment.",
      ja: 'Epoch独自の小さな推論ゲーム集。ルールのわからない環境で法則を見つける力を測る。',
      ko: 'Epoch가 자체 제작한 소형 추론 게임 모음. 규칙을 모르는 환경에서 법칙을 찾는 능력 측정.',
    },
    category: '游戏与谜题',
    priority: 30,
    homepage: 'https://epoch.ai/benchmarks',
  },
  enigma_eval: {
    label: 'EnigmaEval',
    nameEn: 'EnigmaEval',
    blurb: {
      zh: '解谜比赛里的复杂谜题，通常要综合图像、文字和多步推理。',
      en: 'Complex puzzles from puzzle-hunt competitions, usually combining images, text, and multi-step reasoning.',
      ja: '謎解き大会の複雑なパズル。画像・文字・多段階の推論を組み合わせるのが普通。',
      ko: '퍼즐 대회의 복잡한 문제들. 보통 이미지, 텍스트, 다단계 추론을 결합.',
    },
    category: '游戏与谜题',
    priority: 40,
    homepage: null,
  },
  ebr_bench: {
    label: 'EBR-bench',
    nameEn: 'EBR-bench',
    blurb: {
      zh: 'Epoch 自建的一项评测，具体口径以 Epoch 榜单页说明为准。',
      en: "An in-house Epoch evaluation; see Epoch's benchmark page for the exact methodology.",
      ja: 'Epoch独自の評価。詳細な口径はEpochのベンチマークページを参照。',
      ko: 'Epoch 자체 평가. 구체적 기준은 Epoch 벤치마크 페이지 참조.',
    },
    category: '游戏与谜题',
    priority: 50,
    homepage: 'https://epoch.ai/benchmarks',
  },
  btf3: {
    label: 'BTF3',
    nameEn: 'BTF3',
    blurb: {
      zh: '一项对策略游戏能力的评测。',
      en: 'An evaluation of strategy-game ability.',
      ja: '戦略ゲーム能力の評価。',
      ko: '전략 게임 능력 평가.',
    },
    category: '游戏与谜题',
    priority: 60,
    homepage: null,
  },

  // ── 写作 ──
  lech_mazur_writing: {
    label: '创意写作',
    nameEn: 'Lech Mazur Writing',
    blurb: {
      zh: 'Lech Mazur 的短篇写作评测：按给定元素写故事，由多个模型交叉评分。分数是 0–10 的均分换算成百分制。',
      en: "Lech Mazur's short-story evaluation: write a story from given elements, cross-graded by multiple models. Scores are 0–10 averages converted to a percentage.",
      ja: 'Lech Mazurの短編写作評価：指定要素で物語を書き、複数のモデルが相互採点。スコアは0〜10の平均を百分率に換算。',
      ko: 'Lech Mazur의 단편 글쓰기 평가: 주어진 요소로 이야기를 쓰고 여러 모델이 교차 채점. 점수는 0–10 평균을 백분율로 환산.',
    },
    category: '写作',
    priority: 10,
    homepage: 'https://github.com/lechmazur/writing',
  },
  gdp_pdf: {
    label: 'GDP PDF 报告',
    nameEn: 'GDP PDF',
    blurb: {
      zh: '一项对文档生成质量的评测。',
      en: 'An evaluation of document-generation quality.',
      ja: 'ドキュメント生成品質の評価。',
      ko: '문서 생성 품질 평가.',
    },
    category: '写作',
    priority: 30,
    homepage: null,
  },
};

/**
 * 管线里的榜单 id 与 Epoch 文件名偶有出入（`terminal_bench` vs `terminalbench`，
 * `aime` vs `otis_mock_aime_2024_2025`）。这里把 Epoch 的写法指回管线用的 id，
 * 别名本身不参与展示。
 */
const ALIASES: Record<string, string> = {
  terminalbench: 'terminal_bench',
  frontiercode: 'frontier_code',
  frontierswe: 'frontier_swe',
  webdev_arena: 'webdev_arena_elo',
  live_bench: 'livebench_coding',
  epoch_capabilities_index: 'eci',
  otis_mock_aime_2024_2025: 'aime',
  fictionlivebench: 'fiction_live',
};

/** 编程类直接从编程注册表派生，一处维护 */
function codingEntries(): Record<string, BenchmarkInfo> {
  const out: Record<string, BenchmarkInfo> = {};
  for (const [id, league] of Object.entries(CODING_LEAGUES)) {
    out[id] = {
      label: league.label,
      nameEn: league.nameEn,
      blurb: league.blurb,
      category: '编程',
      higherIsBetter: true,
      priority: league.priority,
      homepage: league.homepage,
    };
  }
  return out;
}

const REGISTRY: Record<string, BenchmarkInfo> = (() => {
  const table: Record<string, BenchmarkInfo> = {
    ...Object.fromEntries(
      Object.entries(GENERAL).map(([id, e]) => [id, { ...e, higherIsBetter: e.higherIsBetter ?? true }]),
    ),
    ...codingEntries(),
  };
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (table[target] && !table[alias]) table[alias] = table[target];
  }
  return table;
})();

/**
 * 把 `os_world_2` 这样的 id 变成 `Os World 2`。
 * 只在兜底路径上用——收录过的榜单一律以注册表里的中文名为准。
 */
function prettifyId(id: string): string {
  return id
    .split(/[_-]+/)
    .filter(Boolean)
    .map((w) => (w.length <= 3 && !/^\d+$/.test(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
}

/**
 * 同一个榜单在 `coding[]` 与 `scores[]` 里可能用不同的 id（`webdev_arena_elo` / `webdev_arena`）。
 * 统一到编程注册表的写法，否则同一个榜会在排行榜上开成两条赛道。
 */
export function canonicalBenchmarkId(id: string): string {
  return ALIASES[id] ?? id;
}

/** 把榜单 id 转成可读档案。未收录时自动生成标签并归入「其他」，绝不抛错。 */
export function benchmarkOf(id: string): BenchmarkInfo {
  const known = REGISTRY[id];
  if (known) return known;
  const pretty = prettifyId(id);
  return (
    {
      label: pretty,
      nameEn: pretty,
      blurb: {
        zh: 'Epoch AI 收录的评测，暂无中文说明。',
        en: 'A benchmark tracked by Epoch AI; no description available yet.',
        ja: 'Epoch AI収録の評価。説明はまだない。',
        ko: 'Epoch AI가 수록한 평가. 설명 없음.',
      },
      category: '其他',
      higherIsBetter: true,
      priority: 500,
      homepage: null,
    }
  );
}

/** 这个榜单是不是编程类。编程成绩另有一张战绩表，「全部成绩」区块要把它们排除 */
export function isCodingBenchmark(id: string): boolean {
  return benchmarkOf(id).category === '编程';
}

/** 榜单显示名：zh 用中文短名，en/ja/ko 一律用上游官方英文名。 */
export function benchmarkName(info: BenchmarkInfo, lang: Lang): string {
  return lang === 'zh' ? info.label : info.nameEn;
}

/** 榜单的一句话说明，按语言取值。 */
export function benchmarkDescription(info: BenchmarkInfo, lang: Lang): string {
  return info.blurb[lang];
}

/** 分类的显示名，按语言取值。 */
export function categoryName(cat: BenchmarkCategoryInfo, lang: Lang): string {
  return cat.name[lang];
}
