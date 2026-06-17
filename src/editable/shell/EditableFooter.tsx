'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { slot4BrandConfig } from '@/editable/theme/brand.config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const [mounted, setMounted] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const footerVars = {
    '--editable-footer-bg': '#0f1217',
    '--editable-footer-text': '#f5efe6',
  } as CSSProperties
  const year = mounted ? new Date().getFullYear() : 2026

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer style={footerVars} className="border-t border-white/8 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_0.9fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center border border-white/12 bg-white text-[#0f1217]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
            </span>
            <span>
              <span className="block text-2xl font-black uppercase tracking-[0.16em]">{SITE_CONFIG.name}</span>
              <span className="block text-[10px] font-black uppercase tracking-[0.34em] text-[#bfa989]">{globalContent.site.tagline}</span>
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-8 text-white/68">{globalContent.footer.description}</p>
        </div>

        {globalContent.footer.columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-[11px] font-black uppercase tracking-[0.34em] text-[#bfa989]">{column.title}</h3>
            <div className="mt-5 grid gap-3">
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="inline-flex items-center gap-2 text-sm font-bold text-white/78 transition hover:text-white">
                  {link.label} <ArrowUpRight className="h-3.5 w-3.5 text-[#ffc570]" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.34em] text-[#bfa989]">Account</h3>
          <div className="mt-5 grid gap-3">
            {mounted && session ? (
              <>
                <Link href="/create" className="text-sm font-bold text-white/78 transition hover:text-white">Create</Link>
                <button type="button" onClick={logout} className="text-left text-sm font-bold text-white/78 transition hover:text-white">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-white/78 transition hover:text-white">Login</Link>
                <Link href="/signup" className="text-sm font-bold text-white/78 transition hover:text-white">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 px-4 py-5 text-center text-[11px] font-black uppercase tracking-[0.24em] text-white/45">
        © {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}
      </div>
    </footer>
  )
}
