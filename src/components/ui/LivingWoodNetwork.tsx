"use client";

import { useEffect, useRef } from "react";

interface LivingWoodNetworkProps {
  variant?: "light" | "dark"; // 'light' for dark bg (left), 'dark' for light bg (right)
}

export function LivingWoodNetwork({
  variant = "light",
}: LivingWoodNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particleCount = 38;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      color: string;
      pulseSpeed: number;
      pulseAngle: number;
    }> = [];

    // Left Panel (Light Variant / Dark BG): Firefly Warm Yellows & Gold
    const fireflyColors = [
      "#FFD700",
      "#FFC107",
      "#FFB347",
      "#FFE57F",
      "#F5EEDB",
    ];

    // Right Panel (Dark Variant / Light BG): Vibrant Lifewood Greens
    const lifewoodGreenColors = [
      "#046241",
      "#10B981",
      "#059669",
      "#133020",
      "#34D399",
    ];

    const colors = variant === "light" ? fireflyColors : lifewoodGreenColors;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2.2 + 1.2,
        baseAlpha:
          variant === "light"
            ? Math.random() * 0.5 + 0.3
            : Math.random() * 0.4 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.025 + 0.01, // Firefly pulsing speed
        pulseAngle: Math.random() * Math.PI * 2,
      });
    }

    const mouse = { x: -1000, y: -1000, radius: 150 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        p.pulseAngle += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.25;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.15, Math.min(1, currentAlpha));

        // Add soft glow effect for fireflies on left panel
        if (variant === "light") {
          ctx.shadowColor = "#FFD700";
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }

        ctx.fill();

        // Reset shadow for web lines
        ctx.shadowBlur = 0;

        // Connecting lines between nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity =
              (1 - dist / maxDist) * (variant === "light" ? 0.2 : 0.15);
            ctx.strokeStyle = variant === "light" ? "#FFB347" : "#046241";
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Mouse interaction lines
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          const mOpacity = (1 - mdist / mouse.radius) * 0.4;
          ctx.strokeStyle = variant === "light" ? "#FFD700" : "#10B981";
          ctx.globalAlpha = mOpacity;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}
