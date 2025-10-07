// src/components/Lines.tsx
"use client"
import { useEffect, useRef } from 'react'

export default function Lines() {
  const ref = useRef<HTMLDivElement>(null)
  
  return (
    <div ref={ref} className="lines">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="line" />
      ))}
    </div>
  )
}
