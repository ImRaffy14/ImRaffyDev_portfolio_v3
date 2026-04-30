export type CliThemeId = 'default' | 'matrix' | 'ocean' | 'amber' | 'sunset' | 'paper'

export const CLI_THEME_IDS: CliThemeId[] = [
  'default',
  'matrix',
  'ocean',
  'amber',
  'sunset',
  'paper',
]

export type CliThemeClasses = {
  shell: string
  history: string
  borderTop: string
  inputRow: string
  prompt: string
  input: string
  inputCaret: string
  inputLine: string
  output: string
  system: string
  ascii: string
  header: string
  headerBtn: string
}

export const CLI_THEMES: Record<CliThemeId, CliThemeClasses> = {
  default: {
    shell: 'bg-zinc-950',
    history: 'bg-zinc-950',
    borderTop: 'border-zinc-800 bg-zinc-950/95',
    inputRow: 'border-zinc-800 bg-zinc-950/95',
    prompt: 'text-zinc-500',
    input:
      'text-zinc-100 caret-emerald-400 placeholder:text-zinc-600 focus-visible:border-zinc-600',
    inputCaret: 'bg-emerald-400',
    inputLine: 'text-emerald-400/95',
    output: 'text-zinc-200',
    system: 'text-zinc-500',
    ascii: 'text-zinc-500',
    header: 'border-zinc-800 bg-zinc-950/95 text-muted-foreground',
    headerBtn: 'text-muted-foreground hover:bg-foreground/8 hover:text-foreground',
  },
  matrix: {
    shell: 'bg-black',
    history: 'bg-black',
    borderTop: 'border-green-900/50 bg-black/95',
    inputRow: 'border-green-900/50 bg-black/95',
    prompt: 'text-green-600',
    input:
      'text-green-300 caret-green-400 placeholder:text-green-900 focus-visible:border-green-800',
    inputCaret: 'bg-green-400',
    inputLine: 'text-green-400',
    output: 'text-green-200',
    system: 'text-green-700',
    ascii: 'text-green-700',
    header: 'border-green-900/50 bg-black/95 text-green-600',
    headerBtn: 'text-green-600 hover:bg-green-950 hover:text-green-300',
  },
  ocean: {
    shell: 'bg-slate-950',
    history: 'bg-slate-950',
    borderTop: 'border-cyan-900/40 bg-slate-950/95',
    inputRow: 'border-cyan-900/40 bg-slate-950/95',
    prompt: 'text-cyan-700',
    input:
      'text-cyan-100 caret-cyan-400 placeholder:text-cyan-900 focus-visible:border-cyan-800',
    inputCaret: 'bg-cyan-400',
    inputLine: 'text-cyan-300',
    output: 'text-cyan-100',
    system: 'text-cyan-700',
    ascii: 'text-cyan-800',
    header: 'border-cyan-900/40 bg-slate-950/95 text-cyan-600',
    headerBtn: 'text-cyan-600 hover:bg-cyan-950 hover:text-cyan-200',
  },
  amber: {
    shell: 'bg-neutral-950',
    history: 'bg-neutral-950',
    borderTop: 'border-amber-900/30 bg-neutral-950/95',
    inputRow: 'border-amber-900/30 bg-neutral-950/95',
    prompt: 'text-amber-700',
    input:
      'text-amber-50 caret-amber-400 placeholder:text-amber-950 focus-visible:border-amber-800',
    inputCaret: 'bg-amber-400',
    inputLine: 'text-amber-300',
    output: 'text-amber-100',
    system: 'text-amber-700',
    ascii: 'text-amber-800',
    header: 'border-amber-900/30 bg-neutral-950/95 text-amber-600',
    headerBtn: 'text-amber-600 hover:bg-amber-950 hover:text-amber-200',
  },
  sunset: {
    shell: 'bg-zinc-950',
    history: 'bg-zinc-950',
    borderTop: 'border-fuchsia-900/35 bg-zinc-950/95',
    inputRow: 'border-fuchsia-900/35 bg-zinc-950/95',
    prompt: 'text-fuchsia-600',
    input:
      'text-fuchsia-100 caret-pink-400 placeholder:text-fuchsia-950 focus-visible:border-fuchsia-800',
    inputCaret: 'bg-pink-400',
    inputLine: 'text-fuchsia-300',
    output: 'text-fuchsia-100',
    system: 'text-fuchsia-700',
    ascii: 'text-fuchsia-800',
    header: 'border-fuchsia-900/35 bg-zinc-950/95 text-fuchsia-500',
    headerBtn: 'text-fuchsia-500 hover:bg-fuchsia-950 hover:text-fuchsia-200',
  },
  paper: {
    shell: 'bg-stone-100',
    history: 'bg-stone-100',
    borderTop: 'border-stone-300 bg-stone-50',
    inputRow: 'border-stone-300 bg-stone-50',
    prompt: 'text-stone-600',
    input:
      'text-stone-900 caret-stone-700 placeholder:text-stone-500 focus-visible:border-stone-400',
    inputCaret: 'bg-stone-700',
    inputLine: 'text-stone-800',
    output: 'text-stone-800',
    system: 'text-stone-600',
    ascii: 'text-stone-600',
    header: 'border-stone-300 bg-stone-50 text-stone-700',
    headerBtn: 'text-stone-700 hover:bg-stone-200 hover:text-stone-900',
  },
}

export function isCliThemeId(s: string): s is CliThemeId {
  return (CLI_THEME_IDS as string[]).includes(s)
}
