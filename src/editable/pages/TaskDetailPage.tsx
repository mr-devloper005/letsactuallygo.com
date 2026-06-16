import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = {
    '--detail-bg': preset.colors.background,
    '--detail-text': preset.colors.foreground,
    '--detail-surface': preset.colors.surface,
    '--detail-accent': '#ffc570',
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task, className = 'border-white/12 bg-white/5 text-white' }: { task: TaskKey; className?: string }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className={`inline-flex items-center gap-2 border px-4 py-3 text-sm font-black uppercase tracking-[0.18em] ${className}`}>
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function DetailHero({ task, post, label, children }: { task: TaskKey; post: SitePost; label: string; children?: ReactNode }) {
  const image = getImages(post)[0]
  return (
    <section className="relative overflow-hidden bg-[var(--slot4-hero-bg)] text-white">
      {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-16" /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,16,0.94),rgba(15,18,23,0.92))]" />
      <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <BackLink task={task} />
        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.34em] text-[#ffc570]">{label}</p>
        <h1 className="mt-5 max-w-5xl text-5xl font-black uppercase leading-[0.94] tracking-[0.04em] sm:text-6xl lg:text-7xl">{post.title}</h1>
        {summaryText(post) ? <p className="mt-6 max-w-3xl text-base leading-8 text-white/74">{summaryText(post)}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <DetailHero task="article" post={post} label={categoryOf(post, 'Article')} />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
        <article className="min-w-0 rounded-[2.5rem] border border-[var(--slot4-border)] bg-white p-5 shadow-[var(--slot4-shadow)] sm:p-8 lg:p-10">
          {images[0] ? <img src={images[0]} alt="" className="max-h-[620px] w-full rounded-[1.8rem] object-cover" /> : null}
          <BodyContent post={post} />
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <RelatedPanel task="article" post={post} related={related} />
      </section>
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <>
      <DetailHero task="listing" post={post} label="Business listing" />
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <article className="rounded-[2.5rem] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] sm:p-9">
            <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
            <BodyContent post={post} />
            <ImageStrip images={images} label="Business showcase" />
          </article>
          <aside className="space-y-5">
            {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
            <ContactAction website={website} phone={phone} email={email} />
            <RelatedPanel task="listing" post={post} related={related} compact />
          </aside>
        </div>
      </section>
    </>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <DetailHero task="classified" post={post} label="Classified listing">
        <div className="flex flex-wrap gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
      </DetailHero>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-16">
        <aside className="rounded-[2.3rem] border border-[var(--slot4-border)] bg-[#11161d] p-7 text-white shadow-[0_24px_70px_rgba(0,0,0,0.26)] lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ffc570]">Quick actions</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {phone ? <a href={`tel:${phone}`} className="bg-[#ffc570] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#11264c]">Call now</a> : null}
            {email ? <a href={`mailto:${email}`} className="border border-white/16 px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Email</a> : null}
          </div>
        </aside>
        <article className="rounded-[2.5rem] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] sm:p-9">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="classified" post={post} related={related} />
        </article>
      </section>
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <>
      <DetailHero task="image" post={post} label="Visual post" />
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[2.4rem] border border-[var(--slot4-border)] bg-white p-7 shadow-[var(--slot4-shadow)] lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 bg-[#1a3263] px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white"><Camera className="h-4 w-4" /> Image story</div>
            <BodyContent post={post} compact />
          </aside>
          <div className="columns-1 gap-5 space-y-5 md:columns-2">
            {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
              <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)]">
                <img src={image} alt="" className="w-full object-cover" />
                {index === 0 ? <figcaption className="p-5 text-sm font-bold text-[var(--slot4-muted-text)]">Featured visual from this post.</figcaption> : null}
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-10"><RelatedPanel task="image" post={post} related={related} /></div>
      </section>
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const category = categoryOf(post, 'Saved resource')
  return (
    <>
      <section className="border-b border-[var(--slot4-border)] bg-[var(--detail-bg)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <BackLink task="sbm" className="border-[var(--slot4-border)] bg-white text-[var(--slot4-page-text)]" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_380px] lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 bg-[#11161d] px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white">
                  <Bookmark className="h-4 w-4" /> Saved resource
                </span>
                <span className="border border-[var(--slot4-border)] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">
                  {category}
                </span>
              </div>
              <h1 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[0.96] tracking-[0.04em] sm:text-5xl lg:text-6xl">{post.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <aside className="space-y-5">
            <RelatedPanel task="sbm" post={post} related={related} hideMeta />
          </aside>

          <article className="overflow-hidden rounded-[2.5rem] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)]">
            <div className="p-7 sm:p-10">
              <BodyContent post={post} />
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <>
      <DetailHero task="pdf" post={post} label="Document resource" />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
        <article className="rounded-[2.5rem] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] sm:p-9">
          <div className="flex h-28 w-28 items-center justify-center bg-[#11161d] text-white"><FileText className="h-12 w-12" /></div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-[var(--slot4-border)] bg-[var(--detail-bg)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--slot4-border)] bg-white p-4">
                <span className="text-sm font-black uppercase tracking-[0.18em]">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#1a3263] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">Download <Download className="h-4 w-4" /></Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
            </div>
          ) : null}
        </article>
        <RelatedPanel task="pdf" post={post} related={related} />
      </section>
    </>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <DetailHero task="profile" post={post} label="Profile page" />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8 lg:py-16">
        <aside className="rounded-[2.5rem] border border-[var(--slot4-border)] bg-white p-8 text-center shadow-[var(--slot4-shadow)] lg:sticky lg:top-24 lg:self-start">
          <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--detail-bg)] ring-1 ring-[var(--slot4-border)]">
            {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
          </div>
          <h2 className="mt-6 text-4xl font-black uppercase leading-[0.96] tracking-[0.03em]">{post.title}</h2>
          {role ? <p className="mt-3 text-[11px] font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">{role}</p> : null}
          <ContactAction website={website} email={email} />
        </aside>
        <article className="rounded-[2.5rem] border border-[var(--slot4-border)] bg-white p-7 shadow-[var(--slot4-shadow)] sm:p-10">
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Profile gallery" />
          <RelatedPanel task="profile" post={post} related={related} />
        </article>
      </section>
    </>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} opacity-85`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.4rem] border border-[var(--slot4-border)] bg-[var(--detail-bg)] p-4">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-[var(--slot4-page-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--detail-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-[var(--slot4-border)]" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black uppercase tracking-[0.18em]"><MapPin className="h-4 w-4 text-[var(--detail-accent)]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-[var(--slot4-border)] bg-white p-5 shadow-[var(--slot4-shadow)]">
      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--slot4-soft-muted-text)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#1a3263] px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 border border-[var(--slot4-border)] px-4 py-3 text-sm font-black uppercase tracking-[0.18em]"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 border border-[var(--slot4-border)] px-4 py-3 text-sm font-black uppercase tracking-[0.18em]"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="border border-white/16 bg-white/8 px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-white">{label}: <span className="text-[#ffc570]">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false, hideMeta = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean; hideMeta?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {!compact && !hideMeta ? (
        <div className="rounded-[2rem] border border-[var(--slot4-border)] bg-white p-5 shadow-[var(--slot4-shadow)]">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">About this post</p>
          <div className="mt-4 grid gap-3 text-sm font-bold text-[var(--slot4-muted-text)]">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--detail-accent)]" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--detail-accent)]" /> Site: {SITE_CONFIG.name}</p>
            {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[2rem] border border-[var(--slot4-border)] bg-white p-5 shadow-[var(--slot4-shadow)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black uppercase tracking-[0.03em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-[1.5rem] border border-[var(--slot4-border)] bg-[var(--detail-bg)] p-3 transition duration-300 hover:-translate-y-1">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-20 w-20 shrink-0 rounded-[1rem] object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1rem] bg-white"><FileText className="h-6 w-6 opacity-45" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black uppercase leading-tight tracking-[0.02em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-[var(--slot4-border)] bg-[var(--detail-bg)] p-5">
      <div className="flex items-center gap-2 text-lg font-black uppercase tracking-[0.03em]"><MessageCircle className="h-5 w-5 text-[var(--detail-accent)]" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.5rem] border border-[var(--slot4-border)] bg-white p-4">
            <p className="text-sm font-black uppercase tracking-[0.02em]">{comment.name}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[var(--slot4-muted-text)]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
