"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("admin@lifewood.com");
  const [password, setPassword] = useState("admin123");
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
    <div className="w-full max-w-md bg-[#FFFFFF] rounded-2xl shadow-2xl p-8 border border-[#D8D2C8] relative z-10">
      {/* Header Logo */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-14 h-14 bg-[#133020] rounded-xl flex items-center justify-center mb-4 shadow-lg border border-[#FFB347]/30 transform rotate-45">
          <div className="transform -rotate-45 font-extrabold text-2xl text-[#FFB347]">
            ❖
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-[#133020]">
          Lifewood Exhibition Dashboard
        </h1>
        <p className="text-sm text-[#666666] mt-1">
          Global Tech Exhibition Intelligence Platform
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#B91C1C]/10 border border-[#B91C1C]/30 rounded-lg flex items-center gap-3 text-sm text-[#B91C1C]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#133020] mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@lifewood.com"
            className="w-full px-4 py-3 rounded-lg border border-[#D8D2C8] text-sm text-[#133020] bg-white focus:outline-none focus:border-[#046241] focus:ring-2 focus:ring-[#046241]/20 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#133020] mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg border border-[#D8D2C8] text-sm text-[#133020] bg-white focus:outline-none focus:border-[#046241] focus:ring-2 focus:ring-[#046241]/20 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-lg bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-semibold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign in to Dashboard</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Login Preset Buttons */}
      <div className="mt-8 pt-6 border-t border-[#D8D2C8]">
        <p className="text-xs text-center text-[#666666] mb-3 font-medium">
          Demo quick switch:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setQuickUser("admin@lifewood.com", "admin123")}
            className="py-1.5 px-2 bg-[#F9F7F7] hover:bg-[#F5EEDB] text-xs font-medium text-[#133020] rounded border border-[#D8D2C8] transition text-center"
          >
            Admin
          </button>
          <button
            onClick={() => setQuickUser("supervisor@lifewood.com", "supervisor123")}
            className="py-1.5 px-2 bg-[#F9F7F7] hover:bg-[#F5EEDB] text-xs font-medium text-[#133020] rounded border border-[#D8D2C8] transition text-center"
          >
            Supervisor
          </button>
          <button
            onClick={() => setQuickUser("intern@lifewood.com", "intern123")}
            className="py-1.5 px-2 bg-[#F9F7F7] hover:bg-[#F5EEDB] text-xs font-medium text-[#133020] rounded border border-[#D8D2C8] transition text-center"
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
    <div className="min-h-screen bg-[#133020] flex items-center justify-center p-4 relative overflow-hidden font-manrope">
      {/* Background accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#046241]/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFB347]/10 rounded-full blur-3xl" />

      <Suspense fallback={<div className="text-white text-xs font-semibold">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
