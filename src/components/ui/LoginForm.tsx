"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { useLocaleStore } from "@/stores/locale-store";

export function LoginForm() {
  const { locale } = useLocaleStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("admin@lifewood.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownSeconds > 0) return;

    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        if (res.error.startsWith("TOO_MANY_ATTEMPTS:")) {
          const seconds = parseInt(res.error.split(":")[1], 10) || 120;
          setCooldownSeconds(seconds);
          setError(
            locale === "zh"
              ? "失败次数过多，账户已被临时锁定。"
              : "Too many failed attempts. Account temporarily locked.",
          );
        } else {
          setError(
            res.error ||
              (locale === "zh"
                ? "登录失败，请核对邮箱与密码。"
                : "Failed to sign in. Please check credentials."),
          );
        }
        setLoading(false);
      } else if (res?.ok) {
        setShowIntro(true);
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 1400);
      }
    } catch {
      setError(
        locale === "zh" ? "发生未知错误。" : "An unexpected error occurred.",
      );
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  return (
    <>
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 sm:p-8 border border-[#D8D2C8] relative font-manrope z-10">
        {/* Brand Logo & Portal Access Badge Side-by-Side */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <img
            src="/LifeScout Light Mode.png"
            alt="Lifewood Data Technology"
            className="h-12 sm:h-20 w-auto object-contain shrink-0"
          />
          <span className="text-[10px] font-bold text-[#046241] uppercase tracking-wider bg-[#046241]/10 px-3 py-1.5 rounded-full shrink-0">
            Portal Access
          </span>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#133020] tracking-tight">
            {locale === "zh" ? "欢迎回来" : "Welcome back"}
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            {locale === "zh"
              ? "请输入您的安全凭证以访问展会情报工作台"
              : "Enter your credentials to access the intelligence platform"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#B91C1C]/10 border border-[#B91C1C]/30 rounded-xl flex items-start gap-2.5 text-xs text-[#B91C1C]">
            {cooldownSeconds > 0 ? (
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-[#B91C1C]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-semibold block">{error}</span>
              {cooldownSeconds > 0 && (
                <span className="text-[11px] text-[#B91C1C]/90 font-mono mt-0.5 block">
                  {locale === "zh" ? "请稍候重试：" : "Try again in: "}{" "}
                  {formatTime(cooldownSeconds)}
                </span>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#133020] mb-1">
              {locale === "zh" ? "电子邮箱或用户名" : "Email or Username"}
            </label>
            <input
              type="email"
              required
              disabled={cooldownSeconds > 0}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@lifewood.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D2C8] text-xs text-[#133020] bg-white placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:ring-1 focus:ring-[#046241]/20 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#133020] mb-1">
              {locale === "zh" ? "密码" : "Password"}
            </label>
            <input
              type="password"
              required
              disabled={cooldownSeconds > 0}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D2C8] text-xs text-[#133020] bg-white placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:ring-1 focus:ring-[#046241]/20 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading || cooldownSeconds > 0}
            className="w-full py-3 px-5 rounded-xl bg-[#046241] hover:bg-[#133020] text-white border border-[#046241] font-semibold text-xs transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
          >
            {loading ? (
              <span>{locale === "zh" ? "登录中..." : "Signing in..."}</span>
            ) : cooldownSeconds > 0 ? (
              <span>
                {locale === "zh"
                  ? `已锁定 (${formatTime(cooldownSeconds)})`
                  : `Locked (${formatTime(cooldownSeconds)})`}
              </span>
            ) : (
              <>
                <span>
                  {locale === "zh" ? "登录进入工作台" : "Sign in to Dashboard"}
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition text-[#FFB347]" />
              </>
            )}
          </button>
        </form>

        <SocialLinks />

        <div className="mt-6 pt-3 flex items-center justify-between text-[10px] font-semibold text-[#8C9B9E] tracking-wider uppercase border-t border-[#D8D2C8]">
          <span>© 2026 LIFEWOOD DATA TECHNOLOGY</span>
          <div className="flex items-center gap-1.5"></div>
        </div>
      </div>

      {/* Post-login Intro Splash */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] bg-[#F5EEDB] flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <img
                src="/LifeScout Light Mode.png"
                alt="Lifewood Data Technology"
                className="h-20 w-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}