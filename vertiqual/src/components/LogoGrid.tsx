// src/components/LogoGrid.tsx
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const logos = [
  "client/1", "client/2", "client/3", "client/4", "client/5", "client/6",
  "client/7", "client/8", "client/9", "client/10", "client/11", "client/12",
  "client/13", "client/14", "client/15", "client/16", "client/17", "client/18",
];

const LogoGrid = () => {
  const logosPerPage = 6;
  const [startIndex, setStartIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const showTime = 3000; // Show logos for 3 seconds
    
    const timer = setTimeout(() => {
      setAnimationKey(prev => prev + 1); // Trigger new animation cycle
      setStartIndex((prev) => (prev + logosPerPage) % logos.length);
    }, showTime);

    return () => clearTimeout(timer);
  }, [startIndex, logosPerPage]);

  const visibleLogos = Array.from({ length: logosPerPage }, (_, i) => {
    const idx = (startIndex + i) % logos.length;
    return {
      name: logos[idx],
      idx,
    };
  });

  // Container variants for orchestrating children animations
  const containerVariants: Variants = {
    hidden: {
      opacity: 1,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Delay between each child animation
        delayChildren: 0,   // Initial delay before any child starts
      },
    },
    exit: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Faster stagger on exit
        staggerDirection: -1,  // Animate from last to first on exit
      },
    },
  };

  // Individual logo item variants
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 20,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const, // Fix: Type assertion for literal type
        bounce: 0.3,
        duration: 1.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.6,
      filter: "blur(8px)",
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="logo-grid-container w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={animationKey}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-2 md:grid-cols-3 gap-6 p-4"
        >
          {visibleLogos.map(({ name, idx }) => (
            <motion.div
              key={`${animationKey}-${idx}`}
              variants={itemVariants}
              className="logo-box flex items-center justify-center p-6 "
            >
              <Image
                src={`/${name}.svg`}
                alt={`Logo ${idx + 1}`}
                width={262}
                height={162}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LogoGrid;
