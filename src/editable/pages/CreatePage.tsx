'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'border border-[var(--slot4-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent-fill)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] px-4 py-16 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
          <section className="mx-auto grid max-w-5xl gap-8 border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)] md:grid-cols-[0.9fr_1.1fr]">
            <div className="flex h-full min-h-72 items-center justify-center bg-[#11161d] text-white">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div className="p-8 md:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[var(--slot4-accent-fill)]">{pagesContent.create.locked.badge}</p>
              <h1 className="mt-5 text-5xl font-black uppercase leading-[0.94] tracking-[0.04em] sm:text-6xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 bg-[#1a3263] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 border border-[var(--slot4-border)] bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="bg-[var(--slot4-page-bg)] px-4 py-14 text-[var(--slot4-page-text)] sm:px-6 lg:px-8 lg:py-18">
          <div className="mx-auto max-w-[var(--editable-container)]">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ffc570]">{pagesContent.create.hero.badge}</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.94] tracking-[0.04em] sm:text-6xl lg:text-7xl">{pagesContent.create.hero.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="grid gap-3 self-start">
              {enabledTasks.map((item) => {
                const Icon = taskIcon[item.key] || FileText
                const active = item.key === task
                return (
                  <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`border p-5 text-left transition duration-300 ${active ? 'border-[#ffc570] bg-[#ffc570] text-[#11264c]' : 'border-[var(--slot4-border)] bg-white text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow)] hover:-translate-y-1'}`}>
                    <Icon className="h-5 w-5" />
                    <span className="mt-3 block text-sm font-black uppercase tracking-[0.18em]">{item.label}</span>
                    <span className="mt-2 block text-sm leading-7 opacity-72">{item.description}</span>
                  </button>
                )
              })}
            </aside>

            <form onSubmit={submit} className="border border-[var(--slot4-border)] bg-white p-5 shadow-[var(--slot4-shadow)] sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-1 text-3xl font-black uppercase tracking-[0.04em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="bg-[var(--slot4-panel-bg)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em]"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#1a3263] px-6 text-sm font-black uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-y-0.5">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
