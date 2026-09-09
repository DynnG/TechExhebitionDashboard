"use client";

import React, { useRef, useState } from "react";

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "green" | "saffron";
  borderRadius?: string;
}

export function BorderGlow({
  children,
  className = "",
  glowColor = "green",
  borderRadius = "12px",
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const glowRgb =
    glowColor === "saffron"
      ? "255, 179, 71"
      : "4, 98, 65";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ borderRadius }}
      className={`relative p-[1.5px] bg-[#D8D2C8] transition-colors duration-200 overflow-hidden ${className}`}
    >
      {/* Dynamic Cursor Border Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, rgba(${glowRgb}, 0.5), transparent 70%)`,
          borderRadius,
        }}
      />

      {/* Solid White Surface Container */}
      <div
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
        className="relative h-full w-full bg-white z-10"
      >
        {children}
      </div>
    </div>
  );
}
