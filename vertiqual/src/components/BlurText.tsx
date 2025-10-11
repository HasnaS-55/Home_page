// src/components/BlurText.tsx
"use client"

import { motion, Transition, Easing } from "motion/react"
import React, { useEffect, useMemo, useState } from "react"

type BlurTextProps = {
  /** Rich text string. Supports <b>…</b> and <br /> */
  text?: string
  /** Stagger between animated units (ms). Works for lines, words, or letters */
  delay?: number
  className?: string
  /** Granularity of animation */
  animateBy?: "words" | "letters" | "lines"
  /** Direction for initial offset */
  direction?: "top" | "bottom"
  /** Override initial keyframe props */
  animationFrom?: Record<string, string | number>
  /** Override subsequent keyframe snapshots */
  animationTo?: Array<Record<string, string | number>>
  /** Easing for the whole keyframe transition */
  easing?: Easing | Easing[]
  /** Duration per step (seconds). Total = stepDuration * (#steps - 1) */
  stepDuration?: number
  /** Auto start when the component mounts */
  startOnMount?: boolean
  /** Imperative trigger from parent. When true, animation plays immediately */
  play?: boolean
  /** Callback when the full sequence finishes */
  onComplete?: () => void
}

type Token =
  | { type: "text"; value: string; bold: boolean }
  | { type: "br" }

type Line = {
  tokens: Array<{ type: "text"; value: string; bold: boolean }>
}

const tokenizeRichText = (input: string): Token[] => {
  const normalized = input.replace(/<br\s*\/?>/gi, "<<<BR>>>")
  const parts = normalized.split(/(<b>.*?<\/b>)/gi).filter(Boolean)
  const tokens: Token[] = []

  for (const part of parts) {
    if (/^<b>.*<\/b>$/i.test(part)) {
      const inner = part.replace(/^<b>/i, "").replace(/<\/b>$/i, "")
      inner.split("<<<BR>>>").forEach((seg, i, arr) => {
        if (seg) tokens.push({ type: "text", value: seg, bold: true })
        if (i < arr.length - 1) tokens.push({ type: "br" })
      })
    } else {
      part.split("<<<BR>>>").forEach((seg, i, arr) => {
        if (seg) tokens.push({ type: "text", value: seg, bold: false })
        if (i < arr.length - 1) tokens.push({ type: "br" })
      })
    }
  }
  return tokens
}

const groupIntoLines = (tokens: Token[]): Line[] => {
  const lines: Line[] = []
  let currentLine: Line = { tokens: [] }

  tokens.forEach((token) => {
    if (token.type === "br") {
      if (currentLine.tokens.length > 0 || lines.length === 0) {
        lines.push(currentLine)
        currentLine = { tokens: [] }
      }
    } else {
      currentLine.tokens.push(token)
    }
  })

  if (currentLine.tokens.length > 0) {
    lines.push(currentLine)
  }

  return lines
}

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ])
  const keyframes: Record<string, Array<string | number>> = {}
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])]
  })
  return keyframes
}

const extractFontWeight = (className: string): string => {
  const fontWeightMatch = className.match(/font-(\w+)/)
  return fontWeightMatch ? fontWeightMatch[1] : "normal"
}

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 300,
  className = "",
  animateBy = "lines",
  direction = "bottom",
  animationFrom,
  animationTo,
  easing = (t) => t,
  stepDuration = 0.6,
  startOnMount = true,
  play = false,
  onComplete,
}) => {
  const [active, setActive] = useState(false)

  // Start automatically on mount if requested
  useEffect(() => {
    if (startOnMount) setActive(true)
  }, [startOnMount])

  // External trigger to play
  useEffect(() => {
    if (play) {
      setActive(true)
    } else if (!startOnMount) {
      // If parent turns play off and we are not auto-playing,
      // reset to allow a new trigger later
      setActive(false)
    }
  }, [play, startOnMount])

  // If the text changes, reset when not auto-playing so the next play starts from initial
  useEffect(() => {
    if (!startOnMount && !play) setActive(false)
  }, [text, startOnMount, play])

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  )
  const defaultTo = useMemo(
    () => [
      { filter: "blur(5px)", opacity: 0.5, y: direction === "top" ? 5 : -5 },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo

  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  )

  const tokens = tokenizeRichText(text)
  const hasBoldTags = /<b>.*?<\/b>/i.test(text)
  const defaultFontWeight = extractFontWeight(className)

  // Animate by lines
  if (animateBy === "lines") {
    const lines = groupIntoLines(tokens)

    return (
      <div className={`relative blur-text ${className}`} style={{ textAlign: "center" }}>
        {lines.map((line, lineIdx) => {
          const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)
          const lineTransition: Transition = {
            duration: totalDuration,
            times,
            delay: (lineIdx * delay) / 1000,
            ease: easing,
          }

          const isLast = lineIdx === lines.length - 1

          return (
            <motion.div
              key={`line-${lineIdx}`}
              initial={fromSnapshot}
              animate={active ? animateKeyframes : fromSnapshot}
              transition={lineTransition}
              onAnimationComplete={isLast ? onComplete : undefined}
              style={{
                display: "block",
                willChange: "transform, filter, opacity",
              }}
            >
              {line.tokens.map((token, tokenIdx) => (
                <span
                  key={`line-${lineIdx}-token-${tokenIdx}`}
                  style={{
                    fontWeight: hasBoldTags
                      ? token.bold
                        ? "500"
                        : defaultFontWeight
                      : "inherit",
                  }}
                >
                  {token.value}
                </span>
              ))}
            </motion.div>
          )
        })}
      </div>
    )
  }

  // Animate by words or letters
  const unitsToAnimate: Array<{ tokenIdx: number; unitIdx: number }> = []
  tokens.forEach((token, tIdx) => {
    if (token.type === "br") return
    const units =
      animateBy === "words" ? token.value.split(/(\s+)/) : Array.from(token.value)
    units.forEach((u, uIdx) => {
      if (!/^\s+$/.test(u) && u !== "") {
        unitsToAnimate.push({ tokenIdx: tIdx, unitIdx: uIdx })
      }
    })
  })
  const lastIndex = unitsToAnimate.length - 1
  let animIndex = 0

  return (
    <div className={`relative blur-text ${className}`} style={{ textAlign: "center" }}>
      {tokens.map((token, tIdx) => {
        if (token.type === "br") {
          return <div key={`br-${tIdx}`} style={{ width: "100%", height: 0 }} />
        }
        const units =
          animateBy === "words" ? token.value.split(/(\s+)/) : Array.from(token.value)

        return units.map((unit, uIdx) => {
          const display =
            unit === " " || unit === "\n" || unit === "\t" ? "\u00A0" : unit
          const shouldAnimate = !/^\s+$/.test(unit) && unit !== ""
          const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)
          const myIndex = shouldAnimate ? animIndex : -1
          const spanTransition: Transition = {
            duration: totalDuration,
            times,
            delay: (animIndex * delay) / 1000,
            ease: easing,
          }
          if (shouldAnimate) animIndex++

          return (
            <motion.span
              key={`t${tIdx}-u${uIdx}`}
              initial={fromSnapshot}
              animate={active && shouldAnimate ? animateKeyframes : fromSnapshot}
              transition={spanTransition}
              onAnimationComplete={myIndex === lastIndex ? onComplete : undefined}
              style={{
                display: "inline-block",
                willChange: "transform, filter, opacity",
                fontWeight: hasBoldTags
                  ? token.bold
                    ? "500"
                    : defaultFontWeight
                  : "inherit",
              }}
            >
              {display}
            </motion.span>
          )
        })
      })}
    </div>
  )
}

export default BlurText
