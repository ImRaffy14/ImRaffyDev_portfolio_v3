import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const SOURCE = `import { useState } from 'react'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <button
        type="button"
        onClick={() => setCount((n) => n + 1)}
      >
        Count: {count}
      </button>
    </div>
  )
}`

const KW =
  /\b(?:export|function|const|return|import|from|default|typeof|useState|type|interface|button|div)\b/

const TOKEN =
  /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:export|function|const|return|import|from|default|typeof|useState|type|interface|button|div)\b)|(\b\d+\b)|(\{|\}|\(|\)|\[|\]|<|>|;|,|\.|:|\/|=)|(\s+)|(\w+)/g

function tokenColor(tok: string): string {
  if (/^\s+$/.test(tok)) return '#3b3b3b'
  if (/^["']/.test(tok)) return '#c3e88d'
  if (KW.test(tok)) return '#c792ea'
  if (/^\d+$/.test(tok)) return '#f78c6c'
  if (
    tok.length > 0 &&
    [...tok].every((c) => '()[]{}<>;,./:=+-*|&!'.includes(c))
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
  w: number,
  h: number,
  charCount: number,
  showCaret: boolean,
) {
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
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#323233'
  ctx.fillRect(0, 0, w, titleH)

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
  ctx.fillText('App.tsx', w / 2 - ctx.measureText('App.tsx').width / 2, titleH / 2)

  ctx.fillStyle = '#252526'
  ctx.fillRect(0, titleH, gutter, h - titleH)

  ctx.font = `${fs}px ui-monospace, Consolas, monospace`
  ctx.textBaseline = 'middle'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    const num = String(i + 1)
    ctx.fillStyle = '#858585'
    ctx.fillText(num, gutter - 12 - ctx.measureText(num).width, y)
    drawLine(ctx, codeX, y, line)
    y += lh
    if (y > h - 24) break
  }

  if (showCaret && charCount > 0 && charCount < SOURCE.length) {
    const lastLine = lines[lines.length - 1] ?? ''
    let caretX = codeX
    TOKEN.lastIndex = 0
    let cm: RegExpExecArray | null
    while ((cm = TOKEN.exec(lastLine)) !== null) {
      caretX += ctx.measureText(cm[0]).width
    }
    const caretY = titleH + 28 + (lines.length - 1) * lh
    if (Math.floor(performance.now() / 520) % 2 === 0) {
      ctx.fillStyle = '#c792ea'
      ctx.fillRect(caretX, caretY - fs / 2, 2.5, fs)
    }
  }
}

type IDEInnerProps = {
  reducedMotion: boolean
  canvas: HTMLCanvasElement
  texture: THREE.CanvasTexture
}

function IDEInner({ reducedMotion, canvas, texture }: IDEInnerProps) {
  const group = useRef<THREE.Group>(null)
  const acc = useRef(0)
  const floatT = useRef(0)
  const { pointer } = useThree()
  const ctx = useMemo(() => {
    const c = canvas.getContext('2d')
    if (!c) throw new Error('Canvas 2D unavailable')
    return c
  }, [canvas])

  useFrame((_, delta) => {
    if (reducedMotion) {
      acc.current = SOURCE.length
    } else {
      acc.current += delta * 42
      const cycle = SOURCE.length + 140
      if (acc.current > cycle) acc.current = 0
    }

    const n = Math.min(Math.floor(acc.current), SOURCE.length)
    const showCaret = !reducedMotion && n > 0 && n < SOURCE.length
    drawIDE(ctx, canvas.width, canvas.height, n, showCaret)
    // Three.js: refresh GPU texture after canvas redraw (mutable engine object, not React state)
    // eslint-disable-next-line react-hooks/immutability -- CanvasTexture.needsUpdate
    texture.needsUpdate = true

    const g = group.current
    if (!g) return

    const baseX = 0.42 + pointer.y * (reducedMotion ? 0 : 0.1)
    const baseY = -0.32 + pointer.x * (reducedMotion ? 0 : -0.12)

    if (reducedMotion) {
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, baseX, 0.08)
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, baseY, 0.08)
      return
    }

    floatT.current += delta
    const bob = Math.sin(floatT.current * 0.85) * 0.035
    const sway = Math.cos(floatT.current * 0.5) * 0.025
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, baseX + bob, 0.06)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, baseY + sway, 0.06)
  })

  return (
    <group ref={group} position={[-0.05, 0.06, 0]} scale={0.8}>
      <mesh position={[0, 0, -0.07]}>
        <boxGeometry args={[2.58, 1.65, 0.14]} />
        <meshStandardMaterial
          color="#2d2d32"
          metalness={0.25}
          roughness={0.7}
        />
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
}

export function HeroIDE({ reducedMotion }: HeroIDEProps) {
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 640
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    return { canvas: c, texture: tex }
  }, [])

  useEffect(() => {
    return () => texture.dispose()
  }, [texture])

  return (
    <div className="h-[min(62vh,520px)] w-full min-h-[300px] bg-transparent lg:h-[min(82vh,720px)] lg:min-h-[440px]">
      <Canvas
        className="!bg-transparent"
        style={{ background: 'transparent' }}
        camera={{ position: [0, 0.12, 5.85], fov: 34 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          premultipliedAlpha: false,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0)
          scene.background = null
        }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 5]} intensity={0.95} />
        <directionalLight position={[-5, 2, -3]} intensity={0.35} />
        <spotLight
          position={[0, 5, 2]}
          angle={0.55}
          penumbra={0.85}
          intensity={0.45}
        />
        <IDEInner
          reducedMotion={reducedMotion}
          canvas={canvas}
          texture={texture}
        />
      </Canvas>
    </div>
  )
}
