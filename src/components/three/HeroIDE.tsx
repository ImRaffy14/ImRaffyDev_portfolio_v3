import { Canvas, invalidate, useFrame, useThree } from '@react-three/fiber'
import { type RefObject, useEffect, useMemo, useRef } from 'react'
import { useHeroIdeSurfaceActive } from '@/hooks/useHeroIdeSurfaceActive'
import * as THREE from 'three'

const SOURCE = `
export const getHome = (req, res) => {
  return res.json({
    message: 'Welcome to my portfolio',
    stack: 'Backend API Node.js',
    status: 'active'
  })
}

export const portfolioService = () => {
  return {
    name: 'Raffy Dev Portfolio',
    type: 'backend-driven system',
    mode: 'production-ready mock'
  }
}`

const DESIGN_W = 1024
const DESIGN_H = 640

const KW =
  /\b(?:export|function|const|return|import|from|default|typeof|useState|type|interface|button|div)\b/

const TOKEN =
  /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:export|function|const|return|import|from|default|typeof|useState|type|interface|button|div)\b)|(\b\d+\b)|(\{|\}|\(|\)|\[|\]|<|>|;|,|\.|:|\/|=)|(\s+)|(\w+)/g

function tokenColor(tok: string): string {
  if (/^\s+$/.test(tok)) return '#3b3b3b'
  if (/^["']/.test(tok)) return '#c3e88d'
  if (KW.test(tok)) return '#c792ea'
  if (
    tok.length > 0 &&
    Array.from(tok).every((c) => '()[]{}<>;,./:=+-*|&!'.includes(c))
  ) {
    return '#89ddff'
  }
  return '#d6deeb'
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  line: string,
) {
  let cx = x
  TOKEN.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = TOKEN.exec(line)) !== null) {
    const t = m[0]
    ctx.fillStyle = tokenColor(t)
    ctx.fillText(t, cx, y)
    cx += ctx.measureText(t).width
  }
}

function drawIDE(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  charCount: number,
  showCaret: boolean,
  caretBlinkOn: boolean,
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(cw / DESIGN_W, ch / DESIGN_H)

  const slice = SOURCE.slice(0, charCount)
  const lines = slice.split('\n')
  const titleH = 52
  const gutter = 56
  const padX = 20
  const codeX = gutter + padX
  let y = titleH + 28
  const lh = 34
  const fs = 22

  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(0, 0, DESIGN_W, DESIGN_H)

  ctx.fillStyle = '#323233'
  ctx.fillRect(0, 0, DESIGN_W, titleH)

  const dots = ['#ff5f56', '#ffbd2e', '#27c93f']
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.arc(22 + i * 22, titleH / 2, 6, 0, Math.PI * 2)
    ctx.fillStyle = dots[i]!
    ctx.fill()
  }

  ctx.fillStyle = '#cccccc'
  ctx.font = '500 18px ui-monospace, Consolas, monospace'
  ctx.textBaseline = 'middle'
  ctx.fillText(
    'App.tsx',
    DESIGN_W / 2 - ctx.measureText('App.tsx').width / 2,
    titleH / 2,
  )

  ctx.fillStyle = '#252526'
  ctx.fillRect(0, titleH, gutter, DESIGN_H - titleH)

  ctx.font = `${fs}px ui-monospace, Consolas, monospace`
  ctx.textBaseline = 'middle'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    const num = String(i + 1)
    ctx.fillStyle = '#858585'
    ctx.fillText(num, gutter - 12 - ctx.measureText(num).width, y)
    drawLine(ctx, codeX, y, line)
    y += lh
    if (y > DESIGN_H - 24) break
  }

  if (showCaret && caretBlinkOn && charCount > 0 && charCount < SOURCE.length) {
    const lastLine = lines[lines.length - 1] ?? ''
    let caretX = codeX
    TOKEN.lastIndex = 0
    let cm: RegExpExecArray | null
    while ((cm = TOKEN.exec(lastLine)) !== null) {
      caretX += ctx.measureText(cm[0]).width
    }
    const caretY = titleH + 28 + (lines.length - 1) * lh
    ctx.fillStyle = '#c792ea'
    ctx.fillRect(caretX, caretY - fs / 2, 2.5, fs)
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

const POINTER_SAMPLE_MS = 33
const CARET_BLINK_MS = 520
const DPR_CAP = 1.35

function useIdeCodeCanvasSize(): { w: number; h: number } {
  return useMemo(() => {
    if (typeof window === 'undefined') return { w: 768, h: 480 }
    if (window.innerWidth < 768) return { w: 640, h: 400 }
    return { w: 768, h: 480 }
  }, [])
}

type IDEInnerProps = {
  reducedMotion: boolean
  active: boolean
  canvas: HTMLCanvasElement
  texture: THREE.CanvasTexture
}

function IDEInner({
  reducedMotion,
  active,
  canvas,
  texture,
}: IDEInnerProps) {
  const group = useRef<THREE.Group>(null)
  const acc = useRef(0)
  const floatT = useRef(0)
  const activeRef = useRef(active)
  const lastN = useRef(-1)
  const lastCaretPhase = useRef(-1)
  const pointerSmoothed = useRef({ x: 0, y: 0 })
  const lastPointerSample = useRef(0)
  const { pointer } = useThree()

  const ctx = useMemo(() => {
    const c = canvas.getContext('2d')
    if (!c) throw new Error('Canvas 2D unavailable')
    return c
  }, [canvas])

  activeRef.current = active

  useEffect(() => {
    if (active) invalidate()
  }, [active])

  useFrame((_, delta) => {
    if (!activeRef.current) return

    if (reducedMotion) {
      acc.current = SOURCE.length
    } else {
      acc.current += delta * 42
      const cycle = SOURCE.length + 140
      if (acc.current > cycle) acc.current = 0
    }

    const n = Math.min(Math.floor(acc.current), SOURCE.length)
    const showCaret = !reducedMotion && n > 0 && n < SOURCE.length
    const now = performance.now()
    const caretPhase = showCaret ? Math.floor(now / CARET_BLINK_MS) % 2 : -1
    const caretBlinkOn = showCaret && caretPhase === 0

    const texDirty =
      n !== lastN.current ||
      (showCaret && caretPhase !== lastCaretPhase.current)

    if (texDirty) {
      drawIDE(ctx, canvas.width, canvas.height, n, showCaret, caretBlinkOn)
      // eslint-disable-next-line react-hooks/immutability -- CanvasTexture.needsUpdate
      texture.needsUpdate = true
      lastN.current = n
      lastCaretPhase.current = caretPhase
    }

    const t = now
    if (t - lastPointerSample.current >= POINTER_SAMPLE_MS) {
      lastPointerSample.current = t
      pointerSmoothed.current.x = pointer.x
      pointerSmoothed.current.y = pointer.y
    }

    const g = group.current
    if (!g) {
      invalidate()
      return
    }

    const px = pointerSmoothed.current.x
    const py = pointerSmoothed.current.y
    const baseX = 0.42 + py * (reducedMotion ? 0 : 0.1)
    const baseY = -0.32 + px * (reducedMotion ? 0 : -0.12)

    if (reducedMotion) {
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, baseX, 0.08)
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, baseY, 0.08)
      invalidate()
      return
    }

    floatT.current += delta
    const bob = Math.sin(floatT.current * 0.85) * 0.035
    const sway = Math.cos(floatT.current * 0.5) * 0.025
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, baseX + bob, 0.06)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, baseY + sway, 0.06)
    invalidate()
  })

  return (
    <group ref={group} position={[-0.05, 0.06, 0]} scale={0.8}>
      <mesh position={[0, 0, -0.07]}>
        <boxGeometry args={[2.58, 1.65, 0.14]} />
        <meshLambertMaterial color="#2d2d32" />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[2.42, 1.51]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}

type HeroIDEProps = {
  reducedMotion: boolean
  containerRef: RefObject<HTMLDivElement | null>
}

export function HeroIDE({ reducedMotion, containerRef }: HeroIDEProps) {
  const { w: codeW, h: codeH } = useIdeCodeCanvasSize()
  const active = useHeroIdeSurfaceActive(containerRef)

  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = codeW
    c.height = codeH
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    return { canvas: c, texture: tex }
  }, [codeW, codeH])

  useEffect(() => {
    return () => texture.dispose()
  }, [texture])

  return (
    <Canvas
      className="h-full w-full bg-transparent!"
      style={{ background: 'transparent' }}
      camera={{ position: [0, 0.12, 5.85], fov: 34 }}
      dpr={[1, DPR_CAP]}
      frameloop="demand"
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
        premultipliedAlpha: false,
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0)
        scene.background = null
        invalidate()
      }}
    >
      <ambientLight intensity={0.78} />
      <directionalLight position={[4, 6, 5]} intensity={1.15} />
      <IDEInner
        reducedMotion={reducedMotion}
        active={active}
        canvas={canvas}
        texture={texture}
      />
    </Canvas>
  )
}
