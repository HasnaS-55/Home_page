// src/components/GradientBorderCard.tsx
"use client"

import React from "react"
import CountUp from "./CountUp"

interface GradientBorderCardProps {
  heading: string   // newline-separated lines
  value: number     // numeric value to animate (e.g. -40 or 25)
}

export default function GradientBorderCard({ heading, value }: GradientBorderCardProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center rounded-2xl ">
      {/* SVG gradient border */}
      <svg
        className="absolute inset-0 w-full h-full rounded-2xl"
        
        fill="none"
      >
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="15"
          ry="15"
          fill="transparent"
          stroke="url(#grad)"
          strokeWidth="2"
        />
      </svg>

      {/* Top white dot - positioned at extreme top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white z-10" />

      {/* Inner content with top padding to avoid overlap */}
      <div className="relative flex flex-col items-center text-white text-center w-full h-full justify-center px-4 pt-6">
        {/* Heading text, split on newline */}
        {heading.split("\n").map((line, idx) => (
          <div key={idx} className="text-[18px] sm:text-[20px] font-nohemi font-medium leading-7 sm:leading-8">
            {line}
          </div>
        ))}

        {/* Animated value */}
        <div className="mt-6 sm:mt-10 text-[80px] sm:text-6xl font-nohemi font-bold">
          <CountUp
            from={0}
            to={value}
            duration={1.5}
            separator=""
            className="text-[80px] font-nohemi font-bold"
          />
          %
        </div>
      </div>
    </div>
  )
}
