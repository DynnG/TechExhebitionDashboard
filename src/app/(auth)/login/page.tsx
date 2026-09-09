"use client";

import { Suspense } from "react";
import { Sparkles, Globe, BarChart3 } from "lucide-react";
import { LivingWoodNetwork } from "@/components/ui/LivingWoodNetwork";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { LoginForm } from "@/components/ui/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen font-manrope grid grid-cols-1 lg:grid-cols-2 bg-[#F9F7F7] relative overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col p-12 lg:p-16 bg-[#133020] text-white relative overflow-hidden">
        {/* Backdrop Image: Lifewood Tree with CSS filter blending */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity pointer-events-none z-0 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/Lifewood Tree.jpg')` }}
        />

        {/* Ambient Radial Gradients / Color Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#133020]/80 via-[#133020]/60 to-[#133020]/95 pointer-events-none z-0" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#046241]/40 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFB347]/15 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Bright Animated Nodes Canvas */}
        <LivingWoodNetwork variant="light" />

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6 my-auto pointer-events-auto">
          <div className="flex flex-col items-start gap-1">
            <img
              src="/Logo 2.png"
              alt="Lifewood"
              className="h-12 sm:h-20 w-auto object-contain drop-shadow-md"
            />
            <p className="text-xs sm:text-sm text-[#F5EEDB]/80 tracking-wide font-medium leading-snug">
              Global Tech Exhibition Intelligence Platform
            </p>
          </div>

          <TypewriterText text="Lifewood Data Technology is a global leader in AI data operations and enterprise business intelligence. We deliver high-precision data annotation, automated discovery, and curated exhibition tracking to power machine learning and strategic decision-making for global enterprises." />

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#046241]/50 border border-[#046241] text-[#FFB347] text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Welcome</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
                Curated Strategic Technology Exhibition Tracking
              </h2>
              <p className="text-xs text-[#F5EEDB]/80 leading-relaxed max-w-md">
                High-precision 27-column audit, automated AI crawler discovery
                engine, and Fit Score alignment across 6 core business lines.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm space-y-1">
                <Globe className="w-5 h-5 text-[#FFB347] mb-2" />
                <div className="text-lg font-bold text-white">
                  4 Major Regions
                </div>
                <div className="text-[11px] text-[#F5EEDB]/60">
                  APAC, North America, Europe, ME
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm space-y-1">
                <BarChart3 className="w-5 h-5 text-[#FFB347] mb-2" />
                <div className="text-lg font-bold text-white">
                  Fit 3+ Verified
                </div>
                <div className="text-[11px] text-[#F5EEDB]/60">
                  Enterprise buyer alignment
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#F5EEDB]/60">
          <span className="text-[#FFB347]">
            © 2026 LIFEWOOD DATA TECHNOLOGY PHILIPPINES
          </span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative bg-[#F9F7F7]">
        <LivingWoodNetwork variant="dark" />

        <div className="relative z-10 w-full max-w-xl">
          <Suspense
            fallback={
              <div className="text-xs text-[#133020] font-semibold">
                Loading...
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
