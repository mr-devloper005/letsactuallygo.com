'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, Plus, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => ({ label: task.label, href: task.route })),
    []
  )

  const navVars = {
    '--editable-nav-bg': '#0f1217',
    '--editable-nav-text': '#f5efe6',
    '--editable-nav-muted': '#bea88a',
    '--editable-nav-border': 'rgba(255,255,255,0.12)',
    '--editable-nav-accent': preset.colors.accent,
  } as CSSProperties

  const links = [{ label: 'Home', href: '/' }, ...navItems.slice(0, 5), { label: 'Contact', href: '/contact' }]

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header style={navVars} className="sticky top-0 z-50 text-[var(--editable-nav-text)]">
      <div className="border-b border-[var(--editable-nav-border)] bg-black px-4 py-3 text-[10px] font-black uppercase tracking-[0.24em] sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-white/72">
            <span>{globalContent.nav.utility?.[0] || ''}</span>
            <span className="hidden h-3 w-px bg-white/18 sm:block" />
            <span>{globalContent.nav.utility?.[1] || ''}</span>
          </div>
          <div className="hidden items-center gap-3 text-white/72 md:flex">
           
          </div>
        </div>
      </div>

      <nav className="border-b border-white/8 bg-[var(--editable-nav-bg)]/96 backdrop-blur-xl">
        <div className="mx-auto grid min-h-[88px] max-w-[var(--editable-container)] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center border border-white/12 bg-white text-[#0f1217]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-2xl font-black uppercase tracking-[0.16em]">{SITE_CONFIG.name}</span>
              <span className="block text-[10px] font-black uppercase tracking-[0.34em] text-[var(--editable-nav-muted)]">{globalContent.site.tagline}</span>
            </span>
          </Link>

          <div className="hidden min-w-0 items-center justify-center gap-8 xl:flex">
            {links.map((item) => {
              const active = mounted && (pathname === item.href || pathname.startsWith(`${item.href}/`))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-black uppercase tracking-[0.24em] transition ${active ? 'text-[var(--editable-nav-accent)]' : 'text-white hover:text-[var(--editable-nav-accent)]'}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center justify-end gap-3 lg:flex">
            <form action="/search" className="hidden xl:flex">
              <label className="flex w-full max-w-[280px] items-center border border-white/10 bg-white/4 px-3 py-2 text-sm">
                <Search className="h-4 w-4 text-white/65" />
                <input
                  name="q"
                  type="search"
                  placeholder="Search posts"
                  className="min-w-0 flex-1 bg-transparent px-3 font-semibold text-white outline-none placeholder:text-white/40"
                />
              </label>
            </form>
            {mounted && session ? (
              <>
                <Link href="/create" className="inline-flex items-center gap-2 border border-[var(--editable-nav-accent)] bg-[var(--editable-nav-accent)] px-4 py-3 text-xs font-black uppercase tracking-[0.24em] text-[#0f1217]">
                  <Plus className="h-4 w-4" /> Create
                </Link>
                <button type="button" onClick={logout} className="px-3 py-3 text-xs font-black uppercase tracking-[0.24em] text-white/75 transition hover:text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center gap-2 px-3 py-3 text-xs font-black uppercase tracking-[0.24em] text-white/78 transition hover:text-white">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link href="/signup" className="inline-flex items-center gap-2 border border-white/10 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.24em] text-[#0f1217]">
                  <UserPlus className="h-4 w-4" /> Join
                </Link>
              </>
            )}
          </div>

          <button type="button" onClick={() => setOpen((value) => !value)} className="justify-self-end border border-white/12 p-3 text-white xl:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-b border-white/8 bg-[#11161d] px-4 py-5 xl:hidden">
          <div className="mx-auto max-w-[var(--editable-container)]">
            <form action="/search" className="mb-4 flex items-center border border-white/10 bg-white/5 px-3 py-3">
              <Search className="h-4 w-4 text-white/65" />
              <input name="q" type="search" placeholder="Search posts" className="min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-white outline-none placeholder:text-white/40" />
            </form>
            <div className="grid gap-2">
              {links.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between border border-white/10 bg-white/4 px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white">
                  {item.label}
                  <ArrowRight className="h-4 w-4 text-[var(--editable-nav-accent)]" />
                </Link>
              ))}
              {mounted && session ? (
                <>
                  <Link href="/create" onClick={() => setOpen(false)} className="border border-[var(--editable-nav-accent)] bg-[var(--editable-nav-accent)] px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#0f1217]">Create</Link>
                  <button type="button" onClick={logout} className="border border-white/10 bg-white/4 px-4 py-3 text-left text-sm font-black uppercase tracking-[0.2em] text-white">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="border border-white/10 bg-white/4 px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white">Login</Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="border border-[var(--editable-nav-accent)] bg-[var(--editable-nav-accent)] px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#0f1217]">Join</Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
