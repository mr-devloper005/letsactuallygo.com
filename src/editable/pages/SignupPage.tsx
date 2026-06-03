import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="grid min-h-[calc(100vh-12rem)] items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-10 lg:grid-cols-[0.92fr_1fr]">
            <div className="border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] sm:p-8">
              <h1 className="text-3xl font-black uppercase tracking-[0.04em]">{pagesContent.auth.signup.formTitle}</h1>
              <EditableLocalSignupForm />
              <p className="mt-5 text-sm text-[var(--slot4-muted-text)]">Already have an account? <Link href="/login" className="font-black text-[var(--slot4-accent-fill)] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
            </div>
            <div className="bg-[var(--slot4-page-bg)] p-8 text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow)] sm:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ffc570]">{pagesContent.auth.signup.badge}</p>
              <h2 className="mt-5 max-w-xl text-5xl font-black uppercase leading-[0.94] tracking-[0.04em] sm:text-6xl">{pagesContent.auth.signup.title}</h2>
              <p className="mt-6 max-w-lg text-sm leading-8 text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.description}</p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
