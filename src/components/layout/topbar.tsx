"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LangToggle } from "@/components/shared/lang-toggle";
import { Plus, ChevronRight } from "lucide-react";
import { useLocaleStore } from "@/stores/locale-store";

export function Topbar() {
  const pathname = usePathname();
  const { locale } = useLocaleStore();

  const getPageTitle = (path: string) => {
    if (path.startsWith("/dashboard")) return locale === "en" ? "Dashboard" : "仪表板";
    if (path === "/events") return locale === "en" ? "Exhibition Events" : "展会列表";
    if (path === "/events/new") return locale === "en" ? "Add Exhibition Event" : "添加展会记录";
    if (path.includes("/edit")) return locale === "en" ? "Edit Event" : "编辑展会记录";
    if (path.startsWith("/events/")) return locale === "en" ? "Event Specifications" : "展会详细规格";
    if (path.startsWith("/scraper")) return locale === "en" ? "AI Scraper Engine" : "AI 智能抓取引擎";
    if (path.startsWith("/reports")) return locale === "en" ? "Executive Reports" : "执行报告导出";
    if (path.startsWith("/queues")) return locale === "en" ? "Review Queues" : "审核与更正队列";
    if (path.startsWith("/users")) return locale === "en" ? "User Management" : "用户管理";
    if (path.startsWith("/settings")) return locale === "en" ? "System Settings" : "系统配置与权限";
    return locale === "en" ? "Dashboard" : "仪表板";
  };

  const title = getPageTitle(pathname);

  return (
    <header className="h-16 bg-[#F5EEDB] border-b border-[#D8D2C8] px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Page Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-[#666666]">
          <Link href="/dashboard" className="hover:text-[#046241] transition font-medium">
            Lifewood
          </Link>
          <ChevronRight className="w-3 h-3 text-[#999999]" />
          <span className="text-[#133020] font-semibold">{title}</span>
        </div>
        <h1 className="text-xl font-semibold text-[#133020] tracking-tight mt-0.5">
          {title}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <LangToggle />
      </div>
    </header>
  );
}
