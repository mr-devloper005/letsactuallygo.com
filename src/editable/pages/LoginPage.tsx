import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="grid min-h-[calc(100vh-12rem)] items-center bg-[var(--slot4-page-bg)] px-4 py-12 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-10 lg:grid-cols-[1fr_0.92fr]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ffc570]">{pagesContent.auth.login.badge}</p>
              <h1 className="mt-5 max-w-xl text-5xl font-black uppercase leading-[0.94] tracking-[0.04em] sm:text-6xl">{pagesContent.auth.login.title}</h1>
              <p className="mt-6 max-w-lg text-sm leading-8 text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
            </div>
            <div className="border border-white/10 bg-[#f7f0e6] p-6 text-[var(--slot4-page-text)] shadow-[0_30px_80px_rgba(0,0,0,0.24)] sm:p-8">
              <h2 className="text-2xl font-black uppercase tracking-[0.04em]">{pagesContent.auth.login.formTitle}</h2>
              <EditableLocalLoginForm />
              <p className="mt-5 text-sm text-[var(--slot4-muted-text)]">New here? <Link href="/signup" className="font-black text-[var(--slot4-accent-fill)] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
