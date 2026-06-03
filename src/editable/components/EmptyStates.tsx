import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[2rem] border border-[var(--slot4-border)] bg-white p-8 text-center shadow-[var(--slot4-shadow)]', className)}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#1a3263] text-white">
        <SearchX className="h-7 w-7" />
      </div>
      <h2 className="mt-6 text-3xl font-black uppercase tracking-[0.04em] text-[var(--slot4-page-text)]">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-[var(--slot4-muted-text)]">{description}</p>
      <Link href={actionHref} className="mt-8 inline-flex items-center gap-2 bg-[#ffc570] px-6 py-4 text-sm font-black uppercase tracking-[0.22em] text-[#11264c] transition duration-300 hover:-translate-y-1">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} from the main workflow will appear here automatically. The page remains styled and ready even while the feed is empty.`}
      actionLabel="Explore the homepage"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your note has been saved and routed through the existing contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
