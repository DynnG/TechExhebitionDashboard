"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LangToggle } from "@/components/shared/lang-toggle";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useLocaleStore } from "@/stores/locale-store";

export function Topbar() {
  const pathname = usePathname();
  const { locale } = useLocaleStore();

  const [isDark, setIsDark] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const dark = savedTheme === "dark";

    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;

    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const getPageTitle = (path: string) => {
    if (path.startsWith("/dashboard"))
      return locale === "en" ? "Dashboard" : "仪表板";

    if (path === "/events")
      return locale === "en" ? "Events" : "展会列表";

    if (path === "/events/new")
      return locale === "en" ? "Add Event" : "添加展会记录";

    if (path.includes("/edit"))
      return locale === "en" ? "Edit Event" : "编辑展会记录";

    if (path.startsWith("/events/"))
      return locale === "en" ? "Event Details" : "展会详情";

    if (path.startsWith("/scraper"))
      return locale === "en" ? "Scraper" : "数据抓取器";

    if (path.startsWith("/reports"))
      return locale === "en" ? "Reports" : "报告导出";

    if (path.startsWith("/queues"))
      return locale === "en" ? "Queues" : "审核队列";

    if (path.startsWith("/history"))
      return locale === "en" ? "History" : "历史记录";

    if (path.startsWith("/users"))
      return locale === "en" ? "User Management" : "用户管理";

    if (path.startsWith("/settings"))
      return locale === "en" ? "Settings" : "设置";

    return locale === "en" ? "Dashboard" : "仪表板";
  };

  const title = getPageTitle(pathname);

  return (
    <header className="h-16 bg-[#F5EEDB]/95 dark:bg-[#133020]/95 backdrop-blur-md border-b border-[#D8D2C8] dark:border-[#1E4830] px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors font-manrope">

      {/* Page Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-[#666666] dark:text-white/60">

          <Link
            href="/dashboard"
            className="hover:text-[#046241] dark:hover:text-[#2EA87A] transition font-medium"
          >
            Lifewood 活树
          </Link>

          <ChevronRight className="w-3 h-3 text-[#999999] dark:text-white/40" />

          <span className="text-[#133020] dark:text-white font-semibold">
            {title}
          </span>

        </div>

        <h1 className="text-xl font-bold text-[#133020] dark:text-white tracking-tight mt-0.5 font-manrope">
          {title}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">

        {/* Dark / Light Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-3 py-2 border-[1.5px] border-[#D8D2C8] dark:border-[#405449] bg-white dark:bg-[#17231C] text-[#133020] dark:text-[#F9F7F7] hover:bg-[#F9F7F7] dark:hover:bg-[#22352A] text-xs font-medium rounded-[8px] transition-colors"
          aria-label="Toggle dark mode"
        >
          <motion.div
            key={isDark ? "dark" : "light"}
            initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </motion.div>

          <span>{isDark ? "Light" : "Dark"}</span>
        </motion.button>

        <LangToggle />

      </div>
    </header>
  );
}