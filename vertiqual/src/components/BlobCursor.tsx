'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';

export interface BlobCursorProps {
  blobType?: 'circle' | 'square';
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterId?: string;
  filterStdDeviation?: number;
  filterColorMatrixValues?: string;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  fastEase?: string;
  slowEase?: string;
  zIndex?: number;
  // New improvements
  hoverScale?: number;
  clickScale?: number;
  magnetDistance?: number;
  enableMagnet?: boolean;
  colorTransition?: boolean;
  hoverColor?: string;
  pulseOnHover?: boolean;
}

export default function BlobCursor({
  blobType = 'circle',
  fillColor = '#1C4B24',
  trailCount = 3,
  sizes = [25, 45, 35],
  innerSizes = [8, 15, 12],
  innerColor = 'rgba(255, 255, 255, 0.9)',
  opacities = [0.8, 0.6, 0.4],
  shadowColor = 'rgba(0, 0, 0, 0.3)',
  shadowBlur = 15,
  shadowOffsetX = 0,
  shadowOffsetY = 0,
  filterId = 'blob',
  filterStdDeviation = 20,
  filterColorMatrixValues = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 25 -12',
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.3,
  fastEase = 'power3.out',
  slowEase = 'power2.out',
  zIndex = 9999,
  // New improvements
  hoverScale = 1.5,
  clickScale = 0.8,
  magnetDistance = 50,
  enableMagnet = true,
  colorTransition = true,
  hoverColor = '#2D5A2F',
  pulseOnHover = true
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const isVisible = useRef(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Improved mouse movement with magnetic effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    let targetX = e.clientX;
    let targetY = e.clientY;

    // Magnetic effect for interactive elements
    if (enableMagnet) {
      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      const interactiveElements = ['button', 'a', 'input', 'textarea', '[role="button"]'];
      
      if (hoveredElement && interactiveElements.some(selector => 
        hoveredElement.matches(selector) || hoveredElement.closest(selector)
      )) {
        const target = hoveredElement.closest('button, a, input, textarea, [role="button"]') as HTMLElement;
        if (target) {
          const rect = target.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt((e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2);
          
          if (distance < magnetDistance) {
            const pullStrength = (magnetDistance - distance) / magnetDistance * 0.3;
            targetX += (centerX - e.clientX) * pullStrength;
            targetY += (centerY - e.clientY) * pullStrength;
          }
          setIsHovering(true);
        }
      } else {
        setIsHovering(false);
      }
    }

    mousePos.current = { x: targetX, y: targetY };
    
    blobsRef.current.forEach((el, i) => {
      if (!el) return;
      const isLead = i === 0;
      const delay = i * 0.02;
      
      gsap.to(el, {
        x: targetX,
        y: targetY,
        duration: isLead ? fastDuration : slowDuration + delay,
        ease: isLead ? fastEase : slowEase
      });
    });
  }, [fastDuration, slowDuration, fastEase, slowEase, enableMagnet, magnetDistance]);

  // Handle hover effects
  useEffect(() => {
    blobsRef.current.forEach((el, i) => {
      if (!el) return;
      
      const currentScale = isClicking ? clickScale : (isHovering ? hoverScale : 1);
      const currentColor = colorTransition && isHovering ? hoverColor : fillColor;
      
      gsap.to(el, {
        scale: currentScale,
        backgroundColor: currentColor,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Pulse effect on hover
      if (pulseOnHover && isHovering && !isClicking) {
        gsap.to(el, {
          scale: currentScale * 1.1,
          duration: 0.6,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        });
      } else {
        gsap.killTweensOf(el);
        gsap.to(el, {
          scale: currentScale,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  }, [isHovering, isClicking, hoverScale, clickScale, fillColor, hoverColor, colorTransition, pulseOnHover]);

  // Mouse events
  const handleMouseDown = useCallback(() => {
    setIsClicking(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    isVisible.current = true;
    blobsRef.current.forEach((el, i) => {
      if (el) {
        gsap.to(el, {
          opacity: opacities[i] || 0.6,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });
  }, [opacities]);

  const handleMouseLeave = useCallback(() => {
    isVisible.current = false;
    setIsHovering(false);
    setIsClicking(false);
    blobsRef.current.forEach((el) => {
      if (el) {
        gsap.killTweensOf(el); // Kill any ongoing animations
        gsap.to(el, {
          opacity: 0,
          scale: 0.5,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Add custom CSS for interactive elements
    const style = document.createElement('style');
    style.textContent = `
      button, a, input, textarea, [role="button"] {
        cursor: none !important;
      }
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Restore default cursor
      document.body.style.cursor = 'auto';
      document.head.removeChild(style);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex }}
    >
      {useFilter && (
        <svg className="absolute w-0 h-0">
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation} />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
      >
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={el => {
              if (el) {
                blobsRef.current[i] = el;
              }
            }}
            className="absolute will-change-transform transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: sizes[i],
              height: sizes[i],
              borderRadius: blobType === 'circle' ? '50%' : '12px',
              backgroundColor: fillColor,
              opacity: 0, // Start hidden
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
              mixBlendMode: 'multiply' // Adds nice blending effect
            }}
          >
            <div
              className="absolute"
              style={{
                width: innerSizes[i],
                height: innerSizes[i],
                top: (sizes[i] - innerSizes[i]) / 2,
                left: (sizes[i] - innerSizes[i]) / 2,
                backgroundColor: innerColor,
                borderRadius: blobType === 'circle' ? '50%' : '6px'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
