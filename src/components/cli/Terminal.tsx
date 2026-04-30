import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { stripUiMotion } from '@/config/debugMotion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { CliGameShell } from '@/components/cli/CliGameShell'
import { CLI_ASCII_BANNER } from '@/lib/cli/asciiBanner'
import { runCommand } from '@/lib/cli/commands'
import { canPlayCliGames, cliGamesBlockedMessage } from '@/lib/cli/cliGames'
import type { CliGameId } from '@/lib/cli/cliGames'
import type { CliThemeClasses, CliThemeId } from '@/lib/cli/cliThemes'
import { CLI_THEMES, isCliThemeId } from '@/lib/cli/cliThemes'
import { parseCommand } from '@/lib/cli/parseCommand'
import type { TranscriptEntry } from '@/lib/cli/types'
import { cn } from '@/lib/cn'

const STORAGE_KEY = 'cli-transcript'
const THEME_KEY = 'cli-theme'
const MAX_ENTRIES = 500
const PROMPT = '$'

function loadTheme(): CliThemeId {
  if (typeof sessionStorage === 'undefined') return 'default'
  const raw = sessionStorage.getItem(THEME_KEY)
  if (raw && isCliThemeId(raw)) return raw
  return 'default'
}

function createInitialEntries(): TranscriptEntry[] {
  return [
    { id: 'banner', kind: 'ascii', text: CLI_ASCII_BANNER },
    {
      id: 'welcome',
      kind: 'system',
      text: 'Portfolio CLI — type `help` to begin.',
    },
  ]
}

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
      if (
        r.kind !== 'input' &&
        r.kind !== 'output' &&
        r.kind !== 'system' &&
        r.kind !== 'ascii'
      ) {
        continue
      }
      out.push({ id: r.id, kind: r.kind as TranscriptEntry['kind'], text: r.text })
      if (out.length >= MAX_ENTRIES) break
    }
    if (!out.length) return null
    if (!out.some((e) => e.kind === 'ascii')) {
      out.unshift({ id: 'banner', kind: 'ascii', text: CLI_ASCII_BANNER })
    }
    return out
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
  caretClassName,
}: {
  text: string
  enabled: boolean
  className?: string
  caretClassName: string
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
    <span className={cn(className)}>
      {shown}
      {enabled && shown.length < text.length ? (
        <span
          className={cn(
            'animate-cli-caret inline-block h-[1.1em] w-2 align-[-0.2em] opacity-80',
            caretClassName,
          )}
        />
      ) : null}
    </span>
  )
}

function HistoryLine({
  entry,
  motionOk,
  typeThis,
  t,
}: {
  entry: TranscriptEntry
  motionOk: boolean
  typeThis: boolean
  t: CliThemeClasses
}) {
  const isInput = entry.kind === 'input'
  const isSystem = entry.kind === 'system'
  const isAscii = entry.kind === 'ascii'
  const typeOn = typeThis && entry.kind === 'output'

  if (isAscii) {
    const asciiBody = (
      <div
        className={cn(
          'max-w-full overflow-x-auto text-[8px] leading-[1.15] font-mono whitespace-pre sm:text-[9px] md:text-[10px]',
          t.ascii,
        )}
      >
        {entry.text}
      </div>
    )
    if (!motionOk) return <div key={entry.id}>{asciiBody}</div>
    return (
      <motion.div
        key={entry.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
      >
        {asciiBody}
      </motion.div>
    )
  }

  const body = (
    <div
      className={cn(
        'text-[13px] leading-relaxed whitespace-pre-wrap wrap-break-word md:text-sm',
        isInput && t.inputLine,
        isSystem && t.system,
        entry.kind === 'output' && t.output,
      )}
    >
      {isInput ? (
        <>
          <span className={t.prompt}>{PROMPT} </span>
          {entry.text}
        </>
      ) : typeOn ? (
        <TypedLine
          text={entry.text}
          enabled
          caretClassName={t.inputCaret}
          className={t.output}
        />
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

type TerminalProps = {
  embedded?: boolean
  onClose?: () => void
}

export function Terminal({ embedded = false, onClose }: TerminalProps) {
  const navigate = useNavigate()
  const reducedMotion = usePrefersReducedMotion()
  const inputId = useId()
  const historyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const motionOk = !stripUiMotion && !reducedMotion
  const typeResponses = motionOk

  const [theme, setTheme] = useState<CliThemeId>(() => loadTheme())
  const tc = CLI_THEMES[theme]

  const [entries, setEntries] = useState<TranscriptEntry[]>(() => {
    const stored = loadStored()
    if (stored?.length) return stored
    return createInitialEntries()
  })

  const [draft, setDraft] = useState('')
  const [typedOutputId, setTypedOutputId] = useState<string | null>(null)
  const [activeGame, setActiveGame] = useState<CliGameId | null>(null)

  const closeGame = useCallback(() => {
    setActiveGame(null)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  useEffect(() => {
    saveStored(entries)
  }, [entries])

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return
    sessionStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!activeGame) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      e.stopImmediatePropagation()
      closeGame()
    }
    window.addEventListener('keydown', onEsc, true)
    return () => window.removeEventListener('keydown', onEsc, true)
  }, [activeGame, closeGame])

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
      const result = runCommand(parsed.name, {
        navigate,
        embedded,
        args: parsed.args,
      })

      if (result.type === 'clear') {
        setEntries(createInitialEntries())
        setTypedOutputId(null)
        return
      }

      const inputEntry: TranscriptEntry = {
        id: mkId(),
        kind: 'input',
        text: trimmed,
      }

      if (result.type === 'theme') {
        setTheme(result.theme)
        const outId = mkId()
        const out: TranscriptEntry = {
          id: outId,
          kind: 'output',
          text: `Theme set to \`${result.theme}\`. Try theme list for all presets.`,
        }
        setEntries((prev) => [...prev, inputEntry, out].slice(-MAX_ENTRIES))
        setTypedOutputId(typeResponses ? outId : null)
        return
      }

      if (result.type === 'game') {
        if (!canPlayCliGames()) {
          const outId = mkId()
          const out: TranscriptEntry = {
            id: outId,
            kind: 'output',
            text: cliGamesBlockedMessage(),
          }
          setEntries((prev) => [...prev, inputEntry, out].slice(-MAX_ENTRIES))
          setTypedOutputId(typeResponses ? outId : null)
          return
        }
        setEntries((prev) => [...prev, inputEntry].slice(-MAX_ENTRIES))
        setTypedOutputId(null)
        setActiveGame(result.id)
        window.setTimeout(() => inputRef.current?.blur(), 0)
        return
      }

      if (result.type === 'close') {
        setEntries((prev) => [...prev, inputEntry].slice(-MAX_ENTRIES))
        onClose?.()
        return
      }

      if (result.type === 'navigate') {
        const msg = result.message?.trim()
        if (msg) {
          const outId = mkId()
          const out: TranscriptEntry = { id: outId, kind: 'output', text: msg }
          setEntries((prev) => [...prev, inputEntry, out].slice(-MAX_ENTRIES))
          setTypedOutputId(typeResponses ? outId : null)
        } else {
          setEntries((prev) => [...prev, inputEntry].slice(-MAX_ENTRIES))
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
      setEntries((prev) => [...prev, inputEntry, out].slice(-MAX_ENTRIES))
      setTypedOutputId(typeResponses ? outId : null)
    },
    [embedded, navigate, onClose, typeResponses],
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
    <div
      className={cn(
        'relative border-border/80 flex w-full flex-col overflow-hidden',
        tc.shell,
        embedded
          ? 'max-h-full min-h-0 flex-1 rounded-md border-0 shadow-none'
          : 'max-h-[min(720px,calc(100dvh-9rem))] min-h-[min(420px,calc(100dvh-10rem))] rounded-xl border shadow-[0_0_0_1px_rgba(255,255,255,0.04)]',
      )}
    >
      {embedded ? (
        <div
          className={cn(
            'flex shrink-0 items-center justify-between gap-2 border-b px-2 py-1.5 md:px-3',
            tc.header,
          )}
        >
          <span className="font-mono text-[11px] tracking-wide uppercase md:text-xs">CLI</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className={cn(
              'flex size-8 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              tc.headerBtn,
            )}
          >
            <X className="size-4" strokeWidth={2} aria-hidden />
          </button>
        </div>
      ) : null}
      <div
        ref={historyRef}
        role="log"
        aria-label="Command output"
        aria-relevant="additions"
        className={cn(
          'scrollbar-thin min-h-0 flex-1 space-y-3 overflow-y-auto font-mono [scrollbar-color:color-mix(in_srgb,white_22%,transparent)_transparent]',
          tc.history,
          embedded ? 'px-2.5 py-2 md:px-3' : 'px-4 py-4 md:px-5',
        )}
        data-lenis-prevent
      >
        {entries.map((entry) => (
          <HistoryLine
            key={entry.id}
            entry={entry}
            motionOk={motionOk}
            typeThis={typedOutputId === entry.id}
            t={tc}
          />
        ))}
      </div>

      <div
        className={cn(
          'border-t pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3',
          tc.borderTop,
          embedded ? 'px-2 py-2 md:px-2.5' : 'px-3 md:px-4',
        )}
      >
        <label htmlFor={inputId} className="sr-only">
          Command input
        </label>
        <div className="font-mono text-[13px] md:text-sm flex items-center gap-2">
          <span className={cn('shrink-0', tc.prompt)}>{PROMPT}</span>
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
            className={cn(
              'min-w-0 flex-1 rounded-md border border-transparent bg-transparent py-1.5 outline-none',
              tc.input,
            )}
            placeholder="Type a command…"
          />
        </div>
      </div>
      {activeGame ? <CliGameShell id={activeGame} theme={tc} onClose={closeGame} /> : null}
    </div>
  )
}
