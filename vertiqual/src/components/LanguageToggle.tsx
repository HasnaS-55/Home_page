// src/components/LanguageToggle.tsx
"use client"
import React, { useState } from "react"

interface LanguageToggleProps {
  onLanguageChange?: (lang: "fr" | "en") => void
  defaultLanguage?: "fr" | "en"
  className?: string
}

export default function LanguageToggle({
  onLanguageChange,
  defaultLanguage = "fr",
  className = "",
}: LanguageToggleProps) {
  const [isEnglish, setIsEnglish] = useState(defaultLanguage === "en")

  const handleToggle = () => {
    const newLang = isEnglish ? "fr" : "en" // fix: flip correctly
    setIsEnglish(!isEnglish)
    onLanguageChange?.(newLang)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch language to ${isEnglish ? "FR" : "EN"}`}
      className={`relative inline-block select-none ${className}`}
    >
      <div className="relative w-[72px] h-10 overflow-hidden">
        {/* Track */}
        <div className="absolute inset-0 rounded-full bg-[#D7F781]" />

        {/* Track labels */}
        <span
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold transition-colors
            ${isEnglish ? "text-[#1C4B24]" : "text-transparent"}`}
        >
          FR
        </span>
        <span
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold transition-colors
            ${isEnglish ? "text-transparent" : "text-[#1C4B24]"}`}
        >
          EN
        </span>

        {/* Knob */}
        <div
          className={`absolute top-1 w-8 h-8 rounded-full bg-[#1C4B24] text-[#FCFDFB]
            flex items-center justify-center text-xs font-bold
            transition-all duration-300 ease-[cubic-bezier(0.18,0.89,0.35,1.15)]
            ${isEnglish ? "left-9" : "left-1"}`}
        >
          {isEnglish ? "EN" : "FR"}
        </div>
      </div>
    </button>
  )
}
