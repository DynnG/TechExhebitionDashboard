"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, ShieldCheck, Sparkles, Globe, BarChart3, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("admin@lifewood.com");
  const [password, setPassword] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setError(res.error || "Failed to sign in. Please check credentials.");
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
    setEmail(userEmail);
    setPassword(pass);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.04)] p-8 sm:p-10 border border-[#E6E6E6] relative">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#133020] tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-[#666666] mt-1">
          Enter your credentials to access the intelligence platform
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-[#B91C1C]/10 border border-[#B91C1C]/30 rounded-lg flex items-center gap-2.5 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#133020] mb-1.5">
            Work Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@lifewood.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E6E6] text-xs text-[#133020] bg-white placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:ring-2 focus:ring-[#046241]/20 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#133020] mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E6E6] text-xs text-[#133020] bg-white placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:ring-2 focus:ring-[#046241]/20 transition"
          />
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-[#666666] select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[#D8D2C8] text-[#046241] focus:ring-[#046241]"
            />
            <span>Remember me</span>
          </label>
          <span className="text-[#046241] font-medium hover:underline cursor-pointer">
            Forgot password?
          </span>
        </div>

        {/* Primary CTA: Dark Serpent filled with Saffron hover accent */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-5 rounded-lg bg-[#133020] hover:bg-[#133020]/90 text-white hover:text-[#FFB347] border border-[#133020] hover:border-[#FFB347]/60 font-semibold text-xs transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50 mt-2"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign in to Dashboard</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition text-[#FFB347]" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Login Preset Buttons */}
      <div className="mt-8 pt-5 border-t border-[#E6E6E6]">
        <p className="text-[11px] text-[#666666] mb-2.5 font-medium">
          Quick switch demo account:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setQuickUser("admin@lifewood.com", "admin123")}
            className="py-1.5 px-2 bg-[#F9F7F7] hover:bg-[#F5EEDB] text-xs font-semibold text-[#133020] rounded-lg border border-[#E6E6E6] transition text-center"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => setQuickUser("supervisor@lifewood.com", "supervisor123")}
            className="py-1.5 px-2 bg-[#F9F7F7] hover:bg-[#F5EEDB] text-xs font-semibold text-[#133020] rounded-lg border border-[#E6E6E6] transition text-center"
          >
            Supervisor
          </button>
          <button
            type="button"
            onClick={() => setQuickUser("intern@lifewood.com", "intern123")}
            className="py-1.5 px-2 bg-[#F9F7F7] hover:bg-[#F5EEDB] text-xs font-semibold text-[#133020] rounded-lg border border-[#E6E6E6] transition text-center"
          >
            Intern
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen font-manrope grid grid-cols-1 lg:grid-cols-2 bg-[#F9F7F7]">
      {/* Left Panel: Brand Showcase with Lifewood Corporate Imagery, Official Logo Lockup & Tagline */}
      <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-[#133020] text-white relative overflow-hidden">
        {/* Background ambient editorial glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#046241]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFB347]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#046241]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Top Logo Lockup */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFB347] rounded-xl flex items-center justify-center shadow-lg transform rotate-45">
              <span className="transform -rotate-45 font-black text-xl text-[#133020]">❖</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">lifewood</span>
                <span className="text-xl font-bold text-[#FFB347]">活树</span>
              </div>
              <p className="text-[11px] text-[#F5EEDB]/70 tracking-wide font-medium">
                Global Tech Exhibition Intelligence Platform
              </p>
            </div>
          </div>
        </div>

        {/* Middle Feature Highlights / Bento Corporate Showcase */}
        <div className="relative z-10 my-auto py-10 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#046241]/40 border border-[#046241] text-[#FFB347] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise Intelligence 2026–2027</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Curated strategic technology exhibition tracking.
            </h2>
            <p className="text-xs text-[#F5EEDB]/80 leading-relaxed max-w-md">
              High-precision 27-column audit, automated AI crawler discovery engine, and Fit Score alignment across 6 core business lines.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs space-y-1">
              <Globe className="w-5 h-5 text-[#FFB347] mb-2" />
              <div className="text-lg font-bold text-white">4 Major Regions</div>
              <div className="text-[11px] text-[#F5EEDB]/60">APAC, North America, Europe, ME</div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs space-y-1">
              <BarChart3 className="w-5 h-5 text-[#046241] mb-2 text-[#FFB347]" />
              <div className="text-lg font-bold text-white">Fit 3+ Verified</div>
              <div className="text-[11px] text-[#F5EEDB]/60">Enterprise buyer alignment</div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline / Corporate Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#F5EEDB]/60">
          <span>Structured Enterprise Bento Grid & Editorial Minimalism</span>
          <span className="text-[#FFB347]">© 2026 Lifewood 活树</span>
        </div>
      </div>

      {/* Right Panel: Clean White Form Card */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <Suspense fallback={<div className="text-xs text-[#133020] font-semibold">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
