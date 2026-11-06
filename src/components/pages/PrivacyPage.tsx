import { GroundBackdrop } from '@/components/world/Ground';
import { SiteHeader } from '@/components/world/SiteHeader';
import { SiteFooter } from '@/components/world/SiteFooter';
import { getDict, type Lang } from '@/lib/i18n';

/**
 * 隐私与免责页。
 *
 * 一个纯静态站点需要交代的就三类事：我们什么也不收集（唯一的本地存储是语言偏好）、
 * 托管方 GitHub 会记它自己的服务器日志、站外链接适用对方政策。
 * 外加数据准确性的免责声明。正文四语言齐备（pages-dict.privacy），
 * 外链（GitHub 隐私声明、Issue 入口）随字典里的 link 字段渲染。
 */
export function PrivacyPage({ lang }: { lang: Lang }) {
  const dict = getDict(lang);
  const pd = dict.pages.privacy;

  return (
    <>
      <main className="relative min-h-dvh">
        <GroundBackdrop />
        <div className="relative">
          <SiteHeader current={null} lang={lang} narrow />

          <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-4 sm:px-8">
            <h1 className="pixel-outline mb-1 mt-4 text-2xl sm:text-3xl">{pd.title}</h1>
            <p className="mb-4 text-[12px] text-[var(--color-ghost)]">{pd.updated}</p>
            <section className="pixel-panel-dark space-y-5 p-4">
              {pd.sections.map((s) => (
                <div key={s.h}>
                  <h2 className="mb-1 font-pixel text-[14px] text-[var(--color-gold)]">{s.h}</h2>
                  <p className="text-[13px] leading-relaxed text-[var(--color-parchment)]">
                    {s.body}
                    {s.link && (
                      <>
                        {' '}
                        <a
                          href={s.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-dotted underline-offset-2 hover:text-[var(--color-gold)]"
                        >
                          {s.link.text}
                        </a>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
