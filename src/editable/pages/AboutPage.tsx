import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="bg-[var(--slot4-page-bg)] px-4 py-14 text-[var(--slot4-page-text)] sm:px-6 lg:px-8 lg:py-18">
          <div className="mx-auto max-w-[var(--editable-container)]">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ffc570]">{pagesContent.about.badge}</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.94] tracking-[0.04em] sm:text-6xl lg:text-7xl">About {SITE_CONFIG.name}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[2.4rem] border border-[var(--slot4-border)] bg-white p-8 shadow-[var(--slot4-shadow)] lg:p-12">
              <h2 className="text-4xl font-black uppercase tracking-[0.04em]">{pagesContent.about.title}</h2>
              <div className="mt-8 space-y-5 text-sm leading-8 text-[var(--slot4-muted-text)]">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>
            <aside className="grid gap-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className={`rounded-[2rem] border p-6 shadow-[var(--slot4-shadow)] ${index === 0 ? 'border-[#ffc570]/50 bg-[#ffc570]' : index === 1 ? 'border-[var(--slot4-border)] bg-[#f5f2ee]' : 'border-[var(--slot4-border)] bg-[#547792] text-white'}`}>
                  <h2 className="text-2xl font-black uppercase leading-tight tracking-[0.03em]">{value.title}</h2>
                  <p className={`mt-3 text-sm leading-7 ${index === 2 ? 'text-white/78' : 'text-current/72'}`}>{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
