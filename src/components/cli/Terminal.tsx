import { motion } from 'framer-motion'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { stripUiMotion } from '@/config/debugMotion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { runCommand } from '@/lib/cli/commands'
import { parseCommand } from '@/lib/cli/parseCommand'
import type { TranscriptEntry } from '@/lib/cli/types'
import { cn } from '@/lib/cn'

const STORAGE_KEY = 'cli-transcript'
const MAX_ENTRIES = 500
const PROMPT = '$'

function mkId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function loadStored(): TranscriptEntry[] | null {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return null
    const out: TranscriptEntry[] = []
    for (const item of data) {
      if (!item || typeof item !== 'object') continue
      const r = item as Record<string, unknown>
      if (typeof r.id !== 'string' || typeof r.text !== 'string') continue
      if (r.kind !== 'input' && r.kind !== 'output' && r.kind !== 'system') continue
      out.push({ id: r.id, kind: r.kind as TranscriptEntry['kind'], text: r.text })
      if (out.length >= MAX_ENTRIES) break
    }
    return out.length ? out : null
  } catch {
    return null
  }
}

function saveStored(entries: TranscriptEntry[]) {
  try {
    const slice = entries.slice(-MAX_ENTRIES)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slice))
  } catch {
    /* ignore quota */
  }
}

function TypedLine({
  text,
  enabled,
  className,
}: {
  text: string
  enabled: boolean
  className?: string
}) {
  const [shown, setShown] = useState(enabled ? text : '')

  useEffect(() => {
    if (!enabled) {
      setShown(text)
      return
    }
    setShown('')
    let i = 0
    const step = 2
    const id = window.setInterval(() => {
      i += step
      const next = text.slice(0, Math.min(i, text.length))
      setShown(next)
      if (i >= text.length) window.clearInterval(id)
    }, 12)
    return () => window.clearInterval(id)
  }, [text, enabled])

  return (
    <span className={className}>
      {shown}
      {enabled && shown.length < text.length ? (
        <span className="animate-cli-caret bg-accent inline-block h-[1.1em] w-2 align-[-0.2em] opacity-80" />
      ) : null}
    </span>
  )
}

function HistoryLine({
  entry,
  motionOk,
  typeThis,
}: {
  entry: TranscriptEntry
  motionOk: boolean
  typeThis: boolean
}) {
  const isInput = entry.kind === 'input'
  const isSystem = entry.kind === 'system'
  const typeOn = typeThis && entry.kind === 'output'

  const body = (
    <div
      className={cn(
        'text-[13px] leading-relaxed whitespace-pre-wrap wrap-break-word md:text-sm',
        isInput && 'text-emerald-400/95',
        isSystem && 'text-zinc-500',
        entry.kind === 'output' && 'text-zinc-200',
      )}
    >
      {isInput ? (
        <>
          <span className="text-zinc-500">{PROMPT} </span>
          {entry.text}
        </>
      ) : typeOn ? (
        <TypedLine text={entry.text} enabled />
      ) : (
        entry.text
      )}
    </div>
  )

  if (!motionOk) return <div key={entry.id}>{body}</div>

  return (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
    >
      {body}
    </motion.div>
  )
}

export function Terminal() {
  const navigate = useNavigate()
  const reducedMotion = usePrefersReducedMotion()
  const inputId = useId()
  const historyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const motionOk = !stripUiMotion && !reducedMotion
  const typeResponses = motionOk

  const [entries, setEntries] = useState<TranscriptEntry[]>(() => {
    const stored = loadStored()
    if (stored?.length) return stored
    return [
      {
        id: 'welcome',
        kind: 'system',
        text: 'Portfolio CLI — type `help` to begin.',
      },
    ]
  })

  const [draft, setDraft] = useState('')
  const [typedOutputId, setTypedOutputId] = useState<string | null>(null)

  useEffect(() => {
    saveStored(entries)
  }, [entries])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const el = historyRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [entries])

  const submit = useCallback(
    (raw: string) => {
      const parsed = parseCommand(raw)
      if (!parsed) return

      const trimmed = raw.trim()
      const inputEntry: TranscriptEntry = {
        id: mkId(),
        kind: 'input',
        text: trimmed,
      }

      setEntries((prev) => [...prev, inputEntry].slice(-MAX_ENTRIES))

      const result = runCommand(parsed.name, { navigate })

      if (result.type === 'navigate') {
        const msg = result.message?.trim()
        if (msg) {
          const outId = mkId()
          const out: TranscriptEntry = { id: outId, kind: 'output', text: msg }
          setEntries((prev) => [...prev, out].slice(-MAX_ENTRIES))
          setTypedOutputId(typeResponses ? outId : null)
        } else {
          setTypedOutputId(null)
        }
        window.setTimeout(() => {
          navigate(result.to, { replace: true })
        }, msg ? 280 : 0)
        return
      }

      const block = result.lines.join('\n')
      const outId = mkId()
      const out: TranscriptEntry = { id: outId, kind: 'output', text: block }
      setEntries((prev) => [...prev, out].slice(-MAX_ENTRIES))
      setTypedOutputId(typeResponses ? outId : null)
    },
    [navigate, typeResponses],
  )

  const onSubmitLine = useCallback(() => {
    const line = draft
    setDraft('')
    submit(line)
  }, [draft, submit])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onSubmitLine()
      }
    },
    [onSubmitLine],
  )

  return (
    <div className="border-border/80 bg-zinc-950 flex max-h-[min(720px,calc(100dvh-9rem))] min-h-[min(420px,calc(100dvh-10rem))] w-full flex-col overflow-hidden rounded-xl border shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div
        ref={historyRef}
        role="log"
        aria-label="Command output"
        aria-relevant="additions"
        className="scrollbar-thin min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 font-mono [scrollbar-color:color-mix(in_srgb,white_22%,transparent)_transparent] md:px-5"
        data-lenis-prevent
      >
        {entries.map((entry) => (
          <HistoryLine
            key={entry.id}
            entry={entry}
            motionOk={motionOk}
            typeThis={typedOutputId === entry.id}
          />
        ))}
      </div>

      <div className="border-border/60 border-t bg-zinc-950/95 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:px-4">
        <label htmlFor={inputId} className="sr-only">
          Command input
        </label>
        <div className="font-mono text-[13px] md:text-sm flex items-center gap-2">
          <span className="text-zinc-500 shrink-0">{PROMPT}</span>
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            className="caret-accent placeholder:text-zinc-600 min-w-0 flex-1 rounded-md border border-transparent bg-transparent py-1.5 text-zinc-100 outline-none focus-visible:border-zinc-600"
            placeholder="Type a command…"
          />
        </div>
      </div>
    </div>
  )
}
