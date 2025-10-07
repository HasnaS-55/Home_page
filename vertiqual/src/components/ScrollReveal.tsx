// src/components/ScrollReveal.tsx
"use client"
import React, {
  useEffect,
  useRef,
  useMemo,
  ReactNode,
  RefObject,
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
    gsap.fromTo(
      words,
      { opacity: baseOpacity, y: baseY },
      {
        opacity: 1,
        y: 0,
        ease: "none",
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

    if (enableBlur) {
      gsap.fromTo(
        words,
        { filter: `blur(${blurStrength}px)` },
        {
          filter: "blur(0px)",
          ease: "none",
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
  // Global counter for unique keys
let keyCounter = 0
const wrapWords = (node: ReactNode, isBold = false, extraClasses = ""): ReactNode[] => {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((word) =>
      word.match(/^\s*$/)
        ? word
        : (
          <span
            className={`word ${isBold ? "font-bold" : ""} ${extraClasses}`}
            key={`word-${keyCounter++}`}
          >
            {word}
          </span>
        )
    )
  }
  if (React.isValidElement(node) && node.type === "b") {
    return React.Children.toArray(node.props.children).flatMap(child =>
      wrapWords(child, true, extraClasses)
    )
  }
  if (React.isValidElement(node) && node.type === "span") {
    // Preserve the span's className and apply it to each word
    const spanClasses = node.props.className || ""
    return React.Children.toArray(node.props.children).flatMap(child =>
      wrapWords(child, isBold, spanClasses)
    )
  }
  if (React.isValidElement(node)) {
    return React.Children.toArray(node.props.children).flatMap(child =>
      wrapWords(child, isBold, extraClasses)
    )
  }
  return []
}


  return (
    <div ref={containerRef} className={`space-y-5 ${containerClassName}`}>
      {paragraphs.map((paraNodes, pi) => (
        <p key={`para-${pi}`} className={textClassName}>
          {paraNodes.flatMap(node => wrapWords(node))}
        </p>
      ))}
    </div>
  )
}
