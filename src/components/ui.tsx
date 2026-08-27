import Link from 'next/link'
import type { ReactNode } from 'react'

export function Section({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`border-b border-line py-12 md:py-16 ${className}`}>
      {children}
    </section>
  )
}

export function Wrap({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-5xl px-5 ${className}`}>{children}</div>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{children}</p>
  )
}

export function H1({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
      {children}
    </h1>
  )
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-balance md:text-3xl">
      {children}
    </h2>
  )
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-measure space-y-4 text-[17px] leading-relaxed">{children}</div>
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded border border-line bg-surface p-5 ${className}`}>{children}</div>
  )
}

export function Button({
  children,
  href,
  type = 'button',
  variant = 'primary',
  disabled,
  onClick,
  className = '',
}: {
  children: ReactNode
  href?: string
  type?: 'button' | 'submit'
  variant?: 'primary' | 'ghost'
  disabled?: boolean
  onClick?: () => void
  className?: string
}) {
  const base =
    'inline-flex min-h-[48px] items-center justify-center rounded px-6 text-base font-semibold transition-opacity disabled:opacity-50'
  const style =
    variant === 'primary'
      ? 'bg-accent text-white hover:opacity-90'
      : 'border border-line bg-surface text-ink hover:bg-surface-2'
  const cls = `${base} ${style} ${className}`

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cls}>
      {children}
    </button>
  )
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-mono text-2xl font-semibold tabular-nums text-accent">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  )
}

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
  htmlFor: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold">
        {label}
      </label>
      {hint && <p className="text-sm text-muted">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  )
}

export const inputClass =
  'w-full min-h-[48px] rounded border border-line bg-surface px-3 text-base text-ink placeholder:text-muted'
