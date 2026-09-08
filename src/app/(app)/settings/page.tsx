"use client";

import { useSession } from "next-auth/react";
import { Settings, Shield, User } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "INTERN";
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "user@lifewood.com";

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
            Manage user profiles, environment integrations, and platform credentials
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
