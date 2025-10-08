// src/components/LogoGrid.tsx
import { useState, useEffect } from 'react';
import Image from 'next/image';

const logos = [
  "client/1","client/2","client/3","client/4","client/5","client/6",
  "client/7","client/8","client/9","client/10","client/11","client/12", "client/13","client/14","client/15","client/16","client/17","client/18",
];

const LogoGrid = () => {
  const logosPerPage = 6;
  const [startIndex, setStartIndex] = useState(0);
  const [blurred, setBlurred] = useState(false);
  const [animateIn, setAnimateIn] = useState(true);

  useEffect(() => {
    const showTime = 3500;
    const blurTime = 200;

    // Reset animation-in when new batch starts
    setAnimateIn(true);

    // After showTime, apply blur
    const blurTimeout = setTimeout(() => setBlurred(true), showTime);

    // After showTime + blurTime, switch batch
    const switchTimeout = setTimeout(() => {
      setBlurred(false);
      setStartIndex((prev) => (prev + logosPerPage) % logos.length);
      // Trigger enter animation for next batch
      setAnimateIn(false);
      // Allow a tick for React to remove class, then re-add
      setTimeout(() => setAnimateIn(true), 20);
    }, showTime + blurTime);

    return () => {
      clearTimeout(blurTimeout);
      clearTimeout(switchTimeout);
    };
  }, [startIndex]);

  const visibleLogos = Array.from({ length: logosPerPage }, (_, i) => {
    const idx = (startIndex + i) % logos.length;
    return { name: logos[idx], idx };
  });

  return (
    <div className="logo-grid">
      {visibleLogos.map(({ name, idx }) => (
        <div
          key={idx}
          className={`logo-box ${blurred ? 'blur' : ''} ${animateIn ? 'enter' : ''}`}
        >
          <Image
            src={`/${name}.svg`}
            alt={`Logo ${idx + 1}`}
            width={262}
            height={162}
          />
        </div>
      ))}
    </div>
  );
};

export default LogoGrid;
