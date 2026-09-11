"use client";

import { Suspense } from "react";
import { Sparkles, Globe, BarChart3 } from "lucide-react";
import { LivingWoodNetwork } from "@/components/ui/LivingWoodNetwork";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { LoginForm } from "@/components/ui/LoginForm";
import { LangToggle } from "@/components/shared/lang-toggle";
import { useLocaleStore } from "@/stores/locale-store";

export default function LoginPage() {
  const { locale } = useLocaleStore();

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden font-manrope grid grid-cols-1 lg:grid-cols-2 bg-[#F9F7F7] relative">
      {/* Top right language switcher */}
      <div className="absolute top-4 right-4 z-50">
        <LangToggle />
      </div>

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between p-6 lg:p-8 xl:p-10 bg-[#133020] text-white relative overflow-hidden h-full">
        {/* Backdrop Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity pointer-events-none z-0 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/Lifewood Tree.jpg')` }}
        />

        {/* Ambient Radial Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#133020]/80 via-[#133020]/60 to-[#133020]/95 pointer-events-none z-0" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#046241]/40 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFB347]/15 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Animated Nodes Canvas */}
        <LivingWoodNetwork variant="light" />

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-4 my-auto pointer-events-auto">
          <div className="flex flex-col items-start gap-1">
            <img
              src="/Logo 2.png"
              alt="Lifewood"
              className="h-10 sm:h-14 w-auto object-contain drop-shadow-md"
            />
            <p className="text-[10px] text-[#F5EEDB]/70 tracking-widest font-semibold uppercase">
              {locale === "zh"
                ? "全球科技展会情报与参展战略平台"
                : "Global Tech Exhibition Intelligence Platform"}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#046241]/40 border border-[#046241] text-[#FFB347] text-[11px] font-semibold w-fit mb-1">
              <Sparkles className="w-3 h-3 text-[#FFB347]" />
              <span>
                {locale === "zh"
                  ? "企业级智能决策 2026–2027"
                  : "Enterprise Intelligence 2026–2027"}
              </span>
            </div>

            <h2 className="text-xl xl:text-2xl font-extrabold text-white tracking-tight leading-tight m-0 p-0 [&>*]:m-0 [&>*]:p-0">
              <TypewriterText
                key={locale}
                text={
                  locale === "zh"
                    ? "精选全球战略科技展会情报追踪与参展决策。"
                    : "Curated Strategic Technology Exhibition Tracking"
                }
                speed={40}
              />
            </h2>

            <p className="text-xs text-[#F5EEDB]/80 leading-relaxed max-w-md m-0 p-0 mt-1">
              {locale === "zh"
                ? "高精度 27 项审核维度、自动化 AI 爬虫发现引擎、紧扣 6 大核心业务线的契合度评估体系。"
                : "High-precision 27-column audit, automated AI crawler discovery engine, and Fit Score alignment across 6 core business lines."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs space-y-0.5">
              <Globe className="w-4 h-4 text-[#FFB347] mb-1" />
              <div className="text-base font-bold text-white">
                {locale === "zh" ? "全球 4 大核心区域" : "4 Major Regions"}
              </div>
              <div className="text-[10px] text-[#F5EEDB]/60">
                {locale === "zh"
                  ? "亚太、北美、欧洲、中东"
                  : "APAC, North America, Europe, ME"}
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs space-y-0.5">
              <BarChart3 className="w-4 h-4 text-[#FFB347] mb-1" />
              <div className="text-base font-bold text-white">
                {locale === "zh" ? "契合度 3+ 严格准入" : "Fit 3+ Verified"}
              </div>
              <div className="text-[10px] text-[#F5EEDB]/60">
                {locale === "zh"
                  ? "精准对标企业级买家需求"
                  : "Enterprise buyer alignment"}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#F5EEDB]/60">
          <span className="text-[#FFB347]">© 2026 Lifewood 活树</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-4 sm:p-8 relative bg-[#F9F7F7] h-full overflow-hidden">
        <LivingWoodNetwork variant="dark" />

        <div className="relative z-10 w-full max-w-md">
          <Suspense
            fallback={
              <div className="text-xs text-[#133020] font-semibold">
                {locale === "zh" ? "正在加载..." : "Loading..."}
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
