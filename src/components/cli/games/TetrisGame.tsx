import { useEffect, useRef } from 'react'

type Props = { onRestart: () => void; restartKey: number }

const BW = 10
const BH = 20
const CS = 16
const CW = BW * CS
const CH = BH * CS

type Cell = [number, number]

const BASE: Cell[][] = [
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[1, 0], [0, 1], [1, 1], [2, 1]],
  [[1, 0], [2, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [1, 1], [2, 1]],
  [[0, 0], [0, 1], [1, 1], [2, 1]],
  [[2, 0], [0, 1], [1, 1], [2, 1]],
]

const COLS = ['#22d3ee', '#facc15', '#a78bfa', '#4ade80', '#fb923c', '#60a5fa', '#f472b6']

function rot(cells: Cell[]): Cell[] {
  return cells.map(([x, y]) => [-y, x] as Cell)
}

function cellsAt(
  piece: Cell[],
  ox: number,
  oy: number,
): { x: number; y: number }[] {
  return piece.map(([x, y]) => ({ x: ox + x, y: oy + y }))
}

function valid(board: number[][], piece: Cell[], ox: number, oy: number): boolean {
  for (const { x, y } of cellsAt(piece, ox, oy)) {
    if (x < 0 || x >= BW || y >= BH) return false
    if (y >= 0 && board[y][x]) return false
  }
  return true
}

export function TetrisGame({ onRestart, restartKey }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) return
    const g: CanvasRenderingContext2D = ctx2d

    const board: number[][] = Array.from({ length: BH }, () => Array(BW).fill(0))
    let kind = Math.floor(Math.random() * BASE.length)
    let piece = [...BASE[kind]]
    let ox = 3
    let oy = 0
    let score = 0
    let lines = 0
    let dropMs = 520
    let last = performance.now()
    let raf = 0

    function merge(): boolean {
      const idx = kind + 1
      for (const { x, y } of cellsAt(piece, ox, oy)) {
        if (y >= 0) board[y][x] = idx
      }
      let cleared = 0
      for (let y = BH - 1; y >= 0; ) {
        if (board[y].every((v) => v > 0)) {
          board.splice(y, 1)
          board.unshift(Array(BW).fill(0))
          cleared++
        } else {
          y--
        }
      }
      if (cleared) {
        lines += cleared
        score += [0, 100, 300, 500, 800][cleared] ?? 800
        dropMs = Math.max(120, 520 - Math.floor(lines / 4) * 40)
      }
      kind = Math.floor(Math.random() * BASE.length)
      piece = [...BASE[kind]]
      ox = 3
      oy = 0
      if (!valid(board, piece, ox, oy)) {
        draw(true)
        return false
      }
      return true
    }

    function tryMove(dx: number, dy: number) {
      if (valid(board, piece, ox + dx, oy + dy)) {
        ox += dx
        oy += dy
        return true
      }
      return false
    }

    function tryRotate() {
      if (kind === 1) return false
      const next = rot(piece)
      for (const d of [0, -1, 1, -2, 2]) {
        if (valid(board, next, ox + d, oy)) {
          piece = next
          ox += d
          return true
        }
      }
      return false
    }

    let over = false

    function hardDrop() {
      while (tryMove(0, 1)) {
        score += 2
      }
      if (merge() === false) over = true
    }

    function draw(gameOver: boolean) {
      g.fillStyle = '#09090b'
      g.fillRect(0, 0, CW, CH)
      g.strokeStyle = '#3f3f46'
      g.strokeRect(0.5, 0.5, CW - 1, CH - 1)
      for (let y = 0; y < BH; y++) {
        for (let x = 0; x < BW; x++) {
          const v = board[y][x]
          if (!v) continue
          g.fillStyle = COLS[(v - 1) % COLS.length]
          g.fillRect(x * CS + 1, y * CS + 1, CS - 2, CS - 2)
        }
      }
      const ghost = COLS[kind % COLS.length]
      let gy = oy
      while (valid(board, piece, ox, gy + 1)) gy++
      g.globalAlpha = 0.22
      g.fillStyle = ghost
      for (const { x, y } of cellsAt(piece, ox, gy)) {
        if (y >= 0) g.fillRect(x * CS + 1, y * CS + 1, CS - 2, CS - 2)
      }
      g.globalAlpha = 1
      g.fillStyle = ghost
      for (const { x, y } of cellsAt(piece, ox, oy)) {
        if (y >= 0) g.fillRect(x * CS + 1, y * CS + 1, CS - 2, CS - 2)
      }
      g.fillStyle = '#a1a1aa'
      g.font = '11px ui-monospace, monospace'
      g.fillText(`lines ${lines}  score ${score}`, 6, CH - 6)
      g.fillText(
        gameOver
          ? 'game over · R restart'
          : '← → move · ↑ rotate · ↓ soft · space · R restart',
        6,
        14,
      )
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        onRestart()
        return
      }
      if (over) return
      if (e.key === 'ArrowLeft') {
        tryMove(-1, 0)
        e.preventDefault()
      } else if (e.key === 'ArrowRight') {
        tryMove(1, 0)
        e.preventDefault()
      } else if (e.key === 'ArrowDown') {
        if (tryMove(0, 1)) score += 1
        e.preventDefault()
      } else if (e.key === 'ArrowUp') {
        tryRotate()
        e.preventDefault()
      } else if (e.key === ' ') {
        hardDrop()
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey, true)

    function step(now: number) {
      if (!over) {
        if (now - last >= dropMs) {
          last = now
          if (!tryMove(0, 1)) {
            const ok = merge()
            if (ok === false) over = true
          }
        }
        draw(over)
      }
      raf = requestAnimationFrame(step)
    }

    draw(false)
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey, true)
    }
  }, [onRestart, restartKey])

  return (
    <canvas
      ref={ref}
      width={CW}
      height={CH}
      className="max-h-[min(78vh,480px)] w-auto rounded border border-zinc-600"
    />
  )
}
