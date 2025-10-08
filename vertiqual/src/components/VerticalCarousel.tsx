// src/components/VerticalCarousel.tsx
"use client"
import { useEffect, useRef, useState } from "react"
import Image from 'next/image'

interface Founder {
  img: string
  name: string
  title: string
  desc: string
  linkedin?: string
  linkedinUrl?: string
  highlight?: boolean
}

const foundersData: Founder[] = [
  {
    img: "/portrait1.jpg",
    name: "Mehdi ARIF",
    title: "Co-Fondateur VertiQual®",
    desc: "Chez VertiQual®, notre engagement pour un avenir durable se traduit par des projets innovants, conçus et pilotés avec rigueur, expertise et passion. Nous croyons que la transition environnementale doit être à la fois ambitieuse et pragmatique.",
    linkedin: "/linkedin.svg",
    linkedinUrl: "https://www.linkedin.com/in/el-mehdi-arif-130b9b144/",
    highlight: true
  },
  {
    img: "/portrait2.jpg",
    name: "Clément LEROY",
    title: "CTO VertiQual®",
    desc: "Chez VertiQual®, notre engagement pour un avenir durable se traduit par des projets innovants, conçus et pilotés avec rigueur, expertise et passion. Nous croyons que la transition environnementale doit être à la fois ambitieuse et pragmatique.",
    linkedin: "/linkedin.svg",
    linkedinUrl: "https://www.linkedin.com/in/clement-leroy78/",
    highlight: true
  },
  {
    img: "/portrait3.jpg",
    name: "Isaac GUINSBURG",
    title: "Directeur Innovation",
    desc: "Chez VertiQual®, notre engagement pour un avenir durable se traduit par des projets innovants, conçus et pilotés avec rigueur, expertise et passion. Nous croyons que la transition environnementale doit être à la fois ambitieuse et pragmatique.",
    linkedin: "/linkedin.svg",
    linkedinUrl: "https://www.linkedin.com/in/fran%C3%A7ois-isaac-guinsburg-08b076182/",
    highlight: true
  },
  {
    img: "/portrait4.jpg",
    name: "Billel MAATI",
    title: "Head of Sustainability",
    desc: "Chez VertiQual®, notre engagement pour un avenir durable se traduit par des projets innovants, conçus et pilotés avec rigueur, expertise et passion. Nous croyons que la transition environnementale doit être à la fois ambitieuse et pragmatique.",
    linkedin: "/linkedin.svg",
    linkedinUrl: "https://www.linkedin.com/in/billel-maati-1764ab216/",
    highlight: true
  },
  {
    img: "/portrait5.jpg",
    name: "Nordine MESKOUR",
    title: "Data Scientist Senior",
    desc: "Chez VertiQual®,martin notre engagement pour un avenir durable se traduit par des projets innovants, conçus et pilotés avec rigueur, expertise et passion. Nous croyons que la transition environnementale doit être à la fois ambitieuse et pragmatique.",
    linkedin: "/linkedin.svg",
    linkedinUrl: "https://www.linkedin.com/in/nordine-meskour-399985b4/",
    highlight: true
  },
]

interface VerticalCarouselProps {
  items?: Founder[]
  duration?: number
  autoPlay?: boolean
}

export default function VerticalCarousel({
  items = foundersData,
  duration = 4,
  autoPlay = true
}: VerticalCarouselProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!autoPlay || isPaused) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, duration * 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [autoPlay, isPaused, duration, items.length])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)
  const handleCardClick = (f: Founder) => {
    if (f.linkedinUrl) window.open(f.linkedinUrl, '_blank', 'noopener,noreferrer')
  }

  const getRel = (idx: number) => (idx - currentIndex + items.length) % items.length

  const renderAll = () =>
    items.map((f, idx) => {
      const rel = getRel(idx)
      let translateY = 0,
        opacity = 0,
        scale = 0.8,
        zIndex = -1,
        visibility: "visible" | "hidden" = "hidden"

      if (rel === 0) {
        translateY = 0
        opacity = 1
        scale = 1
        zIndex = 3
        visibility = "visible"
      } else if (rel === 1) {
        translateY = 220
        opacity = 0.6
        scale = 0.92
        zIndex = 2
        visibility = "visible"
      } else if (rel === items.length - 1) {
        translateY = -220
        opacity = 0.6
        scale = 0.92
        zIndex = 2
        visibility = "visible"
      } else {
 
  translateY = 0;
  opacity = 0;
  scale = 0.8;
  zIndex = -1;
  visibility = 'hidden';
}

      return (
        <div
          key={idx}
          className={`absolute left-1/2 top-1/2 w-full h-[200px] rounded-[23px] p-2 transition-all duration-500 ease-in-out
            ${f.highlight ? "bg-[#F9F8F4]" : "bg-[#F9F8F4]"} ${rel === 0 ? "bg-[#F9F8F4]" : ""}
          `}
          style={{
            transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
            opacity,
            zIndex,
            visibility
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => rel === 0 && handleCardClick(f)}
          role={rel === 0 ? "button" : undefined}
          tabIndex={rel === 0 ? 0 : -1}
          onKeyDown={(e) => {
            if (rel === 0 && (e.key === "Enter" || e.key === " ")) {
              handleCardClick(f)
            }
          }}
        >
          <div className="flex h-full space-x-[8px]">
            <div className="flex-shrink-0 w-[190px] h-full rounded-[15px] overflow-hidden">
              <Image src={f.img} alt={f.name} width={190} height={190} className="object-cover w-full h-full" />
            </div>
            <div className="relative flex bg-white rounded-[15px] p-4">
              <div className="absolute bottom-0 right-0 pointer-events-none">
    <Image 
      src="/overlay_logo.svg" 
      alt="" 
      className="w-[80%] h-[80%] "
    />
  </div>
              <div className="flex justify-between h-full">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                  <h3 className={`text-[#1C4B24] font-medium transition-all ${rel === 0 ? "text-[20px]" : "text-[18px]"}`}>
                    {f.name}
                  </h3>
                  {f.linkedin  && (
                  <div className="ml-4 flex-shrink-0 flex items-start cursor-pointer" onClick={() => f.linkedinUrl && window.open(f.linkedinUrl, '_blank', 'noopener,noreferrer')}>
                    <Image src={f.linkedin} alt="LinkedIn" width={20} height={20} className="w-5 h-5" />
                  </div>
                )}
                </div>
                  <p className={`text-[#61B989] transition-all ${rel === 0 ? "text-[14px]" : "text-[13px]"}`}>
                    {f.title}
                  </p>
                  <p className={`text-[#1C4B24] leading-relaxed transition-all text-justify z-10 ${rel === 0 ? "text-[11.5px]" : "text-[11px]"}`}>
                    {f.desc}
                  </p>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      )
    })

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="relative w-full max-w-4xl h-[700px] overflow-hidden">
        {renderAll()}
      </div>
    </div>
  )
}
