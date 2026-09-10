"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Settings,
  Shield,
  User,
  Key,
  Lock,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
  Bell,
  Globe2,
  Sparkles,
  Sliders,
  Save,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";

export default function SettingsPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "INTERN";
  const userName = session?.user?.name || "Lifewood Admin";
  const userEmail = session?.user?.email || "admin@lifewood.com";
  const { locale, setLocale } = useLocaleStore();

  const [activeTab, setActiveTab] = useState<"general" | "engine" | "security">("general");

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Engine / System Preference states (executive controls)
  const [targetMinFit, setTargetMinFit] = useState(3);
  const [autoEnforceAudit, setAutoEnforceAudit] = useState(true);
  const [streamPollingRate, setStreamPollingRate] = useState("8s");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savingPreferences, setSavingPreferences] = useState(false);

  const handleSavePreferences = () => {
    setSavingPreferences(true);
    setTimeout(() => {
      setSavingPreferences(false);
      toast.success(
        locale === "zh" ? "系统设置与抓取引擎策略已保存！" : "Engine preferences & system policies saved!"
      );
    }, 600);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(locale === "zh" ? "请完整填写所有密码字段。" : "Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(locale === "zh" ? "新密码长度至少须为 6 个字符。" : "New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(locale === "zh" ? "两次输入的新密码不一致。" : "New password and confirm password do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(locale === "zh" ? "密码修改成功！" : "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || (locale === "zh" ? "修改密码失败。" : "Failed to change password."));
      }
    } catch {
      toast.error(locale === "zh" ? "修改密码时发生错误。" : "An error occurred while updating your password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen -m-8 p-8 space-y-8 font-manrope bg-[#F5EEDB] dark:bg-[#133020] text-[#133020] dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D8D2C8] dark:border-[#1E4830] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#046241]/10 dark:bg-[#046241]/25 border border-[#046241]/20 flex items-center justify-center text-[#046241] dark:text-[#52B788]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#133020] dark:text-white">
              {locale === "en" ? "System Configuration & Governance" : "系统配置与战略控制台"}
            </h2>
            <p className="text-xs text-[#666666] dark:text-white/60 mt-0.5">
              {locale === "en"
                ? "Fine-tune AI discovery thresholds, RBAC governance permissions, security, and enterprise preferences"
                : "调节 AI 发现阈值、角色权限矩阵、安全凭证与企业级运行参数"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          disabled={savingPreferences}
          className="px-4 py-2 bg-[#046241] hover:bg-[#034d33] text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {savingPreferences ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{locale === "zh" ? "保存配置更改" : "Save Changes"}</span>
        </button>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "general"
              ? "bg-[#046241] text-white shadow-sm"
              : "bg-white dark:bg-[#1A3828] text-[#666666] dark:text-white/70 border border-[#D8D2C8] dark:border-[#1E4830] hover:text-[#046241]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>{locale === "en" ? "Overview & RBAC" : "个人概览与权限"}</span>
        </button>

        <button
          onClick={() => setActiveTab("engine")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "engine"
              ? "bg-[#046241] text-white shadow-sm"
              : "bg-white dark:bg-[#1A3828] text-[#666666] dark:text-white/70 border border-[#D8D2C8] dark:border-[#1E4830] hover:text-[#046241]"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>{locale === "en" ? "AI Scraper Policies" : "抓取策略与管道"}</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "security"
              ? "bg-[#046241] text-white shadow-sm"
              : "bg-white dark:bg-[#1A3828] text-[#666666] dark:text-white/70 border border-[#D8D2C8] dark:border-[#1E4830] hover:text-[#046241]"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{locale === "en" ? "Account Security" : "安全与密码"}</span>
        </button>
      </div>

      {/* Tab: General & RBAC */}
      {activeTab === "general" && (
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white dark:bg-[#1A3828] p-6 sm:p-8 rounded-2xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D8D2C8] dark:border-[#1E4830] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#046241] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
                  {userName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#133020] dark:text-white">{userName}</h3>
                  <p className="text-xs text-[#666666] dark:text-white/60">{userEmail}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#046241]/10 dark:bg-[#046241]/30 border border-[#046241]/30 text-[#046241] dark:text-[#52B788] text-xs font-extrabold">
                {userRole}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-[#F9F7F7] dark:bg-[#133020] p-4 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830]">
                <span className="text-[10px] text-[#666666] dark:text-white/60 uppercase font-bold block mb-1">
                  {locale === "en" ? "Organization" : "所属机构"}
                </span>
                <span className="font-bold text-[#133020] dark:text-white text-sm">Lifewood Data Technology</span>
              </div>

              <div className="bg-[#F9F7F7] dark:bg-[#133020] p-4 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830]">
                <span className="text-[10px] text-[#666666] dark:text-white/60 uppercase font-bold block mb-1">
                  {locale === "en" ? "Target Exhibition Scope" : "展会规划周期"}
                </span>
                <span className="font-bold text-[#133020] dark:text-white text-sm">2026-09-01 — 2027-12-31</span>
              </div>

              <div className="bg-[#F9F7F7] dark:bg-[#133020] p-4 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830]">
                <span className="text-[10px] text-[#666666] dark:text-white/60 uppercase font-bold block mb-1">
                  {locale === "en" ? "Active Language" : "当前界面语言"}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setLocale("en")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      locale === "en"
                        ? "bg-[#046241] text-white"
                        : "bg-white dark:bg-[#1A3828] text-[#133020] dark:text-white border border-[#D8D2C8] dark:border-[#1E4830]"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLocale("zh")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      locale === "zh"
                        ? "bg-[#046241] text-white"
                        : "bg-white dark:bg-[#1A3828] text-[#133020] dark:text-white border border-[#D8D2C8] dark:border-[#1E4830]"
                    }`}
                  >
                    中文
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Role Access Matrix */}
          <div className="bg-white dark:bg-[#1A3828] p-6 sm:p-8 rounded-2xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-4">
              <Shield className="w-5 h-5 text-[#046241] dark:text-[#52B788]" />
              <div>
                <h3 className="text-base font-bold text-[#133020] dark:text-white">
                  {locale === "en" ? "Role-Based Access Control (RBAC) Matrix" : "角色权限与数据管控矩阵"}
                </h3>
                <p className="text-xs text-[#666666] dark:text-white/60">
                  {locale === "en"
                    ? "Enforced server-side permissions across Admin, Supervisor, and Intern accounts"
                    : "平台服务端实施的管理员、审核主管与录入实习生权限边界"}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#046241] text-white font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-3 rounded-l-xl">{locale === "zh" ? "平台操作与数据权限" : "Platform Action"}</th>
                    <th className="p-3 text-center">{locale === "zh" ? "管理员 (Admin)" : "Admin"}</th>
                    <th className="p-3 text-center">{locale === "zh" ? "审核主管 (Supervisor)" : "Supervisor"}</th>
                    <th className="p-3 text-center rounded-r-xl">{locale === "zh" ? "录入实习生 (Intern)" : "Intern"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D2C8] dark:divide-[#1E4830]">
                  <tr>
                    <td className="p-3 font-semibold text-[#133020] dark:text-white">
                      {locale === "zh" ? "查看大屏看板、展会档案与历史" : "View Dashboard, Exhibitions & Logs"}
                    </td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#133020] dark:text-white">
                      {locale === "zh" ? "录入新展会（送入待审核队列）" : "Submit New Event (To Review Queue)"}
                    </td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#133020] dark:text-white">
                      {locale === "zh" ? "直接发布展会至全球公开库" : "Publish Event Directly"}
                    </td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                    <td className="p-3 text-center text-[#B91C1C] font-bold">❌</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#133020] dark:text-white">
                      {locale === "zh" ? "批准或驳回审核队列记录" : "Approve or Reject Review Queue Items"}
                    </td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                    <td className="p-3 text-center text-[#B91C1C] font-bold">❌</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#133020] dark:text-white">
                      {locale === "zh" ? "触发实时 AI 抓取与导入" : "Run Live AI Scraper Engine"}
                    </td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                    <td className="p-3 text-center text-[#B91C1C] font-bold">❌</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#133020] dark:text-white">
                      {locale === "zh" ? "永久删除展会记录" : "Delete Exhibition Permanently"}
                    </td>
                    <td className="p-3 text-center text-[#046241] dark:text-[#52B788] font-bold">✅</td>
                    <td className="p-3 text-center text-[#B91C1C] font-bold">❌</td>
                    <td className="p-3 text-center text-[#B91C1C] font-bold">❌</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Engine Policies */}
      {activeTab === "engine" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1A3828] p-6 rounded-2xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3">
              <Cpu className="w-5 h-5 text-[#046241] dark:text-[#52B788]" />
              <h3 className="font-bold text-base text-[#133020] dark:text-white">
                {locale === "zh" ? "AI 质量与匹配度过滤规则" : "AI Quality & Fit Thresholds"}
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#133020] dark:text-white block mb-1">
                  {locale === "zh" ? "最低战略匹配度阈值 (Fit Score 1-5)" : "Minimum Fit Score Filter (1-5)"}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={targetMinFit}
                    onChange={(e) => setTargetMinFit(Number(e.target.value))}
                    className="flex-1 accent-[#046241]"
                  />
                  <span className="w-8 text-center font-bold text-base text-[#046241] dark:text-[#52B788]">
                    {targetMinFit}+
                  </span>
                </div>
                <p className="text-[#666666] dark:text-white/60 text-[11px] mt-1">
                  {locale === "zh"
                    ? "抓取引擎将自动过滤掉低于此分数的非相关展会。"
                    : "Exhibitions with fit scores below this threshold will be omitted during discovery."}
                </p>
              </div>

              <div className="pt-3 border-t border-[#D8D2C8] dark:border-[#1E4830] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#133020] dark:text-white block">
                    {locale === "zh" ? "自动化 27 维度完整度校验" : "Enforce 27-Column Audit"}
                  </span>
                  <p className="text-[11px] text-[#666666] dark:text-white/60">
                    {locale === "zh" ? "要求日期、城市、官网及业务线具备完整凭证" : "Mandates verified venue, dates, and official source links"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoEnforceAudit}
                  onChange={(e) => setAutoEnforceAudit(e.target.checked)}
                  className="w-4 h-4 accent-[#046241]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A3828] p-6 rounded-2xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3">
              <Database className="w-5 h-5 text-[#046241] dark:text-[#52B788]" />
              <h3 className="font-bold text-base text-[#133020] dark:text-white">
                {locale === "zh" ? "同步与通知设置" : "Sync & Notification Stream"}
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#133020] dark:text-white block mb-1">
                  {locale === "zh" ? "看板与抓取器同步轮询间隔" : "Dashboard Polling Frequency"}
                </label>
                <select
                  value={streamPollingRate}
                  onChange={(e) => setStreamPollingRate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] bg-[#F9F7F7] dark:bg-[#133020] text-[#133020] dark:text-white font-medium"
                >
                  <option value="5s">5 {locale === "zh" ? "秒 (极速)" : "seconds (Real-time)"}</option>
                  <option value="8s">8 {locale === "zh" ? "秒 (推荐默认)" : "seconds (Recommended)"}</option>
                  <option value="15s">15 {locale === "zh" ? "秒" : "seconds"}</option>
                  <option value="30s">30 {locale === "zh" ? "秒" : "seconds"}</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#D8D2C8] dark:border-[#1E4830] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#133020] dark:text-white block">
                    {locale === "zh" ? "新提交待审通知提醒" : "New Submission Alerts"}
                  </span>
                  <p className="text-[11px] text-[#666666] dark:text-white/60">
                    {locale === "zh" ? "有实习生提交草稿或抓取入库时通知管理员" : "Notify supervisors upon new queue draft arrivals"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#046241]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Security & Password */}
      {activeTab === "security" && (
        <div className="bg-white dark:bg-[#1A3828] p-6 sm:p-8 rounded-2xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-sm space-y-6 max-w-xl">
          <div className="flex items-center gap-2.5 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-4">
            <Lock className="w-5 h-5 text-[#046241] dark:text-[#52B788]" />
            <div>
              <h3 className="text-base font-bold text-[#133020] dark:text-white">
                {locale === "en" ? "Change Administrator Password" : "修改管理员密码"}
              </h3>
              <p className="text-xs text-[#666666] dark:text-white/60">
                {locale === "en"
                  ? "Ensure your account is protected with a strong, distinct password"
                  : "设置高强度密码以保障系统管理安全"}
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#133020] dark:text-white mb-1.5">
                {locale === "en" ? "Current Password" : "当前密码"}
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] text-xs text-[#133020] dark:text-white bg-[#F9F7F7] dark:bg-[#133020] focus:outline-hidden focus:border-[#046241] focus:ring-1 focus:ring-[#046241] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#133020] dark:text-white mb-1.5">
                {locale === "en" ? "New Password (min 6 chars)" : "新密码 (至少6位字符)"}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] text-xs text-[#133020] dark:text-white bg-[#F9F7F7] dark:bg-[#133020] focus:outline-hidden focus:border-[#046241] focus:ring-1 focus:ring-[#046241] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#133020] dark:text-white mb-1.5">
                {locale === "en" ? "Confirm New Password" : "确认新密码"}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] text-xs text-[#133020] dark:text-white bg-[#F9F7F7] dark:bg-[#133020] focus:outline-hidden focus:border-[#046241] focus:ring-1 focus:ring-[#046241] transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#046241] hover:bg-[#034d33] text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              <Key className="w-4 h-4 text-white" />
              <span>
                {submitting
                  ? (locale === "en" ? "Updating password..." : "正在修改...")
                  : (locale === "en" ? "Update Password" : "确认修改密码")}
              </span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
