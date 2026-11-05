import type { BenchmarkScore } from '@/lib/types';
import { attributionText, leagueDescription, leagueName, leagueOf } from '@/data/coding-leagues';
import { formatScoreByUnit } from '@/lib/format';
import { getDict, type Lang } from '@/lib/i18n';
import { outbound } from '@/lib/outbound';

/**
 * 编程战绩明细。
 *
 * 广场卡片上那一行只显示「榜内第几」，因为二十多个赛制的原始分数互不可比，
 * 并排摆在一起一定会被读者直接比大小。原始分数不是不重要，是不该出现在
 * 一个用于横向扫视的位置——所以全都落在这里。
 *
 * 一个赛制一行，写清分数、谁测的、出处链接。同一个模型在不同赛制上
 * 分数差二三十分是常态，这张表存在的意义之一就是让人亲眼看到这件事。
 */
export function CodingLedger({ scores, lang }: { scores: BenchmarkScore[]; lang: Lang }) {
  const dict = getDict(lang);
  if (scores.length === 0) {
    return (
      <p className="text-[12px] leading-relaxed text-[var(--color-ghost)]">
        {dict.ui.ledger.empty1}
        <br />
        {dict.ui.ledger.empty2}
      </p>
    );
  }

  const sorted = [...scores].sort(
    (a, b) => leagueOf(a.league).priority - leagueOf(b.league).priority,
  );

  return (
    <>
      <ul className="flex flex-col">
        {sorted.map((s) => {
          const league = leagueOf(s.league);
          const thirdParty = s.attribution === 'third-party';
          const homepage = outbound(league.homepage);
          const source = outbound(s.sourceUrl);
          return (
            <li
              key={`${s.league}-${s.source}`}
              className="border-b border-white/10 py-2 last:border-0"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12px] text-[var(--color-parchment)]">
                  {homepage ? (
                    <a
                      href={homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[var(--color-gold)]"
                    >
                      {leagueName(league, lang)}
                    </a>
                  ) : (
                    leagueName(league, lang)
                  )}
                </span>
                <span className="shrink-0 text-right text-xs tabular-nums text-[var(--color-gold)]">
                  {formatScoreByUnit(s.score, s.unit)}
                </span>
              </div>
              <div className="mt-0.5 flex items-baseline justify-between gap-3">
                <span className="text-[12px] leading-snug text-[var(--color-ghost)]">
                  {leagueDescription(league, lang)}
                </span>
                <span
                  className="shrink-0 text-[12px]"
                  style={{ color: thirdParty ? 'var(--color-newborn)' : 'var(--color-ghost)' }}
                  title={thirdParty ? dict.ui.ledger.thirdPartyHint : dict.ui.ledger.selfReportHint}
                >
                  {attributionText(s.attribution, lang)}
                </span>
              </div>
              {source && (
                <a
                  href={source}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 block truncate text-[12px] text-[var(--color-ghost)] hover:text-[var(--color-parchment)]"
                >
                  {source}
                </a>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[12px] leading-relaxed text-[var(--color-ghost)]">
        {dict.ui.ledger.footnotePre}
        <strong className="text-[var(--color-parchment)]">{dict.ui.ledger.footnoteStrong}</strong>
        {dict.ui.ledger.footnotePost}
      </p>
    </>
  );
}
