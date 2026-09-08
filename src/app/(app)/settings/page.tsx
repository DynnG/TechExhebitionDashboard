"use client";

import { useSession } from "next-auth/react";
import { Settings, Shield, User, Bot, Key, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "INTERN";
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "user@lifewood.com";

  const [aiProvider, setAiProvider] = useState("openai");
  const [aiModel, setAiModel] = useState("gpt-4o-mini");
  const [apiKey, setApiKey] = useState("sk-********************");

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("AI Scraper provider settings saved!");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-manrope">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#046241]" />
            <h2 className="text-2xl font-bold text-[#133020]">
              System Configuration & Account Settings
            </h2>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Manage user roles, AI scraper integrations, and platform credentials
          </p>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#D8D2C8] pb-3">
          <User className="w-5 h-5 text-[#046241]" />
          <h3 className="text-base font-bold text-[#133020]">User Profile Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-[#666666] uppercase font-bold block">Full Name</span>
            <span className="font-bold text-[#133020] text-sm">{userName}</span>
          </div>

          <div>
            <span className="text-[10px] text-[#666666] uppercase font-bold block">Email Address</span>
            <span className="font-bold text-[#133020] text-sm">{userEmail}</span>
          </div>

          <div>
            <span className="text-[10px] text-[#666666] uppercase font-bold block">Assigned Role</span>
            <span className="inline-block px-2.5 py-0.5 rounded bg-[#FFB347] text-[#133020] font-bold text-xs mt-0.5">
              {userRole}
            </span>
          </div>
        </div>
      </div>

      {/* AI Provider Config */}
      {(userRole === "ADMIN" || userRole === "SUPERVISOR") && (
        <form onSubmit={handleSaveAI} className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#D8D2C8] pb-3">
            <Bot className="w-5 h-5 text-[#046241]" />
            <h3 className="text-base font-bold text-[#133020]">AI Scraper & Classification Provider</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                AI Service Provider
              </label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] text-xs text-[#133020] bg-white font-semibold"
              >
                <option value="openai">OpenAI API (Recommended)</option>
                <option value="anthropic">Anthropic Claude API</option>
                <option value="google">Google Gemini API</option>
                <option value="local">Local Ollama Model</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                Model Identifier
              </label>
              <input
                type="text"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] text-xs text-[#133020] bg-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] text-xs text-[#133020] bg-white font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-bold text-xs rounded-lg transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save AI Configuration</span>
            </button>
          </div>
        </form>
      )}

      {/* Role Access Matrix */}
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#D8D2C8] pb-3">
          <Shield className="w-5 h-5 text-[#046241]" />
          <h3 className="text-base font-bold text-[#133020]">System Role Access Control Matrix</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#133020] text-white font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-2.5">Platform Action</th>
                <th className="p-2.5 text-center">Admin</th>
                <th className="p-2.5 text-center">Supervisor</th>
                <th className="p-2.5 text-center">Intern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2C8]">
              <tr>
                <td className="p-2.5 font-semibold text-[#133020]">View Dashboard & Exhibition Records</td>
                <td className="p-2.5 text-center text-[#046241] font-bold">✅</td>
                <td className="p-2.5 text-center text-[#046241] font-bold">✅</td>
                <td className="p-2.5 text-center text-[#046241] font-bold">✅</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-[#133020]">Add New Event (Draft / Review)</td>
                <td className="p-2.5 text-center text-[#046241] font-bold">✅</td>
                <td className="p-2.5 text-center text-[#046241] font-bold">✅</td>
                <td className="p-2.5 text-center text-[#046241] font-bold">✅</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-[#133020]">Publish Event Directly</td>
                <td className="p-2.5 text-center text-[#046241] font-bold">✅</td>
                <td className="p-2.5 text-center text-[#046241] font-bold">✅</td>
                <td className="p-2.5 text-center text-[#B91C1C] font-bold">❌</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-[#133020]">Approve Queue Items & Edits</td>
                <td className="p-2.5 text-center text-[#046241] font-bold">✅</td>
                <td className="p-2.5 text-center text-[#046241] font-bold">✅</td>
                <td className="p-2.5 text-center text-[#B91C1C] font-bold">❌</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-[#133020]">Delete Exhibition Record</td>
                <td className="p-2.5 text-center text-[#046241] font-bold">✅</td>
                <td className="p-2.5 text-center text-[#B91C1C] font-bold">❌</td>
                <td className="p-2.5 text-center text-[#B91C1C] font-bold">❌</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
