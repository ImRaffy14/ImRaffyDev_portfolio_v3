import { useEffect, useRef } from 'react'

type Props = { onRestart: () => void; restartKey: number }

const W = 400
const H = 260
const PW = 10
const PH = 56
const BALL = 8
const PAD_X = 14

export function PongGame({ onRestart, restartKey }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) return
    const g: CanvasRenderingContext2D = ctx2d

    let py = H / 2 - PH / 2
    let aiY = H / 2 - PH / 2
    let bx = W / 2
    let by = H / 2
    let bvx = 4.2
    let bvy = (Math.random() * 2.4 + 1.2) * (Math.random() < 0.5 ? -1 : 1)
    let sP = 0
    let sAi = 0
    let keys = { up: false, down: false }
    let raf = 0

    function resetBall(dir: number) {
      bx = W / 2
      by = H / 2
      bvx = 4 * dir
      bvy = (Math.random() * 2.2 + 1) * (Math.random() < 0.5 ? -1 : 1)
    }

    function tick() {
      if (keys.up) py = Math.max(4, py - 5.2)
      if (keys.down) py = Math.min(H - PH - 4, py + 5.2)

      const target = by - PH / 2
      aiY += Math.sign(target - aiY) * Math.min(4.8, Math.abs(target - aiY))

      bx += bvx
      by += bvy

      if (by < BALL) {
        by = BALL
        bvy = Math.abs(bvy)
      }
      if (by > H - BALL) {
        by = H - BALL
        bvy = -Math.abs(bvy)
      }

      const lx = PAD_X + PW
      if (bx - BALL < lx && bx > PAD_X && by > py && by < py + PH) {
        bx = lx + BALL
        bvx = Math.abs(bvx) * 1.03
        const hit = (by - (py + PH / 2)) / (PH / 2)
        bvy += hit * 2.2
      }

      const rx = W - PAD_X - PW
      if (bx + BALL > rx && bx < W - PAD_X && by > aiY && by < aiY + PH) {
        bx = rx - BALL
        bvx = -Math.abs(bvx) * 1.02
        const hit = (by - (aiY + PH / 2)) / (PH / 2)
        bvy += hit * 2.2
      }

      if (bx < -20) {
        sAi++
        resetBall(1)
      }
      if (bx > W + 20) {
        sP++
        resetBall(-1)
      }

      g.fillStyle = '#09090b'
      g.fillRect(0, 0, W, H)
      g.strokeStyle = '#3f3f46'
      g.strokeRect(0.5, 0.5, W - 1, H - 1)
      g.setLineDash([6, 10])
      g.beginPath()
      g.moveTo(W / 2, 0)
      g.lineTo(W / 2, H)
      g.strokeStyle = '#52525b'
      g.stroke()
      g.setLineDash([])

      g.fillStyle = '#a78bfa'
      g.fillRect(PAD_X, py, PW, PH)
      g.fillStyle = '#f472b6'
      g.fillRect(W - PAD_X - PW, aiY, PW, PH)
      g.fillStyle = '#facc15'
      g.beginPath()
      g.arc(bx, by, BALL, 0, Math.PI * 2)
      g.fill()

      g.fillStyle = '#a1a1aa'
      g.font = '12px ui-monospace, monospace'
      g.fillText(`${sP}   you   ·   cpu   ${sAi}`, W / 2 - 78, 22)
      g.font = '11px ui-monospace, monospace'
      g.fillText('W / S or ↑ / ↓   ·   esc quit', 10, H - 8)

      raf = requestAnimationFrame(tick)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        onRestart()
        return
      }
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        keys.up = e.type === 'keydown'
        e.preventDefault()
      }
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        keys.down = e.type === 'keydown'
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('keyup', onKey, true)

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('keyup', onKey, true)
    }
  }, [onRestart, restartKey])

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      className="max-h-[min(72vh,420px)] w-full max-w-full rounded border border-zinc-600"
    />
  )
}
