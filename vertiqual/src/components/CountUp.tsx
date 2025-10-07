// src/components/CountUp.tsx
"use client";

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;       // seconds before starting
  duration?: number;    // seconds for the animation
  className?: string;
  startWhen?: boolean;
  separator?: string;   // e.g. ','
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);
  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration)
  });
  const isInView = useInView(ref, { once: true });

  // Determine decimal precision
  const getDecimalPlaces = (num: number): number => {
    const s = num.toString();
    if (s.includes('.')) {
      const dec = s.split('.')[1];
      if (parseInt(dec) !== 0) return dec.length;
    }
    return 0;
  };
  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  // Initialize text
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(direction === 'down' ? to : from);
    }
  }, [from, to, direction]);

  // Trigger animation when in view
  useEffect(() => {
    if (isInView && startWhen) {
      onStart?.();
      const startTimer = setTimeout(() => {
        motionValue.set(direction === 'down' ? from : to);
      }, delay * 1000);
      const endTimer = setTimeout(() => {
        onEnd?.();
      }, (delay + duration) * 1000);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isInView, startWhen, delay, duration, direction, from, to, motionValue, onStart, onEnd]);

  // Update DOM on spring change
  useEffect(() => {
    const unsubscribe = springValue.on('change', latest => {
      if (ref.current) {
        const hasDecimals = maxDecimals > 0;
        const opts: Intl.NumberFormatOptions = {
          useGrouping: !!separator,
          minimumFractionDigits: hasDecimals ? maxDecimals : 0,
          maximumFractionDigits: hasDecimals ? maxDecimals : 0
        };
        let formatted = Intl.NumberFormat('en-US', opts).format(latest);
        if (separator) formatted = formatted.replace(/,/g, separator);
        ref.current.textContent = formatted;
      }
    });
    return () => unsubscribe();
  }, [springValue, separator, maxDecimals]);

  return <span className={className} ref={ref}></span>;
}
