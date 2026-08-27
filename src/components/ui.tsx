import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Primitives for the enamel-board system. Section padding, rules, eyebrows and
 * type roles live here so a page composes blocks rather than re-deriving the
 * scale each time.
 */

type Ground = 'indigo' | 'cream' | 'paper'

const GROUND: Record<Ground, string> = {
  indigo: 'bg-indigo text-cream',
  cream: 'bg-cream text-ink',
  paper: 'bg-paper text-ink',
}

export function Section({
  children,
  ground = 'paper',
  rule = false,
  id,
  className = '',
}: {
  children: ReactNode
  ground?: Ground
  /** 3px vermilion bottom rule — the section divider from the handoff. */
  rule?: boolean
  id?: string
  className?: string
}) {
  return (
    <section
      id={id}
      className={`${GROUND[ground]} ${rule ? 'border-b-[3px] border-vermilion' : ''} px-5 py-[26px] md:px-10 md:py-11 ${className}`}
    >
      <div className="mx-auto w-full max-w-shell">{children}</div>
    </section>
  )
}

/** Mono, 10px, 0.20em, uppercase. Numbered blocks are numbered in the content. */
export function Eyebrow({ children, tone = 'grey' }: { children: ReactNode; tone?: 'grey' | 'marigold' | 'vermilion' | 'cream' }) {
  const colour = {
    grey: 'text-grey-warm',
    marigold: 'text-marigold',
    vermilion: 'text-vermilion',
    cream: 'text-cream/70',
  }[tone]
  return <p className={`font-mono text-eyebrow uppercase ${colour}`}>{children}</p>
}

/**
 * The headline face — Mukta 800, per the handoff's type scale. Named for the
 * Devanagari it originally set; the site ships in English for now, so there is
 * no lang tag. Put one back on any element that carries Devanagari again, or a
 * screen reader will read English words in a Hindi voice.
 */
export function Heading({
  children,
  size = 'md',
  className = '',
  as: Tag = 'h2',
}: {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'hero'
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}) {
  const scale = {
    sm: 'text-headline-sm',
    md: 'text-headline md:text-[30px]',
    lg: 'text-headline-lg md:text-[34px]',
    hero: 'text-hero md:text-hero-lg',
  }[size]
  return (
    <Tag className={`font-headline font-extrabold ${scale} text-balance ${className}`}>
      {children}
    </Tag>
  )
}

/** Latin display — numbers, SKU names. Archivo Black. */
export function Num({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`font-display tabular-nums ${className}`}>{children}</span>
}

export function Body({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`max-w-measure text-body md:text-[15px] ${className}`}>{children}</p>
}

/** Mono meta line — batch codes, dates, delivery windows, nutrition. */
export function Meta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-meta uppercase ${className}`}>{children}</p>
}

export function Rule({ className = '' }: { className?: string }) {
  return <hr className={`h-[3px] w-full border-0 bg-vermilion ${className}`} />
}

const BUTTON_BASE =
  'inline-flex min-h-button w-full items-center justify-center gap-2 px-6 font-headline text-[19px] font-extrabold'

export function Button({
  children,
  href,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled,
  className = '',
  arrow = false,
}: {
  children: ReactNode
  href?: string
  type?: 'button' | 'submit'
  variant?: 'primary' | 'indigo' | 'green' | 'outline' | 'outline-cream'
  onClick?: () => void
  disabled?: boolean
  className?: string
  arrow?: boolean
}) {
  const style = {
    primary: 'bg-vermilion text-white',
    indigo: 'bg-indigo text-cream',
    green: 'bg-green text-white',
    outline: 'border-2 border-indigo bg-transparent text-indigo',
    'outline-cream': 'border-2 border-cream/40 bg-transparent text-cream',
  }[variant]
  const cls = `${BUTTON_BASE} ${style} ${className}`

  const inner = (
    <>
      <span>{children}</span>
      {arrow && <span aria-hidden>→</span>}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    )
  }
  // Never disabled by design: tapping reveals which field needs help rather
  // than doing nothing, which is indistinguishable from a broken button.
  return (
    <button type={type} onClick={onClick} aria-disabled={disabled} className={cls}>
      {inner}
    </button>
  )
}

export function Card({
  children,
  ground = 'paper',
  border,
  className = '',
}: {
  children: ReactNode
  ground?: Ground | 'indigo-raise'
  border?: string
  className?: string
}) {
  const g = ground === 'indigo-raise' ? 'bg-indigo-raise text-cream' : GROUND[ground]
  return <div className={`${g} ${border ?? 'border border-stone'} p-4 ${className}`}>{children}</div>
}

/** 4px left border pull-quote — used for the "where paneer wins" admission. */
export function PullQuote({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <blockquote className="border-l-4 border-indigo pl-4">
      <p className="font-mono text-eyebrow uppercase text-vermilion">{heading}</p>
      <div className="mt-2 text-body-sm text-slate">{children}</div>
    </blockquote>
  )
}

export const INPUT =
  'h-input w-full border-2 border-indigo bg-white px-3 font-body text-[17px] text-ink outline-none'

export const INPUT_MONO =
  'h-input w-full border-2 border-indigo bg-white px-3 font-mono text-[18px] text-ink outline-none'

export function Spinner({ className = '' }: { className?: string }) {
  return <span className={`spinner inline-block h-[14px] w-[14px] ${className}`} aria-hidden />
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-mono text-eyebrow uppercase text-grey-warm">
      {children}
    </label>
  )
}

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="mt-1.5 text-[12.5px] font-semibold text-chilli">
      {children}
    </p>
  )
}
