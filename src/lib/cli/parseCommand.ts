export type ParsedCommand = {
  name: string
  args: string[]
}

export function parseCommand(input: string): ParsedCommand | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const parts = trimmed.split(/\s+/)
  const name = parts[0]?.toLowerCase() ?? ''
  const args = parts.slice(1)

  return { name, args }
}
