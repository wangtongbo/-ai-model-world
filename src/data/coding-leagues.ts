/**
 * 编程赛制注册表。
 *
 * 这是继 `vendor-registry.ts` 之后第二处**人类常识层**：机器能读出
 * 「这个模型在 Terminal-Bench 上拿了 73.4」，读不出「Terminal-Bench 考的是
 * 能不能在真实终端里干完一件活，和 SWE-bench 修 bug 不是一回事」。
 *
 * 与厂商注册表遵循同一条铁律：**查表而非逻辑，未收录的赛制自动兜底**。
 * 上游随时会冒出新榜单，注册表里没有它也不会让页面崩掉，
 * 只是显示成通用措辞。这是零维护承诺的一部分。
 */

import type { Attribution, ScoreUnit } from '@/lib/types';
import type { Lang, LText } from '@/lib/i18n/types';

export interface CodingLeague {
  /** 界面上的短名，尽量用中文，实在没有通行译法就保留英文原名 */
  label: string;
  /** 上游榜单的官方英文名。en/ja/ko 语言一律用它展示（榜单名不翻译）。 */
  nameEn: string;
  /** 一句话说清它考什么，给悬停提示与详情页用。zh 为原文，en/ja/ko 为人工翻译。 */
  blurb: LText;
  unit: ScoreUnit;
  /**
   * 展示优先级，数字越小越优先。同一个模型在多个赛制都有成绩时，
   * 卡片上只展示优先级最高的那一条，其余留给详情页。
   *
   * 排序依据是「这个赛制离『会不会写代码』这个问题有多近」，
   * 不是「谁测的」——测量方由每条成绩自己的 `attribution` 字段承载，
   * 在同一个赛制内部作为次级排序。
   *
   * 这个区分踩过一次：把 WebDev Arena 排在最前之后，
   * 一张卡的「编程」是 SWE-bench 的百分数、另一张是 Elo 分，
   * 同一行标签在不同卡片上指的不是同一件事，横向扫过去反而更糊涂。
   * 现在 SWE 家族一律优先，WebDev 只在完全没有 SWE 成绩时兜底，
   * 而且会把那一行的标签改成「前端」。
   */
  priority: number;
  /**
   * 用这个赛制时，能力条那一行的标签要改成什么。
   * 只有口径明显不是「通用编程」的赛制才需要，缺省沿用「编程」。
   */
  rowLabel?: LText;
  /** 榜单方自己的主页，用于详情页署名 */
  homepage: string | null;
}

/**
 * 收录的赛制。
 *
 * `priority` 的分段约定：
 *   10–19  SWE-bench 本尊，业界默认的「编程能力」就是指它
 *   20–29  SWE-bench 的变体（更难的 Pro、多语言版）
 *   30–49  其他通用编程赛制（终端操作、代码编辑、竞赛题）
 *   50+    口径明显偏窄的赛制，只在没有别的成绩时兜底，且会改写行标签
 */
export const CODING_LEAGUES: Record<string, CodingLeague> = {
  // ── SWE-bench 家族：业界默认说「编程能力」指的就是这一套 ──
  swe_bench_verified: {
    label: 'SWE-bench Verified',
    nameEn: 'SWE-bench Verified',
    blurb: {
      zh: '从真实 GitHub 仓库里挑出的 500 个 issue，看模型能不能提交出通过测试的补丁。业界最通行的编程标尺。这一列由 Epoch AI 用统一脚手架复跑。',
      en: '500 issues picked from real GitHub repos; the model must submit a patch that passes the tests. The industry-standard coding yardstick. This column is re-run by Epoch AI on a unified harness.',
      ja: '実際のGitHubリポジトリから選ばれた500件のissueに対し、テストを通るパッチを提出できるかを測る。業界標準のコーディング指標。この列はEpoch AIが統一ハーネスで再実行したもの。',
      ko: '실제 GitHub 저장소에서 선별한 500개 이슈에 대해 테스트를 통과하는 패치를 제출할 수 있는지 측정. 업계 표준 코딩 지표. 이 열은 Epoch AI가 통합 하네스로 재실행한 결과.',
    },
    unit: 'pct',
    priority: 10,
    homepage: 'https://www.swebench.com/',
  },
  /*
   * 与上面同一套题，但分数是从厂商系统卡或第三方榜单转载来的，不是 Epoch 复跑。
   * 赛制 id 沿用了管线里的历史字段名 `swe_bench_vendor`，实际测量方由每条成绩
   * 自己的 attribution 字段决定——转载来源里既有厂商自评也有中立榜单。
   * 分位池按「赛制 + 测量方」分组，所以这两类不会被混算。
   */
  swe_bench_vendor: {
    label: 'SWE-bench Verified（转载）',
    nameEn: 'SWE-bench Verified (reposted)',
    blurb: {
      zh: '同样是 SWE-bench Verified，但分数来自厂商系统卡或其他榜单的转载，没有经过 Epoch 的统一复跑。',
      en: 'The same SWE-bench Verified, but scores are reposted from vendor system cards or other leaderboards, without a unified Epoch re-run.',
      ja: '同じSWE-bench Verifiedだが、スコアはベンダーのシステムカードや他のリーダーボードからの転載で、Epochによる統一的な再実行は行われていない。',
      ko: '같은 SWE-bench Verified이지만, 점수는 벤더 시스템 카드나 다른 리더보드에서 전재한 것으로 Epoch의 통합 재실행을 거치지 않음.',
    },
    unit: 'pct',
    priority: 12,
    homepage: 'https://www.swebench.com/',
  },
  swe_bench_multilingual: {
    label: 'SWE-bench 多语言版',
    nameEn: 'SWE-bench Multilingual',
    blurb: {
      zh: '把 SWE-bench 的题目扩展到 Python 以外的语言，考的是跨语言的工程能力。',
      en: 'Extends SWE-bench beyond Python, testing engineering ability across languages.',
      ja: 'SWE-benchの問題をPython以外の言語に拡張し、言語横断のエンジニアリング能力を測る。',
      ko: 'SWE-bench 문제를 Python 외 언어로 확장해 언어 간 엔지니어링 능력을 측정.',
    },
    unit: 'pct',
    priority: 20,
    homepage: 'https://www.swebench.com/',
  },
  swe_bench_pro: {
    label: 'SWE-Bench Pro',
    nameEn: 'SWE-Bench Pro',
    blurb: {
      zh: '同一个思路但难度高得多的版本，题目更长、依赖更复杂。分数普遍比 Verified 低三十分左右，两者不可直接比较。',
      en: 'Same idea but far harder: longer tasks and more complex dependencies. Scores run about 30 points below Verified, so the two are not directly comparable.',
      ja: '同じ発想で難度がはるかに高い版。問題が長く、依存関係も複雑。スコアはVerifiedより30点ほど低くなるのが普通で、直接比較はできない。',
      ko: '같은 방식이지만 훨씬 어려운 버전. 문제가 더 길고 의존성이 복잡. 점수가 보통 Verified보다 30점가량 낮아 직접 비교 불가.',
    },
    unit: 'pct',
    priority: 22,
    homepage: 'https://scale.com/leaderboard/swe_bench_pro_public',
  },
  swe_bench_multimodal: {
    label: 'SWE-bench 多模态版',
    nameEn: 'SWE-bench Multimodal',
    blurb: {
      zh: '题目里带截图和界面录屏的 SWE-bench 变体，考的是能不能看懂视觉线索再改代码。',
      en: 'A SWE-bench variant whose tasks include screenshots and UI recordings, testing whether the model can read visual cues before changing code.',
      ja: 'スクリーンショットや画面録画を含むSWE-benchの変種。視覚的な手がかりを読み取ってからコードを直せるかを測る。',
      ko: '스크린샷과 화면 녹화가 포함된 SWE-bench 변형. 시각적 단서를 이해하고 코드를 수정할 수 있는지 측정.',
    },
    unit: 'pct',
    priority: 24,
    homepage: 'https://www.swebench.com/multimodal.html',
  },
  swe_marathon: {
    label: 'SWE-Marathon',
    nameEn: 'SWE-Marathon',
    blurb: {
      zh: '超长时程的软件工程任务，一道题要连续工作很久，考的是耐力与不跑偏。',
      en: 'Very long-horizon software engineering tasks where one problem takes sustained work, testing endurance and staying on track.',
      ja: '非常に長時間のソフトウェア工学タスク。一題に長く取り組み続ける持久力と、脱線しない力を測る。',
      ko: '초장시간 소프트웨어 엔지니어링 작업. 한 문제를 오래 지속해 처리하는 지구력과 일관성을 측정.',
    },
    unit: 'pct',
    priority: 26,
    homepage: null,
  },
  frontier_swe: {
    label: 'FrontierSWE',
    nameEn: 'FrontierSWE',
    blurb: {
      zh: '面向前沿模型设计的高难度软件工程题，普通模型基本做不动，用来拉开顶尖选手之间的差距。',
      en: 'Hard software engineering problems designed for frontier models; ordinary models can barely make progress, so it separates the very best.',
      ja: 'フロンティアモデル向けに設計された高難度のソフトウェア工学問題。一般のモデルはほぼ歯が立たず、トップ層の差を広げるためのもの。',
      ko: '프론티어 모델용으로 설계된 고난도 소프트웨어 엔지니어링 문제. 일반 모델은 거의 풀지 못해 최상위권 간 격차를 가르는 데 사용.',
    },
    unit: 'pct',
    priority: 28,
    homepage: 'https://frontierswe.com/',
  },
  deepswe: {
    label: 'DeepSWE',
    nameEn: 'DeepSWE',
    blurb: {
      zh: 'SWE-bench Verified 的一个变体测法，用不同的 agent 脚手架跑同一批题。',
      en: 'A variant run of SWE-bench Verified: the same problem set executed with a different agent harness.',
      ja: 'SWE-bench Verifiedの別測定方式。同じ問題セットを異なるエージェントハーネスで実行。',
      ko: 'SWE-bench Verified의 변형 측정법. 같은 문제를 다른 에이전트 하네스로 실행.',
    },
    unit: 'pct',
    priority: 29,
    homepage: 'https://deepswe.datacurve.ai/',
  },

  // ── 终端与真实工作环境 ──
  terminal_bench: {
    label: 'Terminal-Bench',
    nameEn: 'Terminal-Bench',
    blurb: {
      zh: '把模型丢进一个真实终端里让它自己干完一件活——装环境、跑脚本、调错。考的是当「实习生」的本事，不只是写代码。',
      en: 'Drops the model into a real terminal to finish a job on its own — set up environments, run scripts, debug. Tests "intern" skills, not just coding.',
      ja: '実際のターミナルにモデルを放り込み、環境構築・スクリプト実行・デバッグまで一人でやり切らせる。コーディングだけでなく「インターン」としての実力を測る。',
      ko: '실제 터미널에 모델을 넣고 환경 설정, 스크립트 실행, 디버깅까지 스스로 완수하게 함. 코딩만이 아닌 "인턴" 역량을 측정.',
    },
    unit: 'pct',
    priority: 30,
    homepage: 'https://www.tbench.ai/',
  },
  terminal_bench_2_0: {
    label: 'Terminal-Bench 2.0',
    nameEn: 'Terminal-Bench 2.0',
    blurb: {
      zh: 'Terminal-Bench 的第二代题库，任务更长更杂。与 1.0 的分数不可直接比较。',
      en: 'The second-generation Terminal-Bench task set, with longer and more varied tasks. Not directly comparable with 1.0 scores.',
      ja: 'Terminal-Benchの第2世代問題集。タスクがより長く多岐にわたる。1.0のスコアとは直接比較できない。',
      ko: 'Terminal-Bench 2세대 문제 세트. 작업이 더 길고 다양. 1.0 점수와 직접 비교 불가.',
    },
    unit: 'pct',
    priority: 31,
    homepage: 'https://www.tbench.ai/',
  },
  terminal_bench_2_1: {
    label: 'Terminal-Bench 2.1',
    nameEn: 'Terminal-Bench 2.1',
    blurb: {
      zh: 'Terminal-Bench 第二代的修订版题库。与其他代次的分数不可直接比较。',
      en: 'A revised edition of the second-generation Terminal-Bench task set. Not directly comparable with other generations.',
      ja: 'Terminal-Bench第2世代の改訂版問題集。他の世代のスコアとは直接比較できない。',
      ko: 'Terminal-Bench 2세대의 개정판 문제 세트. 다른 세대의 점수와 직접 비교 불가.',
    },
    unit: 'pct',
    priority: 32,
    homepage: 'https://www.tbench.ai/',
  },
  terminal_bench_4_0: {
    label: 'Terminal-Bench 4.0',
    nameEn: 'Terminal-Bench 4.0',
    blurb: {
      zh: 'Terminal-Bench 的第四代题库，在真实终端里完成多步骤的专业任务。与其他代次的分数不可直接比较。',
      en: 'The fourth-generation Terminal-Bench task set: multi-step professional tasks in a real terminal. Not directly comparable with other generations.',
      ja: 'Terminal-Benchの第4世代問題集。実際のターミナルで多段階の専門タスクをこなす。他の世代のスコアとは直接比較できない。',
      ko: 'Terminal-Bench 4세대 문제 세트. 실제 터미널에서 다단계 전문 작업을 수행. 다른 세대 점수와 직접 비교 불가.',
    },
    unit: 'pct',
    priority: 29.5,
    homepage: 'https://www.tbench.ai/',
  },
  cursorbench: {
    label: 'CursorBench',
    nameEn: 'CursorBench',
    blurb: {
      zh: '在真实 IDE 里做代码编辑的测试，题目来自 Cursor 收集的实际使用场景。',
      en: 'Code-editing tests inside a real IDE, with tasks drawn from real usage scenarios collected by Cursor.',
      ja: '実際のIDEでコード編集を行うテスト。問題はCursorが収集した実利用シーンから。',
      ko: '실제 IDE에서 코드 편집을 테스트. 문제는 Cursor가 수집한 실제 사용 시나리오 기반.',
    },
    unit: 'pct',
    priority: 33,
    homepage: 'https://cursor.com/cursorbench',
  },

  // ── 代码编辑与生成 ──
  aider_polyglot: {
    label: 'Aider Polyglot',
    nameEn: 'Aider Polyglot',
    blurb: {
      zh: '多语言代码编辑测试，看模型能不能按要求准确改动已有代码。榜单已停更在 2025 年底，只覆盖那之前的模型。',
      en: 'Multilingual code-editing test: can the model modify existing code exactly as requested. The leaderboard stopped updating at the end of 2025 and only covers models from before then.',
      ja: '多言語のコード編集テスト。既存コードを指示どおり正確に変更できるかを見る。ランキングは2025年末で更新停止、それ以前のモデルのみカバー。',
      ko: '다국어 코드 편집 테스트. 기존 코드를 요구대로 정확히 수정할 수 있는지 측정. 리더보드는 2025년 말 업데이트 중단, 그 이전 모델만 포함.',
    },
    unit: 'pct',
    priority: 36,
    homepage: 'https://aider.chat/docs/leaderboards/',
  },
  nl2repo: {
    label: 'NL2Repo',
    nameEn: 'NL2Repo',
    blurb: {
      zh: '从一段自然语言需求直接生成一整个可运行的代码仓库。',
      en: 'Generates an entire runnable code repository straight from a natural-language requirement.',
      ja: '自然言語の要件から、実行可能なコードリポジトリ全体を直接生成する。',
      ko: '자연어 요구사항에서 실행 가능한 코드 저장소 전체를 바로 생성.',
    },
    unit: 'pct',
    priority: 38,
    homepage: null,
  },
  frontier_code: {
    label: 'FrontierCode',
    nameEn: 'FrontierCode',
    blurb: {
      zh: 'Cognition 出的高难度代码题集，面向前沿模型。',
      en: 'A hard coding problem set from Cognition, aimed at frontier models.',
      ja: 'Cognitionによる高難度コード問題集。フロンティアモデル向け。',
      ko: 'Cognition이 만든 고난도 코드 문제집. 프론티어 모델 대상.',
    },
    unit: 'pct',
    priority: 40,
    homepage: 'https://cognition.com/frontiercode',
  },
  program_bench: {
    label: 'ProgramBench',
    nameEn: 'ProgramBench',
    blurb: {
      zh: '通用程序设计能力测试。',
      en: 'A general-purpose programming ability test.',
      ja: '汎用的なプログラミング能力テスト。',
      ko: '범용 프로그래밍 능력 테스트.',
    },
    unit: 'pct',
    priority: 42,
    homepage: null,
  },
  livebench_coding: {
    label: 'LiveBench 编程分项',
    nameEn: 'LiveBench Coding',
    blurb: {
      zh: 'LiveBench 每月换新题以避免污染，这一列是它的编程分项均分。',
      en: 'LiveBench refreshes its questions monthly to avoid contamination; this column is the average of its coding category.',
      ja: 'LiveBenchは汚染を避けるため毎月問題を入れ替える。この列はそのコーディング分野の平均点。',
      ko: 'LiveBench는 오염 방지를 위해 매달 문제를 교체. 이 열은 코딩 부문 평균 점수.',
    },
    unit: 'pct',
    priority: 43,
    homepage: 'https://livebench.ai/',
  },
  livebench_agentic_coding: {
    label: 'LiveBench 智能体编程',
    nameEn: 'LiveBench Agentic Coding',
    blurb: {
      zh: 'LiveBench 的智能体编程分项：不是写一段代码，而是像开发者那样多轮改动一个项目。',
      en: "LiveBench's agentic coding category: not writing a snippet, but iterating on a project over multiple rounds like a developer.",
      ja: 'LiveBenchのエージェント型コーディング分野。コード片を書くのではなく、開発者のように複数ラウンドでプロジェクトを改修する。',
      ko: 'LiveBench의 에이전틱 코딩 부문. 코드 조각이 아니라 개발자처럼 여러 차례에 걸쳐 프로젝트를 수정.',
    },
    unit: 'pct',
    priority: 35,
    homepage: 'https://livebench.ai/',
  },
  livecodebench: {
    label: 'LiveCodeBench',
    nameEn: 'LiveCodeBench',
    blurb: {
      zh: '持续收录新出的编程竞赛题，题目发布时间晚于模型训练截止日期，用来避开「背过答案」的嫌疑。',
      en: 'Continuously collects newly released competitive-programming problems published after model training cutoffs, avoiding any "memorized the answers" suspicion.',
      ja: '新しい競技プログラミング問題を継続収録。問題の公開がモデルの学習締切より後なので、「答えを暗記していた」という疑いを避けられる。',
      ko: '새로운 경쟁 프로그래밍 문제를 지속 수록. 문제 공개 시점이 모델 학습 마감 이후라 "정답을 외웠다"는 의혹을 회피.',
    },
    unit: 'pct',
    priority: 44,
    homepage: 'https://livecodebench.github.io/',
  },
  livecodebench_v6: {
    label: 'LiveCodeBench v6',
    nameEn: 'LiveCodeBench v6',
    blurb: {
      zh: 'LiveCodeBench 的第六版题库切片。不同版本之间的分数不可直接比较。',
      en: 'The v6 slice of the LiveCodeBench problem set. Scores are not directly comparable across versions.',
      ja: 'LiveCodeBenchの第6版問題セット。バージョン間のスコアは直接比較できない。',
      ko: 'LiveCodeBench v6 문제 세트. 버전 간 점수는 직접 비교 불가.',
    },
    unit: 'pct',
    priority: 45,
    homepage: 'https://livecodebench.github.io/',
  },
  livecodebench_pro: {
    label: 'LiveCodeBench Pro',
    nameEn: 'LiveCodeBench Pro',
    blurb: {
      zh: 'LiveCodeBench 的高难度版本，题目取自竞赛中的难题。',
      en: 'The hard version of LiveCodeBench, with problems taken from the toughest competition questions.',
      ja: 'LiveCodeBenchの高難度版。問題は競技の難問から採用。',
      ko: 'LiveCodeBench 고난도 버전. 대회의 어려운 문제로 구성.',
    },
    unit: 'pct',
    priority: 46,
    homepage: 'https://livecodebench.github.io/',
  },
  claw_eval: {
    label: 'ClawEval',
    nameEn: 'ClawEval',
    blurb: {
      zh: '一套面向代码智能体的评测。',
      en: 'An evaluation suite for coding agents.',
      ja: 'コードエージェント向けの評価セット。',
      ko: '코드 에이전트를 위한 평가 세트.',
    },
    unit: 'pct',
    priority: 48,
    homepage: null,
  },

  /*
   * 以下几个赛制的口径明显只覆盖编程能力的一个侧面，
   * 拿它们兜底时会改写能力条那一行的标签，避免「编程」这两个字
   * 在不同卡片上指的不是同一件事。
   */
  /*
   * 这两个赛制的分数**不是百分数**，是自定义标度。判错量纲会让界面印出
   * 「2176.9%」这种一看就是错的数字，所以 unit 必须和管线产出保持一致。
   */
  ale_bench: {
    label: 'ALE-Bench',
    nameEn: 'ALE-Bench',
    blurb: {
      zh: 'AtCoder 启发式算法竞赛题，考的是给一个没有标准答案的优化问题找出尽量好的解。分数是 137–2177 的评分标度，不是百分比。和「修 bug」是两种能力。',
      en: 'AtCoder-style heuristic contest problems: find the best solution you can to optimization problems with no exact answer. Scores use a 137–2177 rating scale, not percentages. A different skill from bug fixing.',
      ja: 'AtCoder式のヒューリスティックコンテスト問題。正解のない最適化問題にできるだけ良い解を出す。スコアは137–2177のレーティングで、パーセントではない。バグ修正とは別の能力。',
      ko: 'AtCoder식 휴리스틱 대회 문제. 정답이 없는 최적화 문제에 최대한 좋은 해를 찾음. 점수는 137–2177 레이팅 척도로 백분율이 아님. 버그 수정과는 다른 능력.',
    },
    unit: 'index',
    priority: 50,
    rowLabel: { zh: '算法', en: 'Algorithms', ja: 'アルゴリズム', ko: '알고리즘' },
    homepage: null,
  },
  algotune: {
    label: 'AlgoTune',
    nameEn: 'AlgoTune',
    blurb: {
      zh: '给定一段算法实现，让模型把它调得更快。分数是加速倍率（约 1.3–2 倍），不是百分比。考的是性能调优而不是功能实现。',
      en: 'Given an algorithm implementation, the model must make it run faster. Scores are speedup ratios (about 1.3–2x), not percentages. Tests performance tuning, not feature implementation.',
      ja: '既存のアルゴリズム実装をより速くする課題。スコアは高速化倍率（約1.3〜2倍）で、パーセントではない。機能実装ではなく性能チューニングを測る。',
      ko: '주어진 알고리즘 구현을 더 빠르게 개선. 점수는 가속 배율(약 1.3–2배)로 백분율이 아님. 기능 구현이 아닌 성능 튜닝 능력 측정.',
    },
    unit: 'index',
    priority: 51,
    rowLabel: { zh: '调优', en: 'Tuning', ja: 'チューニング', ko: '튜닝' },
    homepage: null,
  },
  gso: {
    label: 'GSO',
    nameEn: 'GSO',
    blurb: {
      zh: '代码性能优化测试：在保持功能不变的前提下把真实项目跑得更快。',
      en: 'A code performance optimization test: make real projects run faster without changing behavior.',
      ja: 'コード性能最適化テスト。挙動を変えずに実際のプロジェクトを高速化する。',
      ko: '코드 성능 최적화 테스트. 동작을 바꾸지 않고 실제 프로젝트를 더 빠르게 실행.',
    },
    unit: 'pct',
    priority: 52,
    rowLabel: { zh: '调优', en: 'Tuning', ja: 'チューニング', ko: '튜닝' },
    homepage: 'https://gso-bench.github.io/',
  },
  swe_atlas_codebase_qna: {
    label: 'SWE-Atlas 代码库问答',
    nameEn: 'SWE-Atlas Codebase Q&A',
    blurb: {
      zh: '给模型一个陌生的大型代码库，问它这段代码在干什么。考的是读代码，不是写代码。',
      en: 'Given an unfamiliar large codebase, the model answers questions about what the code does. Tests reading code, not writing it.',
      ja: '未知の大規模コードベースを渡し、そのコードが何をしているかを問う。書く力ではなく読む力を測る。',
      ko: '낯선 대규모 코드베이스를 주고 코드가 무엇을 하는지 질문. 쓰기가 아닌 읽기 능력 측정.',
    },
    unit: 'pct',
    priority: 53,
    rowLabel: { zh: '读码', en: 'Code Reading', ja: 'コード理解', ko: '코드 읽기' },
    homepage: 'https://scale.com/leaderboard',
  },
  swe_atlas_refactoring: {
    label: 'SWE-Atlas 重构',
    nameEn: 'SWE-Atlas Refactoring',
    blurb: {
      zh: '在不改变行为的前提下重构已有代码。',
      en: 'Refactor existing code without changing its behavior.',
      ja: '挙動を変えずに既存コードをリファクタリングする。',
      ko: '동작을 바꾸지 않고 기존 코드를 리팩터링.',
    },
    unit: 'pct',
    priority: 54,
    rowLabel: { zh: '重构', en: 'Refactoring', ja: 'リファクタリング', ko: '리팩터링' },
    homepage: 'https://scale.com/leaderboard',
  },
  swe_atlas_test_writing: {
    label: 'SWE-Atlas 写测试',
    nameEn: 'SWE-Atlas Test Writing',
    blurb: {
      zh: '给已有代码补写测试用例。',
      en: 'Write test cases for existing code.',
      ja: '既存コードにテストケースを書き足す。',
      ko: '기존 코드에 테스트 케이스 작성.',
    },
    unit: 'pct',
    priority: 55,
    rowLabel: { zh: '写测试', en: 'Testing', ja: 'テスト作成', ko: '테스트 작성' },
    homepage: 'https://scale.com/leaderboard',
  },
  mle_bench: {
    label: 'MLE-Bench',
    nameEn: 'MLE-Bench',
    blurb: {
      zh: '让模型自己完成一整个机器学习工程任务——处理数据、训模型、调参、提交结果。',
      en: 'The model completes an entire machine learning engineering task itself — process data, train a model, tune it, submit results.',
      ja: 'データ処理・学習・調整・提出まで、機械学習エンジニアリングのタスク全体をモデルが自力で完遂する。',
      ko: '데이터 처리, 모델 학습, 튜닝, 결과 제출까지 머신러닝 엔지니어링 작업 전체를 모델이 스스로 완수.',
    },
    unit: 'pct',
    priority: 56,
    rowLabel: { zh: '炼丹', en: 'ML Engineering', ja: 'MLエンジニアリング', ko: 'ML 엔지니어링' },
    homepage: null,
  },
  mirrorcode: {
    label: 'MirrorCode',
    nameEn: 'MirrorCode',
    blurb: {
      zh: 'Epoch AI 自测的一项代码评测。',
      en: 'A code evaluation run by Epoch AI itself.',
      ja: 'Epoch AIが自ら実施するコード評価。',
      ko: 'Epoch AI가 자체적으로 수행하는 코드 평가.',
    },
    unit: 'pct',
    priority: 57,
    homepage: 'https://epoch.ai/benchmarks',
  },
  webdev_arena_elo: {
    label: 'WebDev Arena',
    nameEn: 'WebDev Arena',
    blurb: {
      zh: '让两个模型各写一个网页，由人来投票选哪个更好，按对战胜负算 Elo 分。考的是前端开发的实际观感，和「能不能修复一个后端 bug」不是一回事。',
      en: 'Two models each build a web page and humans vote for the better one; Elo is computed from the matches. Tests the look and feel of front-end work, which is different from fixing a back-end bug.',
      ja: '2つのモデルがそれぞれWebページを作り、人がどちらが良いか投票。対戦結果からEloを算出。フロントエンドの実際の出来栄えを測り、バックエンドのバグ修正とは別物。',
      ko: '두 모델이 각각 웹 페이지를 만들고 사람들이 더 나은 쪽에 투표. 대결 결과로 Elo 산출. 프런트엔드의 실제 완성도를 측정하며 백엔드 버그 수정과는 다른 영역.',
    },
    unit: 'elo',
    priority: 60,
    rowLabel: { zh: '前端', en: 'Front-end', ja: 'フロントエンド', ko: '프런트엔드' },
    homepage: 'https://web.lmarena.ai/leaderboard',
  },
};

/** 未收录赛制的兜底档案。 */
const FALLBACK: CodingLeague = {
  label: '编程评测',
  nameEn: 'Coding Benchmark',
  blurb: {
    zh: '一项公开的编程能力评测。这个榜单还没有收进本站的赛制说明表，所以只能给出通用描述。',
    en: 'A public coding benchmark. This leaderboard is not yet in our league registry, so only a generic description is available.',
    ja: '公開のプログラミング評価。このランキングはまだサイトの説明表に未収録のため、汎用的な説明のみ。',
    ko: '공개 코딩 벤치마크. 이 리더보드는 아직 사이트의 설명표에 등록되지 않아 일반적인 설명만 제공.',
  },
  unit: 'pct',
  priority: 90,
  homepage: null,
};

/** 把上游的赛制 id 转成可读档案。未收录时给通用兜底，绝不抛错。 */
export function leagueOf(id: string): CodingLeague {
  const league = CODING_LEAGUES[id];
  if (league) return league;
  const pretty = prettifyLeagueId(id);
  return { ...FALLBACK, label: pretty, nameEn: pretty };
}

/**
 * 把 `terminal_bench_hard` 这样的 id 变成 `Terminal Bench Hard`。
 * 只在兜底路径上用——收录过的赛制一律以注册表里的中文名为准。
 */
function prettifyLeagueId(id: string): string {
  return id
    .split(/[_-]+/)
    .filter(Boolean)
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
}

/** 赛制显示名：zh 用中文短名，en/ja/ko 一律用上游官方英文名。 */
export function leagueName(league: CodingLeague, lang: Lang): string {
  return lang === 'zh' ? league.label : league.nameEn;
}

/** 赛制的一句话说明，按语言取值。 */
export function leagueDescription(league: CodingLeague, lang: Lang): string {
  return league.blurb[lang];
}

/** 能力条行标签，按语言取值；未设置时返回 undefined（沿用「编程」默认措辞）。 */
export function leagueRowLabel(league: CodingLeague, lang: Lang): string | undefined {
  return league.rowLabel?.[lang];
}

/** 「第三方实测 / 厂商自报」的四语言文案。 */
const ATTRIBUTION_TEXT: Record<Attribution, LText> = {
  'third-party': { zh: '第三方实测', en: 'Third-party tested', ja: '第三者実測', ko: '제3자 실측' },
  'vendor-self-reported': { zh: '厂商自报', en: 'Self-reported', ja: 'ベンダー自己申告', ko: '벤더 자체 보고' },
};

/** 第三方复核过的成绩在界面上有更强的视觉肯定，措辞也不同。 */
export function attributionLabel(a: Attribution): string {
  return ATTRIBUTION_TEXT[a].zh;
}

/** 按语言取「第三方实测 / 厂商自报」。 */
export function attributionText(a: Attribution, lang: Lang): string {
  return ATTRIBUTION_TEXT[a][lang];
}
