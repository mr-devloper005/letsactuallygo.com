'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)

  const lanes =
    productKind === 'directory'
      ? [
          { icon: Building2, title: 'Business onboarding', body: 'Add listings, organize business details, and open a clearer directory presence.' },
          { icon: Phone, title: 'Partnership support', body: 'Talk through larger publishing plans, featured placements, or collection ideas.' },
          { icon: MapPin, title: 'Coverage requests', body: 'Need a new category or local lane? We can help route the right setup.' },
        ]
      : productKind === 'editorial'
        ? [
            { icon: FileText, title: 'Editorial submissions', body: 'Pitch story ideas, explainers, essays, and timely posts that fit the reading desk.' },
            { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate collaborations, sponsorships, and issue-level opportunities.' },
            { icon: Sparkles, title: 'Contributor support', body: 'Ask about formatting, publishing flow, or how best to present your material.' },
          ]
        : productKind === 'visual'
          ? [
              { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery features, image-led campaigns, and visual curation.' },
              { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual permissions.' },
              { icon: Mail, title: 'Media kits', body: 'Request creator decks, placement info, or visual feature opportunities.' },
            ]
          : [
              { icon: Bookmark, title: 'Collection submissions', body: 'Suggest useful resources, saved links, and curated pages worth featuring.' },
              { icon: Mail, title: 'Resource partnerships', body: 'Coordinate collection projects, supporting pages, and discovery-focused placements.' },
              { icon: Sparkles, title: 'Curator support', body: 'Need help choosing the right content lane or structure? We can point the way.' },
            ]

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="bg-[var(--slot4-page-bg)] px-4 py-14 text-[var(--slot4-page-text)] sm:px-6 lg:px-8 lg:py-18">
          <div className="mx-auto max-w-[var(--editable-container)]">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ffc570]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.94] tracking-[0.04em] sm:text-6xl lg:text-7xl">{pagesContent.contact.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-4">
              {lanes.map((lane, index) => (
                <div key={lane.title} className={`p-6 shadow-[var(--slot4-shadow)] ${index === 0 ? 'bg-[#ffc570] text-[#11264c]' : index === 1 ? 'bg-white text-[var(--slot4-page-text)] border border-[var(--slot4-border)]' : 'bg-[#547792] text-white'}`}>
                  <lane.icon className="h-6 w-6" />
                  <h2 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[0.03em]">{lane.title}</h2>
                  <p className={`mt-3 text-sm leading-7 ${index === 2 ? 'text-white/78' : 'text-current/74'}`}>{lane.body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[2.4rem] border border-[var(--slot4-border)] bg-white p-7 shadow-[var(--slot4-shadow)]">
              <h2 className="text-3xl font-black uppercase tracking-[0.04em]">{pagesContent.contact.formTitle}</h2>
              <div className="mt-6">
                <EditableContactLeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
