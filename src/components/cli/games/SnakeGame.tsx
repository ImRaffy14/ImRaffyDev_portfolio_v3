import { useEffect, useRef } from 'react'

type Props = { onRestart: () => void; restartKey: number }

const GW = 20
const GH = 14
const CELL = 14
const CW = GW * CELL
const CH = GH * CELL

export function SnakeGame({ onRestart, restartKey }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) return
    const g: CanvasRenderingContext2D = ctx2d

    let snake: { x: number; y: number }[] = [
      { x: 8, y: 7 },
      { x: 7, y: 7 },
    ]
    let dir = { x: 1, y: 0 }
    let nextDir = { ...dir }
    let food = { x: 14, y: 7 }
    let alive = true
    let score = 0

    function placeFood() {
      for (let n = 0; n < 400; n++) {
        const x = Math.floor(Math.random() * GW)
        const y = Math.floor(Math.random() * GH)
        if (!snake.some((s) => s.x === x && s.y === y)) {
          food = { x, y }
          return
        }
      }
    }

    function draw() {
      g.fillStyle = '#09090b'
      g.fillRect(0, 0, CW, CH)
      g.strokeStyle = '#3f3f46'
      g.strokeRect(0.5, 0.5, CW - 1, CH - 1)
      g.fillStyle = '#4ade80'
      for (const s of snake) {
        g.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2)
      }
      g.fillStyle = '#f87171'
      g.fillRect(food.x * CELL + 1, food.y * CELL + 1, CELL - 2, CELL - 2)
      g.fillStyle = '#a1a1aa'
      g.font = '11px ui-monospace, monospace'
      const msg = alive
        ? `score ${score}  ·  arrows / WASD  ·  R restart`
        : `game over — score ${score}  ·  R restart`
      g.fillText(msg, 6, CH - 5)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        onRestart()
        return
      }
      if (!alive) return
      const set = (nx: number, ny: number) => {
        if (dir.x === -nx && dir.y === -ny) return
        nextDir = { x: nx, y: ny }
      }
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          set(0, -1)
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          set(0, 1)
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          set(-1, 0)
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          set(1, 0)
          break
        default:
          return
      }
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey, true)

    const id = window.setInterval(() => {
      if (!alive) return
      dir = nextDir
      const head = snake[0]
      const nx = head.x + dir.x
      const ny = head.y + dir.y
      if (nx < 0 || nx >= GW || ny < 0 || ny >= GH) {
        alive = false
        draw()
        return
      }
      if (snake.slice(0, -1).some((s) => s.x === nx && s.y === ny)) {
        alive = false
        draw()
        return
      }
      snake.unshift({ x: nx, y: ny })
      if (nx === food.x && ny === food.y) {
        score++
        placeFood()
      } else {
        snake.pop()
      }
      draw()
    }, 118)

    placeFood()
    draw()

    return () => {
      window.clearInterval(id)
      window.removeEventListener('keydown', onKey, true)
    }
  }, [onRestart, restartKey])

  return (
    <canvas
      ref={ref}
      width={CW}
      height={CH}
      className="max-h-[min(72vh,440px)] w-auto rounded border border-zinc-600"
    />
  )
}
