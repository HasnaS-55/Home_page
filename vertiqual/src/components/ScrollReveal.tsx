// src/components/ScrollReveal.tsx
"use client"

import React, {
  useEffect,
  useRef,
  useMemo,
  ReactNode,
  RefObject
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

    // Rotate container
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

    // Animate words in
    const words = el.querySelectorAll<HTMLElement>(".word")
    gsap.fromTo(
      words,
      { opacity: baseOpacity, y: baseY },
      {
        opacity: 1,
        y: 0,
        skewX: 0,
        ease: "power1.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: "top bottom-=20%",
          end: wordAnimationEnd,
          scrub: true,
        },
      }
    )

    // Optional blur removal
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

  // Global counter for unique keys
  let keyCounter = 0

  const wrapWords = (
    node: ReactNode,
    isBold = false,
    extraClasses = ""
  ): ReactNode[] => {
    // 1. Text nodes
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

    // 2. React elements
    if (React.isValidElement(node)) {
      // TS now knows node is ReactElement
      type PropsWithClassAndChildren = { className?: string; children?: ReactNode };
      const element = node as React.ReactElement<unknown>;
      const props = element.props as PropsWithClassAndChildren;
      // Handle bold tags
      if (element.type === "b") {
        return React.Children.toArray(props.children).flatMap((child) =>
          wrapWords(child, true, extraClasses)
        )
      }

      // Handle span tags, preserve className
      if (element.type === "span") {
        const spanClasses: string = props.className ?? ""
        return React.Children.toArray(props.children).flatMap((child) =>
          wrapWords(child, isBold, `${extraClasses} ${spanClasses}`)
        )
      }

      // Other elements: recurse into children
      return React.Children.toArray(props.children).flatMap((child) =>
        wrapWords(child, isBold, extraClasses)
      )
    }

    // 3. Other node types
    return []
  }

  return (
    <div ref={containerRef} className={`space-y-5 ${containerClassName}`}>
      {paragraphs.map((paraNodes, pi) => (
        <p key={`para-${pi}`} className={textClassName}>
          {paraNodes.flatMap((node) => wrapWords(node))}
        </p>
      ))}
    </div>
  )
}
