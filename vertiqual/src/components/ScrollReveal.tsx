// src/components/ScrollReveal.tsx
"use client"

import React, {
  useEffect,
  useRef,
  useMemo,
  ReactNode,
  RefObject,
  ReactElement,
  ElementType
} from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  scrollContainerRef?: RefObject<HTMLElement>
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  baseY?: number
  containerClassName?: string
  textClassName?: string
  rotationEnd?: string
  wordAnimationEnd?: string
  tag?: string  // Changed from keyof JSX.IntrinsicElements to string
}

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 6,
  blurStrength = 8,
  baseY = 60,
  containerClassName = "w-[90%]",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
  tag = "p",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Split on <br> into arrays of nodes
  const paragraphs = useMemo(() => {
    const nodes = React.Children.toArray(children)
    const paras: ReactNode[][] = [[]]
    nodes.forEach((node) => {
      if (React.isValidElement(node) && node.type === "br") {
        paras.push([])
      } else {
        paras[paras.length - 1].push(node)
      }
    })
    return paras
  }, [children])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const scroller = scrollContainerRef?.current ?? window

    // Rotate container animation
    gsap.fromTo(
      el,
      { transformOrigin: "0% 50%", rotate: baseRotation },
      {
        rotate: 0,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          scroller,
          start: "top bottom",
          end: rotationEnd,
          scrub: true,
        },
      }
    )

    const words = el.querySelectorAll<HTMLElement>(".word")

    // Animate words: opacity, y-position, subtle skew with stagger
    gsap.fromTo(
      words,
      { opacity: baseOpacity, y: baseY, skewX: 3 },
      {
        opacity: 1,
        y: 0,
        skewX: 0,
        ease: "power1.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: "top bottom-=20%",
          end: wordAnimationEnd,
          scrub: true,
        },
      }
    )

    // Optional blur animation on words
    if (enableBlur) {
      gsap.fromTo(
        words,
        { filter: `blur(${blurStrength}px)` },
        {
          filter: "blur(0px)",
          ease: "power1.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
          },
        }
      )
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    blurStrength,
    baseY,
    rotationEnd,
    wordAnimationEnd,
  ])

  let keyCounter = 0

  const wrapWords = (
    node: ReactNode,
    isBold = false,
    extraClasses = ""
  ): ReactNode[] => {
    if (typeof node === "string") {
      return node.split(/(\s+)/).map((word) =>
        word.match(/^\s*$/) ? (
          word
        ) : (
          <span
            className={`word ${isBold ? "font-bold" : ""} ${extraClasses}`}
            key={`word-${keyCounter++}`}
          >
            {word}
          </span>
        )
      )
    }

    if (React.isValidElement(node)) {
      type PropsWithClassAndChildren = { className?: string; children?: ReactNode }
      const element = node as React.ReactElement<unknown>
      const props = element.props as PropsWithClassAndChildren

      if (element.type === "b") {
        return React.Children.toArray(props.children).flatMap((child) =>
          wrapWords(child, true, extraClasses)
        )
      }
      if (element.type === "span") {
        const spanClasses: string = props.className ?? ""
        return React.Children.toArray(props.children).flatMap((child) =>
          wrapWords(child, isBold, `${extraClasses} ${spanClasses}`)
        )
      }
      return React.Children.toArray(props.children).flatMap((child) =>
        wrapWords(child, isBold, extraClasses)
      )
    }

    return []
  }

  const WrapperTag = tag as ElementType  // Use type assertion

  return (
    <div ref={containerRef} className={`space-y-5 ${containerClassName}`}>
      {paragraphs.map((paraNodes, pi) => (
        <WrapperTag key={`para-${pi}`} className={textClassName}>
          {paraNodes.flatMap((node) => wrapWords(node))}
        </WrapperTag>
      ))}
    </div>
  )
}
