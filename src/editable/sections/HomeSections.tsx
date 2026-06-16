import Link from 'next/link'
import { ArrowRight, Plus, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { CompactIndexCard, EditorialFeatureCard, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function PromoCard({ post, href, tone, title }: { post?: SitePost; href: string; tone: string; title: string }) {
  const copy = post ? getEditableExcerpt(post, 120) : 'Fresh posts will appear here automatically when new entries are available.'
  return (
    <Link href={href} className={`${tone} flex min-h-[360px] flex-col p-8 transition duration-300 hover:-translate-y-1`}>
      <h3 className="text-3xl font-black uppercase leading-[1.02] tracking-[0.04em]">{title}</h3>
      <p className="mt-8 max-w-md flex-1 text-base leading-9 opacity-85">{copy}</p>
      <span className="mt-10 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] underline underline-offset-4">
        Learn more
      </span>
    </Link>
  )
}

function ShowcaseCard({ post, href, style }: { post: SitePost; href: string; style: 'image' | 'horizontal' | 'list' | 'compact' }) {
  if (style === 'horizontal') {
    return (
      <Link href={href} className={`group flex h-full flex-col gap-5 ${dc.surface.card} p-4 ${dc.motion.lift}`}>
        <div className="relative min-h-[220px] overflow-hidden rounded-[1.4rem] bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="min-w-0 py-2">
          <p className={`${dc.type.eyebrow} ${pal.accentFillText}`}>{taskLabel('sbm')}</p>
          <h3 className="mt-3 line-clamp-3 text-2xl font-black uppercase leading-[1.04] tracking-[0.03em]">{post.title}</h3>
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 150)}</p>
        </div>
      </Link>
    )
  }
  if (style === 'list') {
    return (
      <Link href={href} className={`group flex h-full flex-col ${dc.surface.card} p-6 ${dc.motion.lift}`}>
        <p className={`${dc.type.eyebrow} ${pal.accentFillText}`}>{taskLabel('sbm')}</p>
        <div className="mt-4 flex items-start justify-between gap-4">
          <h3 className="line-clamp-3 text-2xl font-black uppercase leading-tight tracking-[0.03em]">{post.title}</h3>
          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[var(--slot4-accent-fill)]" />
        </div>
        <p className="mt-5 line-clamp-4 flex-1 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 140)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">
          Open post <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    )
  }
  if (style === 'compact') {
    return <CompactIndexCard post={post} href={href} index={0} />
  }
  return (
    <Link href={href} className={`group block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className="relative aspect-[16/11] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-6">
        <p className={`${dc.type.eyebrow} ${pal.accentFillText}`}>Featured image</p>
        <h3 className="mt-4 line-clamp-2 text-2xl font-black uppercase leading-tight tracking-[0.03em]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const heroTitle = pagesContent.home.hero.title.join(' ')
  const heroPost = posts[0]
  const sidePosts = posts.slice(1, 4)

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-hero-bg)] text-white">
      <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: `url(${getEditablePostImage(heroPost)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,16,0.92),rgba(15,18,23,0.9))]" />
      <div className="pointer-events-none absolute left-4 top-32 hidden h-[560px] w-[420px] rounded-[220px] border border-white/8 xl:block" />
      <div className="pointer-events-none absolute right-4 top-52 hidden h-[520px] w-[320px] rounded-[180px] border border-white/8 xl:block" />

      <div className="relative mx-auto max-w-[var(--editable-container)] px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-40 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="mx-auto max-w-4xl text-center lg:mx-0 lg:text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ffc570]">{pagesContent.home.hero.badge}</p>
            <h1 className={`${dc.type.heroTitle} mt-8`}>{heroTitle}</h1>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/72 lg:max-w-3xl">{pagesContent.home.hero.description}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href={primaryRoute} className={dc.button.primary}>View Works</Link>
              <Link href="/search" className={dc.button.secondary}>Search Archive</Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {sidePosts.map((post, index) => (
              <Link key={post.id || post.slug || index} href={postHref(primaryTask, post, primaryRoute)} className="group overflow-hidden border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition duration-300 hover:bg-white/9">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ffc570]">Featured {index + 1}</p>
                <h3 className="mt-3 line-clamp-3 text-lg font-black uppercase leading-tight tracking-[0.03em] text-white">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-16 grid gap-0 lg:-mb-52 lg:mx-auto lg:max-w-[78%] lg:grid-cols-3">
          <PromoCard post={posts[0]} href={primaryRoute} tone="bg-[#ffc570] text-[#0f1217]" title="Curated discovery" />
          <PromoCard post={posts[1]} href="/search" tone="bg-[#f5f2ee] text-[#11264c]" title="Editorial order" />
          <PromoCard post={posts[2]} href="/contact" tone="bg-[#38c6c9] text-white" title="Open momentum" />
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 10)
  if (!railPosts.length) return null
  return (
    <section className="bg-[var(--slot4-page-bg)] pt-16 lg:pt-72">
      <div className={`${dc.shell.section} pb-16`}>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className={`${dc.type.eyebrow} ${pal.accentFillText}`}>{pagesContent.home.intro.badge}</p>
            <h2 className={`${dc.type.sectionTitle} mt-5 max-w-xl text-[var(--slot4-page-text)]`}>{pagesContent.home.intro.title}</h2>
            <div className="mt-6 space-y-4 text-sm leading-8 text-[var(--slot4-muted-text)]">
              {pagesContent.home.intro.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={pagesContent.home.intro.primaryLink.href} className={dc.button.light}><Plus className="h-4 w-4" /> {pagesContent.home.intro.primaryLink.label}</Link>
              <Link href={pagesContent.home.intro.secondaryLink.href} className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">{pagesContent.home.intro.secondaryLink.label}</Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.4rem] border border-[var(--slot4-border)] bg-[#efede8] p-6 shadow-[var(--slot4-shadow)]">
            <img src={getEditablePostImage(railPosts[0])} alt={railPosts[0].title} className="ml-auto max-h-[440px] w-full max-w-[520px] object-cover lg:max-w-[620px]" />
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className={dc.type.sectionTitle}>Our work</h2>
            <Link href={primaryRoute} className="text-sm font-black uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">View all</Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:items-stretch">
            {railPosts.slice(0, 4).map((post, index) => (
              <ShowcaseCard
                key={post.id || post.slug || index}
                post={post}
                href={postHref(primaryTask, post, primaryRoute)}
                style={index === 0 ? 'image' : index === 1 ? 'horizontal' : index === 2 ? 'list' : 'compact'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts[4] || posts[0]
  const side = posts.slice(5, 8)
  if (!featured) return null
  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.24)_100%)]" />
      <div className={`${dc.shell.section} relative py-16`}>
        <div className="relative overflow-hidden rounded-[2.8rem]">
          <img src={getEditablePostImage(featured)} alt={featured.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,16,24,0.72),rgba(11,16,24,0.28),rgba(11,16,24,0.08))]" />
          <div className="relative grid min-h-[560px] gap-8 p-8 text-white lg:grid-cols-[1fr_420px] lg:p-12">
            <div className="self-center">
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ffc570]">Ready? Let&apos;s get started</p>
              <h2 className="mt-6 max-w-xl text-5xl font-black uppercase leading-[0.96] tracking-[0.04em] sm:text-6xl">{featured.title}</h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/76">{getEditableExcerpt(featured, 180)}</p>
            </div>
            <div className="self-center bg-[#f7f0e6] p-8 text-[#11264c] shadow-[0_30px_80px_rgba(0,0,0,0.24)]">
              <h3 className="text-4xl font-black uppercase leading-[1.02] tracking-[0.03em]">Ready? Let&apos;s get started!</h3>
              <p className="mt-5 text-base leading-8 text-[var(--slot4-muted-text)]">Browse deeper, save better sources, and move through the archive with a layout that keeps the next click clear.</p>
              <Link href={primaryRoute} className="mt-8 inline-flex items-center gap-2 bg-[#ffc570] px-6 py-4 text-sm font-black uppercase tracking-[0.26em] text-[#11264c]">
                <Plus className="h-4 w-4" /> Discover
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {side.map((post, index) => (
            <Link key={post.id || post.slug || index} href={postHref(primaryTask, post, primaryRoute)} className={`group block ${dc.surface.card} overflow-hidden ${dc.motion.lift}`}>
              <div className="aspect-[16/9] overflow-hidden bg-[var(--slot4-media-bg)]">
                <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="line-clamp-3 text-2xl font-black uppercase leading-tight tracking-[0.03em]">{post.title}</h3>
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 130)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sectionPosts = timeSections.flatMap((section) => section.posts)
  const leadPosts = (sectionPosts.length ? sectionPosts : posts).slice(0, 8)
  const feature = leadPosts[0]
  if (!feature) return null

  return (
    <section className="bg-[#f1eee8]">
      <div className={`${dc.shell.section} py-16`}>
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[2.4rem] border border-[var(--slot4-border)] bg-white p-7 shadow-[var(--slot4-shadow)] sm:p-9">
            <p className={`${dc.type.eyebrow} ${pal.accentFillText}`}>Latest posts</p>
            <h2 className={`${dc.type.sectionTitle} mt-5`}>Fresh additions to the archive</h2>
            <p className="mt-5 max-w-md text-sm leading-8 text-[var(--slot4-muted-text)]">Browse the newest saved resources and supporting posts in a mix of list, image-first, and editorial card layouts.</p>
            <form action="/search" className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="min-w-0 flex-1 border border-[var(--slot4-border)] bg-[var(--slot4-panel-bg)] px-4 py-4 text-sm font-semibold outline-none" />
              <button className="inline-flex items-center justify-center gap-2 bg-[#1a3263] px-6 py-4 text-sm font-black uppercase tracking-[0.22em] text-white"><Search className="h-4 w-4" /> Search</button>
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {leadPosts.slice(1, 5).map((post, index) => (
              <CompactIndexCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <EditorialFeatureCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} label="Lead feature" />
          <div className="rounded-[2.4rem] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] sm:p-8">
            {leadPosts.slice(5, 8).map((post, index) => (
              <ShowcaseCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} style="list" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[#0f1217] text-white">
      <div className={`${dc.shell.section} py-16`}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ffc570]">{pagesContent.home.cta.badge}</p>
            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.98] tracking-[0.04em] sm:text-5xl">{pagesContent.home.cta.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">{pagesContent.home.cta.description}</p>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <Link href={pagesContent.home.cta.primaryCta.href} className={dc.button.primary}>{pagesContent.home.cta.primaryCta.label}</Link>
            <Link href={pagesContent.home.cta.secondaryCta.href} className={dc.button.secondary}>{pagesContent.home.cta.secondaryCta.label}</Link>
          </div>
        </div>

        <div className="mt-12">
          <div className={dc.layout.rail}>
            {SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => (
              <Link key={task.key} href={task.route} className="shrink-0 border border-white/10 bg-white/4 px-6 py-4 text-sm font-black uppercase tracking-[0.26em] text-white transition hover:bg-white/10">
                {task.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
