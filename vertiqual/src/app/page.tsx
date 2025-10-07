// src/app/page.tsx
"use client"
import Image from 'next/image';
import { useState } from "react";
import { motion } from "motion/react"

import Lines from '@/components/Lines'
import CardSwap, { Card } from '@/components/CardSwap'
import LogoGrid from '@/components/LogoGrid'
import ThreeColTwoRow from '@/components/ThreeColTwoRow';
import LogoLoop from "@/components/ScrollVelocity";
import GradientBorderCard from '@/components/GradientBorderCard'
import VerticalCarousel from "@/components/VerticalCarousel"
import ContactForm from '@/components/ContactForm';
import SvgScrollLoop from '@/components/SvgScrollLoop'
import BlurText from '@/components/BlurText'
import ScrollReveal from "@/components/ScrollReveal"
import GradientText from '@/components/GradientText'
 



const imageLogos = [
  { src: "/Normes/1.svg", alt: "Company 1", href: "https://company1.com" },
  { src: "/Normes/2.svg", alt: "Company 2", href: "https://company2.com" },
  { src: "/Normes/3.svg", alt: "Company 3", href: "https://company3.com" },
  { src: "/Normes/4.svg", alt: "Company 3", href: "https://company3.com" },
  { src: "/Normes/5.svg", alt: "Company 3", href: "https://company3.com" },
  { src: "/Normes/6.svg", alt: "Company 3", href: "https://company3.com" },
  { src: "/Normes/7.svg", alt: "Company 3", href: "https://company3.com" },
  { src: "/Normes/8.svg", alt: "Company 3", href: "https://company3.com" },
  { src: "/Normes/9.svg", alt: "Company 3", href: "https://company3.com" },
  { src: "/Normes/10.svg", alt: "Company 3", href: "https://company3.com" },
  { src: "/Normes/11.svg", alt: "Company 3", href: "https://company3.com" },
  { src: "/Normes/12.svg", alt: "Company 3", href: "https://company3.com" },
];
export default function Page() {
  const [showSecond, setShowSecond] = useState(false);
  const [showCards, setShowCards] = useState(false)
  return (
    <>
   
      
    <section className="w-full h-screen hero-container p-0 bg-[#FCFDFB] space-y-[2%]">
      {/* Background lines */}
      <div>
      <Lines />

      {/* Hero content */}
      <div className="z-10 relative flex flex-col items-center text-center mt-45 mb-10 py-6 space-y-[2%] mx-auto px-8 sm:px-6 lg:px-12">
        <BlurText
        text={`La plateforme de durabilité qui transforme <br />
               <b>conformité</b> en <b>performance.</b>`}
        delay={150}
        animateBy="words"
        direction="bottom"
        className="text-[#1C4B24] font-thin text-[52px] leading-[70px]"
        onComplete={() => setShowSecond(true)}   // start the next once finished
      />

      {showSecond && (
        <BlurText
          text={`Anticipez . Optimisez . Matérialisez`}
          delay={100}
          animateBy="words"
          direction="bottom"
          className="text-xl text-[#61B989] font-regular pt-4"
          onComplete={() => setShowCards(true)}
        />
      )}
          
        
        
      </div>

      {/* CardSwap */}
      
      <div className="flex h-[750px] flex-col justify-center items-center z-10 relative min-w-full max-w-lg  gap-0 py-6 mx-auto px-8 sm:px-6 lg:px-12">
        {showCards && (
  <motion.div
    className="relative w-full h-96 justify-center flex items-center mt-6"
    initial={{ filter: "blur(12px)", opacity: 0, y: 150 }}
    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
    transition={{ duration: 5, ease: [0.16, 1, 0.3, 1] }}
  >
    <CardSwap
      cardDistance={0}
      verticalDistance={100}
      delay={4000}
      pauseOnHover={false}
      skewAmount={0}
      easing="elastic"
    >
      <Card />
      <Card />
      <Card />
    </CardSwap>
  </motion.div>
)}
    
{/* smoock */}
        <div
        className="z-11 w-full relative h-180 pointer-events-none filter blur-xl -mt-[8%] lg:-mt-[25%]"
        style={{
          background:
            "linear-gradient(to top, #FCFDFB, #FCFDFB, #FCFDFB, #FCFDFB00, #FCFDFB00, #FCFDFB00, #FCFDFB00)",
        }}
      />
      </div>
      

      </div>
      {/* logo Grid */}
      
  <div className='w-full relative z-11 flex justify-center -mt-[10%] gap-8 flex-wrap bg-[#FCFDFB]  mx-auto px-8 sm:px-6 lg:px-12'>
    <div className="relative z-11  text-center bg-[#FCFDFB]">
      <GradientText
  colors={["#1C4B24", "#61B989", "#1C4B24", "#61B989", "#1C4B24"]}
  animationSpeed={6}
  showBorder={false}
  className="text-[#1C4B24] text-2xl font-extralight"
>
  Ils font déjà confiance aux technologies de <b>VertiQual®</b>
</GradientText>
    
    <LogoGrid />
</div>
</div>
    {/* Grid */}
   
<div className="w-[95%]  bg-[#FCFDFB] p-8 mb-[10%] flex justify-center py-6 mx-auto px-8 sm:px-6 lg:px-12">
      <ThreeColTwoRow>
        {/* Column 1 */}
        <div className="relative w-full h-[550px] flex items-center justify-center"> 
          <video
    className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
    autoPlay
    muted
    loop
    playsInline
    preload="lazy"
  >
    <source src="/Animations/VertiQual-IA.webm" type="video/webm" />
  </video>
        </div>
        <div className="relative h-[150px] w-full overflow-hidden">
  <video
    className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
    autoPlay
    muted
    loop
    playsInline
    preload="lazy"
  >
    <source src="/Animations/aide-a-la-decision.webm" type="video/webm" />
  </video>
</div>

        {/* Column 2 */}
        <div className="h-[200px] relative w-full  flex items-center justify-center bg-[#F1ECE5]/60 rounded-[20px]">
          
  <Image
    src="/Animations/dashboard1.svg"
    alt="Arrow"
    fill
    className="object-cover"
    style={{ objectPosition: '100% 10%' }} 
  />

        </div>
        <div className="relative w-full h-[500px] flex items-center justify-center">
           <video
    className="inset-0 w-full h-full object-cover rounded-[20px]"
    autoPlay
    muted
    loop
    playsInline
    preload="lazy"
  >
    <source src="/Animations/Generer.webm" type="video/webm" />
  </video>
        </div>

        {/* Column 3 */}
        <div className="relative  h-[450px] w-full p-4 text-sm leading-relaxed bg-[#1C4B24] rounded-[20px] space-y-4">
          <div className='flex flex-col space-y-1 rounded-[10px] p-4 bg-gradient-to-br from-white/5 to-white/15'>
          <h6 className='text-[#D7F781] text-[17px] font-bold'>Une expertise qui s’adapte à vos enjeux</h6>
          <h6 className='text-white text-[17px] font-light'>Maîtrisez votre stratégie de durabilité avec VertiQual® et upgreen®</h6>
          <div className='w-full flex justify-end'>
            <Image
              src={`/arrow_green.svg`}
              alt={`Arrow`}
              width={22}
              height={22}
            />
          </div>
          </div>
          <video
    className="inset-0 w-full h-[270px] object-cover "
    autoPlay
    muted
    loop
    playsInline
    preload="lazy"
    style={{ objectPosition: '65% 10%' }} 
  >
    <source src="/Animations/VertiQual-360.webm" type="video/webm" />
  </video>
        </div>
        <div className="relative w-full h-[250px] overflow-hidden bg-[#F1ECE5]/60 rounded-[20px]">
          
  <Image
    src="/Animations/dashboard2.svg"
    alt="Arrow"
    fill
    className="object-cover"
    style={{ objectPosition: '20% 10%' }} 
  />

        </div>
      </ThreeColTwoRow>
    </div>

    {/* logoCarousel + chiifre*/}
<div className="w-full flex flex-col items-center justify-center bg-[#FCFDFB] gap-10 py-6 mx-auto px-8 sm:px-6 lg:px-12">
  <GradientText
  colors={["#1C4B24", "#61B989", "#1C4B24", "#61B989", "#1C4B24"]}
  animationSpeed={6}
  showBorder={false}
  className="text-[#1C4B24] text-2xl font-extralight"
>
  <b>VertiQual®</b> se base sur les normes françaises et mondiales les plus strictes
</GradientText>
  
      <div style={{ height: '70px', position: 'relative', overflow: 'hidden', backgroundColor: '#FCFDFB', width: '100vw', }} className="flex justify-center items-center">
      <LogoLoop
        logos={imageLogos}
        speed={120}
        direction="left"
        logoHeight={48}
        gap={40}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#FCFDFB"
        ariaLabel="Technology partners"
      />
    </div>
    {/* chiifre*/}
<div className="flex z-12 w-[95%] h-[420px] gap-[5%] justify-around px-[5%] py-[5%] bg-[url('/space_earth.jpg')] bg-cover bg-center rounded-[20px] mt-10">
      <GradientBorderCard
        heading={`Réduction du nombre\nd'employés impliqués\ndans le processus`}
        value={-40}
      />
      <GradientBorderCard
        heading={`Augmentation de la\nvitesse de production\npar automatisation`}
        value={+80}
      />
      <GradientBorderCard
        heading={`Amélioration de la\nqualité et réduction des\nerreurs manuelles`}
        value={-45}
      />
    </div>
</div>

<div className='w-full h-fit flex justify-center items-center bg-[#FCFDFB] -mt-[2%] py-6 mx-auto px-8 sm:px-6 lg:px-12'>
<div className='w-[95%] h-full flex justify-center items-center gap-10'>
    <div className='w-full flex flex-col items-start justify-center gap-20 space-y-[-3%]'>
      <div className='flex flex-col gap-12'>
      <Image
              src={`/icon.svg`}
              alt={`VertiQual Logo`}
              width={50}
              height={50}
            />
      <ScrollReveal
  containerClassName="w-full"
  textClassName="text-[42px] text-[#1C4B24] font-medium whitespace-nowrap"
  baseRotation={30}
  baseY={60}
  enableBlur={false}
>
  La technologie est surtout <span className='underline decoration-solid underline-offset-8 decoration-5'>humaine. HIII</span>
</ScrollReveal>

    </div>
    <div className='w-flex flex-col  text-[#1C4B24] text-xl font-light leading-relaxed text-justify gap-6 '>
      

  <ScrollReveal>
    
      <b>VertiQual®</b> s’engage pour un futur où la technologie sert l’humain et la planète.
      <br />
      Cela signifie que <b>l’IA</b> et nos outils n’ont qu’un objectif : accroître le discernement des experts et la valeur pour le terrain. 
      <br />
      Nous transformons des données vérifiables en recommandations claires, traçables et actionnables, pour passer de la <b>conformité</b> à la <b>performance</b>.
    </ScrollReveal>
    <div className='w-[90%] bg-[#F1ECE5] h-[1px] mt-6'></div>

  
    </div>
    </div>
    <div className='w-full h-[100%]  flex flex-col items-center justify-center mt-0'>
      <div className="flex w-full h-[100%] flex-col items-center justify-center gap-0">
        <div
        className="z-11 w-full relative h-50 pointer-events-none filter -mb-50"
        style={{
          background:
            "linear-gradient(to bottom, #FCFDFB, #FCFDFB, #FCFDFB20, #FCFDFB00)",
        }}
      />
      
      <VerticalCarousel />
      <div
        className="z-11 w-full relative h-50 pointer-events-none filter  -mt-50"
        style={{
          background:
            "linear-gradient(to top, #FCFDFB, #FCFDFB, #FCFDFB90, #FCFDFB00)",
        }}
      />
      
    </div>
    </div>
    </div>
   </div>
    
    
  
      
       
      
    <div className='bg-[#F1ECE54D] -mt-[5%]'>
<div className="flex w-full h-[100vh] justify-center items-center mt-20">


  <ContactForm />
  
</div>
  <div className="flex flex-col w-full justify-center items-center">
      <SvgScrollLoop
        svgSrc="/pattern.svg"
        speed={80}
        direction="left"
        svgWidth={120}
        svgHeight={60}
        gap={0}
        pauseOnHover={false}
        fadeOut={true}
        fadeOutColor="transparent"
        className="my-custom-class"
      />
      <div className='flex w-full justify-between  space-x-5 items-center py-8 mb-8 mx-auto px-8 sm:px-6 lg:px-12'>
        <p className='text-sm font-ight text-[#1C4B24] w-auto whitespace-nowrap'>© Copyright 2025 - VertiQual®. All Rights Reserved.</p>
        <div className='bg-[#1C4B24] h-[1px] w-full'></div>
      </div>
    </div>
      </div>
    </section>

    
    </>
  )
}
                     