import Link from 'next/link';
import { GroundBackdrop } from '@/components/world/Ground';
import { SiteHeader } from '@/components/world/SiteHeader';
import { SiteFooter } from '@/components/world/SiteFooter';
import { LeaderboardExplorer } from '@/components/leaderboard/LeaderboardExplorer';
import { serializeExplorer } from '@/components/leaderboard/serialize';
import { loadSnapshot } from '@/lib/snapshot';
import { buildTrackIndex } from '@/lib/scores';
import { getDict, langLink, type Lang } from '@/lib/i18n';

/**
 * 排行榜。
 *
 * 快照里每个够 5 个模型的榜单都是一条赛道，外加性价比、上下文、价格、新鲜度四条派生赛道。
 * 赛道在构建期由 `buildTrackIndex` 算好、排好、格式化好，客户端只负责切换与筛选。
 *
 * 没上榜的模型就是「未参赛」，不给假分数：一个模型没被某项评测收录，
 * 不代表它做不到，用估算值填空会让整张榜失去意义。
 */
export function LeaderboardPage({ lang }: { lang: Lang }) {
  const dict = getDict(lang);
  const snapshot = loadSnapshot();
  const tracks = buildTrackIndex(snapshot, lang);
  const data = serializeExplorer(snapshot, tracks, lang);
  const benchmarkTracks = tracks.filter((t) => t.category !== '实用指标' && !t.superseded).length;

  return (
    <>
      <main className="relative min-h-dvh">
        <GroundBackdrop />
        <div className="relative">
          <SiteHeader current="leaderboard" lang={lang} />

          <div className="page-shell pb-16 pt-4">
            <div className="mb-6 mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="pixel-outline mb-2 text-2xl sm:text-3xl">{dict.nav.leaderboard}</h1>
                <p className="text-[13px] leading-relaxed text-[var(--color-ghost)]">
                  {dict.pages.leaderboard.intro(benchmarkTracks, snapshot.models.length)}
                </p>
              </div>
              <Link
                href={langLink(lang, '/leaderboard/all/')}
                className="pixel-button px-3 py-1.5 text-[13px] font-medium text-[var(--color-ink)]"
              >
                {dict.pages.leaderboard.viewAll(snapshot.models.length)}
              </Link>
            </div>

            <LeaderboardExplorer data={data} lang={lang} />

            <p className="mt-10 text-[13px] leading-relaxed text-[var(--color-ghost)]">
              {dict.pages.leaderboard.dataNote}
            </p>
          </div>
        </div>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
