import React, { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  animateToNumber: number;
  includeComma?: boolean;
  duration?: number;
  easing?: (t: number) => number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  animateToNumber,
  includeComma = false,
  duration = 1000,
  easing = (t) => t
}) => {
  const [displayNumber, setDisplayNumber] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startNumberRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    startNumberRef.current = displayNumber;
    startTimeRef.current = null;
    
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      
      const currentNumber = Math.floor(
        startNumberRef.current + (animateToNumber - startNumberRef.current) * easedProgress
      );
      
      setDisplayNumber(currentNumber);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [animateToNumber, duration, easing, displayNumber]);

  const formattedNumber = includeComma
    ? displayNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : displayNumber.toString();

  return <span>{formattedNumber}</span>;
};

export default AnimatedNumber; 