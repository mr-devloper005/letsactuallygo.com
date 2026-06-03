import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-[var(--slot4-accent-soft)]/55', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8', className)} aria-live="polite" aria-busy="true">
      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--slot4-accent-fill)]">{label}</p>
      <PulseBlock className="mt-5 h-14 w-3/4 max-w-4xl" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[2rem] border border-[var(--slot4-border)] bg-white p-5 shadow-[var(--slot4-shadow)]">
            <PulseBlock className="h-52 w-full rounded-[1.4rem]" />
            <PulseBlock className="mt-5 h-5 w-4/5" />
            <PulseBlock className="mt-3 h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-[2rem] border border-[var(--slot4-border)] bg-white p-4 shadow-[var(--slot4-shadow)]">
          <PulseBlock className="h-44 w-full rounded-[1.4rem]" />
          <PulseBlock className="mt-4 h-5 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
          <PulseBlock className="mt-6 h-10 w-36" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto grid w-full max-w-[var(--editable-container)] gap-8 px-4 py-12 lg:grid-cols-[0.8fr_1.2fr]', className)} aria-live="polite" aria-busy="true">
      <PulseBlock className="h-80 w-full rounded-[2rem]" />
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--slot4-accent-fill)]">{label}</p>
        <PulseBlock className="mt-5 h-12 w-4/5" />
        <PulseBlock className="mt-5 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-3 h-4 w-2/3" />
      </div>
    </div>
  )
}
