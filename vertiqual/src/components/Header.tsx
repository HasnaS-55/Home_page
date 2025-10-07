// components/Header.tsx’
"use client"
import Link from 'next/link'
import Image from 'next/image'
import LanguageToggle from '@/components/LanguageToggle'

const handleLanguageChange = (lang: 'fr' | 'en') => {
  console.log('Language changed to:', lang)
  // Implement language change logic here (e.g., update context, reload page, etc.)
}
  

export default function Header() {
  return (
    <header className="z-1000 fixed top-0 left-1/2 transform -translate-x-1/2 w-full bg-[#FCFDFB] py-6 mx-auto px-8 sm:px-6 lg:px-12">
      <div className="">
        <div className="flex justify-between items-center h-16">
          {/* Logo using Next.js Image component */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/vertiqual_logo.svg"
                alt="VertQual Logo"
                width={160}
                height={36}
                priority
              />
            </Link>
          </div>
          
          {/* Rest of your navigation */}
          <nav className="hidden lg:flex items-center space-x-3">
            <Link 
              href="/evaluation" 
              className="text-base text-[#1C4B24] hover:text-[#61B989] font-regular transition-colors duration-200"
            >
              Évaluation & Conformité
            </Link>
            <div className="w-1 h-1 bg-[#61B989] rounded-full mx-4"></div>
            <Link 
              href="/pilotage" 
              className="text-base text-[#1C4B24] hover:text-[#61B989] font-regular transition-colors duration-200"
            >
              Pilotage & Optimisation
            </Link>
            <div className="w-1 h-1 bg-[#61B989] rounded-full mx-4"></div>
            <Link 
              href="/reglementation" 
              className="text-base text-[#1C4B24] hover:text-[#61B989] font-regular transition-colors duration-200"
            >
              Réglementation & Veilles
            </Link>
            <div className="w-1 h-1 bg-[#61B989] rounded-full mx-4"></div>
            <Link
  href="/upgrade" 
  className="text-base text-[#1C4B24] hover:text-[#61B989] font-regular transition-colors duration-200"
>
  upgreen®
</Link>
          </nav>


          {/* Action Buttons */}
          {/* Toggle button*/}

          <div className="flex items-center space-x-2">
            <div className="flex justify-end">
      <LanguageToggle 
        onLanguageChange={handleLanguageChange}
        defaultLanguage="fr"
        className=""
      />
    </div>
            <Link
          href="/connexion"
          className="shiny-button text-base bg-[#1C4B24] hover:bg-green-800 text-white px-[29.5px] py-2 rounded-full font-regular transition-colors duration-200"
          style={{ ["--shine-delay" as string]: "0s" }}
        >
          Connexion
        </Link>

        <Link
          href="/demo"
          className="shiny-button text-base bg-[#1C4B24] hover:bg-green-700 text-white px-4 py-2 rounded-full font-regular transition-colors duration-200"
          style={{ ["--shine-delay" as string]: "0.8s" }}  /* delay this one */
        >
          Démo gratuite
        </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
