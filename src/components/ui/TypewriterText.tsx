"use client";

import { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export function TypewriterText({
  text,
  speed = 25,
  // Replaced font-mono with font-manrope
  className = "text-sm sm:text-base text-[#F5EEDB]/90 leading-relaxed font-manrope max-w-3xl w-full min-h-[4rem]",
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <p className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-2.5 h-4.5 ml-1 bg-[#34D399] animate-pulse align-middle" />
      )}
    </p>
  );
}
