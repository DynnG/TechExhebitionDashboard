"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Clock } from "lucide-react";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("admin@lifewood.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

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
          setError("Too many failed attempts. Account temporarily locked.");
        } else {
          setError(res.error || "Failed to sign in. Please check credentials.");
        }
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const setQuickUser = (userEmail: string, pass: string) => {
    if (cooldownSeconds > 0) return;
    setEmail(userEmail);
    setPassword(pass);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-10 sm:p-12 border border-[#D8D2C8] relative">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#133020] tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-[#666666] mt-2">
          Enter your credentials to access the intelligence platform
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#B91C1C]/10 border border-[#B91C1C]/30 rounded-xl flex items-start gap-3 text-sm text-[#B91C1C]">
          {cooldownSeconds > 0 ? (
            <Clock className="w-5 h-5 shrink-0 mt-0.5 text-[#B91C1C]" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <span className="font-semibold block">{error}</span>
            {cooldownSeconds > 0 && (
              <span className="text-xs text-[#B91C1C]/90 font-mono mt-1 block">
                Try again in: {formatTime(cooldownSeconds)}
              </span>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#133020] mb-2">
            Email or Username
          </label>
          <input
            type="email"
            required
            disabled={cooldownSeconds > 0}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@lifewood.com"
            className="w-full px-4 py-3.5 rounded-xl border border-[#D8D2C8] text-sm text-[#133020] bg-white placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:ring-2 focus:ring-[#046241]/20 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#133020]">
              Password
            </label>
            <span className="text-xs text-[#046241] font-semibold hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>
          <input
            type="password"
            required
            disabled={cooldownSeconds > 0}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3.5 rounded-xl border border-[#D8D2C8] text-sm text-[#133020] bg-white placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:ring-2 focus:ring-[#046241]/20 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading || cooldownSeconds > 0}
          className="w-full py-4 px-6 rounded-xl bg-[#133020] hover:bg-[#133020]/90 text-white hover:text-[#FFB347] border border-[#133020] font-semibold text-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : cooldownSeconds > 0 ? (
            <span>Locked ({formatTime(cooldownSeconds)})</span>
          ) : (
            <>
              <span>Sign in to Dashboard</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition text-[#FFB347]" />
            </>
          )}
        </button>
      </form>

      <SocialLinks />

      <div className="mt-8 pt-6 border-t border-[#D8D2C8]">
        <p className="text-xs text-[#666666] mb-3 font-medium">
          Quick switch demo account:
        </p>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            disabled={cooldownSeconds > 0}
            onClick={() => setQuickUser("admin@lifewood.com", "admin123")}
            className="py-2 px-3 bg-[#F9F7F7] hover:bg-[#F5EEDB] text-xs font-semibold text-[#133020] rounded-xl border border-[#D8D2C8] transition text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Admin
          </button>
          <button
            type="button"
            disabled={cooldownSeconds > 0}
            onClick={() =>
              setQuickUser("supervisor@lifewood.com", "supervisor123")
            }
            className="py-2 px-3 bg-[#F9F7F7] hover:bg-[#F5EEDB] text-xs font-semibold text-[#133020] rounded-xl border border-[#D8D2C8] transition text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Supervisor
          </button>
          <button
            type="button"
            disabled={cooldownSeconds > 0}
            onClick={() => setQuickUser("intern@lifewood.com", "intern123")}
            className="py-2 px-3 bg-[#F9F7F7] hover:bg-[#F5EEDB] text-xs font-semibold text-[#133020] rounded-xl border border-[#D8D2C8] transition text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Intern
          </button>
        </div>
      </div>

      <div className="mt-8 pt-4 flex items-center justify-between text-[11px] font-semibold text-[#8C9B9E] tracking-wider uppercase">
        <span>© 2026 LIFEWOOD DATA TECHNOLOGY PHILIPPINES</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#34D399] inline-block"></span>
          <span>V 1.0</span>
        </div>
      </div>
    </div>
  );
}
