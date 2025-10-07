// src/components/SvgScrollLoop.tsx
"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

interface SvgScrollLoopProps {
  svgSrc: string
  speed?: number
  direction?: 'left' | 'right'
  width?: number | string
  svgWidth?: number
  svgHeight?: number
  gap?: number
  pauseOnHover?: boolean
  fadeOut?: boolean
  fadeOutColor?: string
  ariaLabel?: string
  className?: string
  style?: React.CSSProperties
}

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 3,
  COPY_HEADROOM: 2
} as const

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ')

const useResizeObserver = (
  callback: () => void,
  elements: Array<React.RefObject<Element | null>>,
  dependencies: React.DependencyList
) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback()
      window.addEventListener('resize', handleResize)
      callback()
      return () => window.removeEventListener('resize', handleResize)
    }

    const observers = elements.map(ref => {
      if (!ref.current) return null
      const observer = new ResizeObserver(callback)
      observer.observe(ref.current)
      return observer
    })

    callback()

    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }, [callback, elements, dependencies])
}

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  isHovered: boolean,
  pauseOnHover: boolean
) => {
  const rafRef = useRef<number | null>(null)
  const lastTimestampRef = useRef<number | null>(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
    }

    if (prefersReduced) {
      track.style.transform = 'translate3d(0, 0, 0)'
      return () => {
        lastTimestampRef.current = null
      }
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000
      lastTimestampRef.current = timestamp

      const target = pauseOnHover && isHovered ? 0 : targetVelocity

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU)
      velocityRef.current += (target - velocityRef.current) * easingFactor

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth
        offsetRef.current = nextOffset

        const translateX = -offsetRef.current
        track.style.transform = `translate3d(${translateX}px, 0, 0)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lastTimestampRef.current = null
    }
  }, [trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover])
}

export const SvgScrollLoop = React.memo<SvgScrollLoopProps>(
  ({
    svgSrc,
    speed = 60,
    direction = 'left',
    width = '100%',
    svgWidth = 100,
    svgHeight = 50,
    gap = 40,
    pauseOnHover = true,
    fadeOut = false,
    fadeOutColor = '#FCFDFB',
    ariaLabel = 'SVG scroll animation',
    className,
    style
  }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const seqRef = useRef<HTMLDivElement>(null)

    const [seqWidth, setSeqWidth] = useState<number>(0)
    const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed)
      const directionMultiplier = direction === 'left' ? 1 : -1
      const speedMultiplier = speed < 0 ? -1 : 1
      return magnitude * directionMultiplier * speedMultiplier
    }, [speed, direction])

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0
      const sequenceWidth = seqRef.current?.getBoundingClientRect?.()?.width ?? 0

      if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth))
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded))
      }
    }, [])

    useResizeObserver(updateDimensions, [containerRef, seqRef], [svgSrc, gap, svgWidth])

    useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover)

    const handleMouseEnter = useCallback(() => {
      if (pauseOnHover) setIsHovered(true)
    }, [pauseOnHover])

    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover) setIsHovered(false)
    }, [pauseOnHover])

    const containerStyle = useMemo(
      (): React.CSSProperties => ({
        width: typeof width === 'number' ? `${width}px` : width,
        ...style
      }),
      [width, style]
    )

    return (
      <div
        ref={containerRef}
        className={cx('relative overflow-x-hidden', className)}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {fadeOut && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[clamp(20px,5%,60px)] bg-gradient-to-r to-transparent"
              style={{ backgroundImage: `linear-gradient(to right, ${fadeOutColor}, transparent)` }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[clamp(20px,5%,60px)] bg-gradient-to-l to-transparent"
              style={{ backgroundImage: `linear-gradient(to left, ${fadeOutColor}, transparent)` }}
            />
          </>
        )}

        <div
          className="flex w-max will-change-transform select-none motion-reduce:transform-none"
          ref={trackRef}
        >
          {Array.from({ length: copyCount }, (_, copyIndex) => (
            <div
              key={`copy-${copyIndex}`}
              className="flex items-center"
              ref={copyIndex === 0 ? seqRef : undefined}
            >
              <div className="flex-shrink-0" style={{ marginRight: `${gap}px` }}>
                <Image
                  src={svgSrc}
                  alt="Scrolling SVG"
                  width={svgWidth}
                  height={svgHeight}
                  className="block object-contain pointer-events-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
)

SvgScrollLoop.displayName = 'SvgScrollLoop'

export default SvgScrollLoop
