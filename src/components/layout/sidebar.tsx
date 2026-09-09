"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  Bot,
  FileSpreadsheet,
  ListTodo,
  History,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useLocaleStore } from "@/stores/locale-store";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const { locale } = useLocaleStore();

  const userRole = (session?.user as any)?.role || "INTERN";
  const userName = session?.user?.name || "User";

  const navItems = [
    {
      href: "/dashboard",
      label: locale === "en" ? "Dashboard" : "仪表板",
      icon: LayoutDashboard,
    },
    {
      href: "/events",
      label: locale === "en" ? "Events" : "展会列表",
      icon: CalendarDays,
    },
    {
      href: "/scraper",
      label: locale === "en" ? "Scraper" : "数据抓取器",
      icon: Bot,
    },
    {
      href: "/reports",
      label: locale === "en" ? "Reports" : "报告导出",
      icon: FileSpreadsheet,
    },
    {
      href: "/queues",
      label: locale === "en" ? "Queues" : "审核队列",
      icon: ListTodo,
    },
    {
      href: "/history",
      label: locale === "en" ? "History" : "历史记录",
      icon: History,
    },
    {
      href: "/users",
      label: locale === "en" ? "User Management" : "用户管理",
      icon: Users,
    },
    {
      href: "/settings",
      label: locale === "en" ? "Settings" : "设置",
      icon: Settings,
    },
  ];

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-[#FFB347] text-[#133020] font-bold";
      case "SUPERVISOR":
        return "bg-[#046241] text-white font-bold";
      default:
        return "bg-[#708E7C] text-white font-medium";
    }
  };

  return (
    <aside
      className={`bg-[#F9F7F7] text-[#133020] border-r border-[rgba(19,48,32,0.08)] flex flex-col justify-between transition-all duration-200 ease-in-out relative z-30 h-screen sticky top-0 shadow-[0_4px_20px_-2px_rgba(19,48,32,0.05)] ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 w-6 h-6 bg-white border border-[rgba(19,48,32,0.12)] text-[#133020] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F5EEDB] hover:text-[#046241] transition z-40"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Top Header & Logo */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-[rgba(19,48,32,0.08)]">
          <div className="w-9 h-9 bg-[#133020] rounded-lg flex items-center justify-center shrink-0 shadow-sm transform rotate-45">
            <span className="transform -rotate-45 font-black text-base text-[#FFB347]">
              ❖
            </span>
          </div>
          {!collapsed && (
            <div>
              <div className="flex items-baseline gap-1.5">
                <h1 className="font-bold text-base text-[#133020] tracking-tight leading-tight">
                  lifewood
                </h1>
                <span className="font-bold text-sm text-[#046241]">
                  活树
                </span>
              </div>
              <p className="text-[10px] text-[#666666] tracking-normal font-medium mt-0.5">
                {locale === "en" ? "Exhibition Intelligence" : "全球展会智能平台"}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Items — Minimalist inline indicator, 2px bottom border underline, no bulky pills */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-xs transition-colors duration-150 relative bg-transparent ${
                  isActive
                    ? "text-[#133020] font-semibold border-b-2 border-[#133020]"
                    : "text-[#666666] hover:text-[#046241] font-normal border-b-2 border-transparent"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-[#133020]" : "text-[#666666] group-hover:text-[#046241]"
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile & Role */}
      <div className="p-4 border-t border-[rgba(19,48,32,0.08)] bg-white/50">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#133020] flex items-center justify-center text-xs font-bold text-[#FFB347] shrink-0 border border-[#133020]/20">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-[#133020] truncate">
                  {userName}
                </p>
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider mt-0.5 ${getRoleBadgeStyle(
                    userRole
                  )}`}
                >
                  {userRole}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign Out"
              className="p-2 text-[#666666] hover:text-[#046241] hover:bg-white rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title={`Sign Out (${userName})`}
            className="w-full flex justify-center p-2 text-[#666666] hover:text-[#046241] hover:bg-white rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
