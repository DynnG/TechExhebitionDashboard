"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
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
      label: locale === "en" ? "Scraper Engine" : "数据抓取器",
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
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-[#F9F7F7] dark:bg-[#081C12] text-[#133020] dark:text-white flex flex-col justify-between relative z-50 h-screen sticky top-0 shadow-xl border-r border-[#D8D2C8] dark:border-[#046241]/40 font-manrope transition-colors duration-300"
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-5 w-7 h-7 bg-[#FFB347] text-[#133020] border border-[#133020]/20 dark:border-white/20 rounded-full flex items-center justify-center shadow-lg hover:bg-[#FFC370] hover:scale-110 transition z-[60] cursor-pointer"
        title={
          locale === "zh"
            ? collapsed
              ? "展开侧边栏"
              : "折叠侧边栏"
            : collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
        }
      >
        {collapsed ? (
          <ChevronRight className="w-4.5 h-4.5" />
        ) : (
          <ChevronLeft className="w-4.5 h-4.5" />
        )}
      </button>

      {/* Top Header & Logo Placeholder */}
      <div>
        <div className="py-5 px-3 flex flex-col items-center border-b border-[#133020]/10 dark:border-white/10 transition-colors">
          <div className="relative flex items-center justify-center w-full h-6">
            {/* Light Mode Logo */}
            <Image
              src="/LifeScout Light Mode.png"
              alt="LifeScout logo"
              width={150}
              height={20}
              className="object-contain dark:hidden"
            />
            {/* Dark Mode Logo */}
            <Image
              src="/LifeScout Dark Mode.png"
              alt="LifeScout logo"
              width={150}
              height={20}
              className="object-contain hidden dark:block"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 relative group overflow-hidden ${
                  isActive
                    ? "bg-[#FFB347]/15 text-[#133020] dark:text-white font-bold"
                    : "text-[#133020]/65 dark:text-white/65 hover:bg-[#133020]/5 dark:hover:bg-white/5 hover:text-[#133020] dark:hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1 bottom-1 w-1 bg-[#FFB347] rounded-r-full"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive
                      ? "text-[#FFB347]"
                      : "text-[#133020]/65 dark:text-white/65"
                  }`}
                />

                {!collapsed && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Powered By Lifewood PH */}
      <div className="px-3.5 pb-3 pt-2 flex flex-col items-center gap-1.5">
        {!collapsed ? (
          <>
            {/* User Profile & Role — now above the Lifewood logo, with card border */}
            <div className="w-full mb-2 pb-3 border-b border-[#133020]/10 dark:border-white/10">
              <div className="flex items-center justify-between px-1 py-1">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-[#046241] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm border border-[#133020]/20 dark:border-white/20">
                    {userName.charAt(0).toUpperCase()}
                  </div>

                  <div className="truncate">
                    <p className="text-xs font-semibold text-[#133020] dark:text-white truncate">
                      {userName}
                    </p>

                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider mt-0.5 ${getRoleBadgeStyle(
                        userRole,
                      )}`}
                    >
                      {locale === "zh"
                        ? userRole === "ADMIN"
                          ? "管理员"
                          : userRole === "SUPERVISOR"
                            ? "主管"
                            : "实习生"
                        : userRole}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  title={locale === "zh" ? "退出登录" : "Sign Out"}
                  className="p-2 text-[#133020]/60 dark:text-white/60 hover:text-[#FFB347] hover:bg-[#133020]/5 dark:hover:bg-white/5 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center w-full h-6">
              {/* Light Mode Logo */}
              <Image
                src="/logo.png"
                alt="Lifewood logo"
                width={100}
                height={20}
                className="object-contain dark:hidden"
              />
              {/* Dark Mode Logo */}
              <Image
                src="/Logo 2.png"
                alt="Lifewood logo"
                width={100}
                height={20}
                className="object-contain hidden dark:block"
              />
            </div>
            <p className="text-[8.5px] text-[#133020]/50 dark:text-white/40 uppercase tracking-[0.15em] font-semibold">
              Powered by Lifewood PH
            </p>
          </>
        ) : (
          <>
            <div className="w-full flex flex-col items-center gap-2 mb-2 pb-3 border-b border-[#133020]/10 dark:border-white/10">
              <div className="w-8 h-8 rounded-full bg-[#046241] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm border border-[#133020]/20 dark:border-white/20">
                {userName.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                title={
                  locale === "zh"
                    ? `退出登录 (${userName})`
                    : `Sign Out (${userName})`
                }
                className="p-2 text-[#133020]/60 dark:text-white/60 hover:text-[#FFB347] hover:bg-[#133020]/5 dark:hover:bg-white/5 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            <div className="relative flex items-center justify-center w-full h-6">
              <Image
                src="/logo.png"
                alt="Lifewood logo"
                width={40}
                height={16}
                className="object-contain dark:hidden"
              />
              <Image
                src="/Logo 2.png"
                alt="Lifewood logo"
                width={40}
                height={16}
                className="object-contain hidden dark:block"
              />
            </div>
          </>
        )}
      </div>
    </motion.aside>
  );
}
