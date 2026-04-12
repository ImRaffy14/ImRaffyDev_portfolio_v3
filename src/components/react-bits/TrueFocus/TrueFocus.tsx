import { motion } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import './TrueFocus.css'

export type TrueFocusProps = {
  sentence?: string
  separator?: string
  manualMode?: boolean
  blurAmount?: number
  borderColor?: string
  glowColor?: string
  animationDuration?: number
  pauseBetweenAnimations?: number
  className?: string
}

type FocusRect = {
  x: number
  y: number
  width: number
  height: number
}

export default function TrueFocus({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className,
}: TrueFocusProps) {
  const words = sentence.split(separator)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])

  const [focusRect, setFocusRect] = useState<FocusRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (!manualMode && words.length > 0) {
      const interval = window.setInterval(
        () => {
          setCurrentIndex((prev) => (prev + 1) % words.length)
        },
        (animationDuration + pauseBetweenAnimations) * 1000,
      )
      return () => clearInterval(interval)
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length])

  useEffect(() => {
    if (currentIndex < 0) return
    const el = wordRefs.current[currentIndex]
    const parent = containerRef.current
    if (!el || !parent) return

    const parentRect = parent.getBoundingClientRect()
    const activeRect = el.getBoundingClientRect()

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    })
  }, [currentIndex, words.length])

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index)
      setCurrentIndex(index)
    }
  }

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex ?? 0)
    }
  }

  const wordStyle = (isActive: boolean): CSSProperties => ({
    filter: manualMode
      ? isActive
        ? 'blur(0px)'
        : `blur(${blurAmount}px)`
      : isActive
        ? 'blur(0px)'
        : `blur(${blurAmount}px)`,
    transition: `filter ${animationDuration}s ease`,
    ['--border-color' as string]: borderColor,
    ['--glow-color' as string]: glowColor,
  })

  const frameStyle: CSSProperties = {
    ['--border-color' as string]: borderColor,
    ['--glow-color' as string]: glowColor,
  }

  return (
    <div
      ref={containerRef}
      className={cn('focus-container', className)}
      tabIndex={0}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex
        return (
          <span
            key={`${index}-${word}`}
            ref={(el) => {
              wordRefs.current[index] = el
            }}
            className={cn(
              'focus-word text-inherit',
              manualMode && 'manual',
              isActive && !manualMode && 'active',
            )}
            style={wordStyle(isActive)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        )
      })}

      <motion.div
        className="focus-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 && words.length > 0 ? 1 : 0,
        }}
        transition={{ duration: animationDuration }}
        style={frameStyle}
      >
        <span className="corner top-left" />
        <span className="corner top-right" />
        <span className="corner bottom-left" />
        <span className="corner bottom-right" />
      </motion.div>
    </div>
  )
}
