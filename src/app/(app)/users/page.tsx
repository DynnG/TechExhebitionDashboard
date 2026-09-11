"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ModalPortal } from "@/components/shared/modal-portal";
import { DeleteEventModal } from "@/components/events/delete-event-modal";
import { Users, UserPlus, Shield, Trash2, Edit, Loader2, Check, X, Key, Search, Sparkles, Lock, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";
import { LifewoodDropdown } from "@/components/shared/lifewood-dropdown";

export default function UsersPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "USER";
  const { locale } = useLocaleStore();

  const roleOptionsTable = [
    { value: "SUPERADMIN", label: locale === "zh" ? "超级管理员 (SUPERADMIN)" : "SUPERADMIN" },
    { value: "ADMIN", label: locale === "zh" ? "管理员 (ADMIN)" : "ADMIN" },
    { value: "USER", label: locale === "zh" ? "普通用户 (USER)" : "USER" },
  ];

  const roleOptionsModal = [
    { value: "USER", label: locale === "zh" ? "普通用户 (仅录入与查看)" : "USER (Submit & View Only)" },
    { value: "ADMIN", label: locale === "zh" ? "管理员 (审核与管理)" : "ADMIN (Approve & Manage)" },
    { value: "SUPERADMIN", label: locale === "zh" ? "超级管理员 (全部权限)" : "SUPERADMIN (Full Control)" },
  ];

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<any | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [resetting, setResetting] = useState(false);
  const [deletingUser, setDeletingUser] = useState<{ id: number; name: string } | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        toast.error(data.error || (locale === "zh" ? "获取用户列表失败" : "Failed to fetch users"));
      }
    } catch {
      toast.error(locale === "zh" ? "加载系统用户列表出错" : "Error loading user administration list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error(locale === "zh" ? "请填写所有必填字段" : "Please complete all required fields");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          locale === "zh"
            ? `用户 "${formData.name}" 已成功创建！`
            : `User "${formData.name}" created successfully!`
        );
        setShowAddModal(false);
        setFormData({ name: "", email: "", password: "", role: "USER" });
        fetchUsers();
      } else {
        toast.error(data.error || (locale === "zh" ? "创建用户失败" : "Failed to create user"));
      }
    } catch {
      toast.error(locale === "zh" ? "创建用户账户出错" : "Error creating user account");
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(locale === "zh" ? "用户角色已成功更新！" : "User role updated successfully!");
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(data.error || (locale === "zh" ? "更新角色失败" : "Failed to update role"));
      }
    } catch {
      toast.error(locale === "zh" ? "更新用户角色出错" : "Error updating user role");
    }
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    setDeletingUser({ id: userId, name: userName });
  };

  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeletingUser(true);
    try {
      const res = await fetch(`/api/users/${deletingUser.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success(locale === "zh" ? `用户 "${deletingUser.name}" 已删除。` : `User "${deletingUser.name}" deleted.`);
        setDeletingUser(null);
        fetchUsers();
      } else {
        toast.error(data.error || (locale === "zh" ? "删除用户失败" : "Failed to delete user"));
      }
    } catch {
      toast.error(locale === "zh" ? "删除用户账户出错" : "Error deleting user account");
    } finally {
      setIsDeletingUser(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser || !newPasswordValue) return;
    if (newPasswordValue.length < 6) {
      toast.error(locale === "zh" ? "密码长度至少为 6 个字符" : "Password must be at least 6 characters long");
      return;
    }

    setResetting(true);
    try {
      const res = await fetch(`/api/users/${resetPasswordUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPasswordValue }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          locale === "zh"
            ? `已为 "${resetPasswordUser.name}" 成功更新密码！`
            : `Password updated for "${resetPasswordUser.name}"!`
        );
        setResetPasswordUser(null);
        setNewPasswordValue("");
      } else {
        toast.error(data.error || (locale === "zh" ? "更新密码失败" : "Failed to update password"));
      }
    } catch {
      toast.error(locale === "zh" ? "更新用户密码出错" : "Error updating user password");
    } finally {
      setResetting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const superadminCount = users.filter((u) => u.role === "SUPERADMIN").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount = users.filter((u) => u.role === "USER").length;

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-[#FFB347] text-[#133020] font-extrabold";
      case "ADMIN":
        return "bg-[#046241] text-white font-extrabold";
      default:
        return "bg-[#708E7C] text-white font-semibold";
    }
  };

  return (
    <div className="space-y-6 font-manrope">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#046241]/10 dark:bg-[#046241]/25 border border-[#046241]/30 flex items-center justify-center text-[#046241] dark:text-[#52B788]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#133020] dark:text-white">
                {locale === "en" ? "User Management & RBAC Governance" : "用户管理与权限控制"}
                </h2>
              <p className="text-xs text-black dark:text-white/60 mt-0.5">
                {locale === "zh"
                  ? "管理系统账号、基于角色的访问权限 (RBAC) 与安全凭证"
                  : "Administer platform accounts, role-based access controls, and security credentials"}
              </p>
            </div>
          </div>
        </div>

        {userRole === "SUPERADMIN" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{locale === "en" ? "Create New Account" : "创建新账号"}</span>
          </button>
        )}
      </div>

      {/* Role Summary Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#D8D2C8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block">
              {locale === "zh" ? "总用户数" : "Total Users"}
            </span>
            <span className="text-2xl font-extrabold text-[#133020]">{users.length}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#133020]/10 flex items-center justify-center text-[#133020]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#D8D2C8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block">
              {locale === "zh" ? "超级管理员" : "Superadmins"}
            </span>
            <span className="text-2xl font-extrabold text-[#133020]">{superadminCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FFB347]/20 flex items-center justify-center text-[#133020]">
            <Shield className="w-5 h-5 text-[#C17110]" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#D8D2C8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block">
              {locale === "zh" ? "管理员" : "Admins"}
            </span>
            <span className="text-2xl font-extrabold text-[#133020]">{adminCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#046241]/10 flex items-center justify-center text-[#046241]">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#D8D2C8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block">
              {locale === "zh" ? "普通用户" : "Users"}
            </span>
            <span className="text-2xl font-extrabold text-[#133020]">{userCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#708E7C]/15 flex items-center justify-center text-[#708E7C]">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-[#D8D2C8]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#999999] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={locale === "zh" ? "按姓名、邮箱或角色搜索账号..." : "Search accounts by name, email, or role..."}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D8D2C8] bg-[#F9F7F7] text-xs text-[#133020] placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:bg-white transition"
          />
        </div>
        <span className="text-xs font-semibold text-[#666666]">
          {locale === "zh" ? `显示 ${filteredUsers.length} 个账号` : `Showing ${filteredUsers.length} accounts`}
        </span>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#046241]">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <span className="text-xs font-semibold text-[#133020]">
            {locale === "zh" ? "正在加载系统账号列表..." : "Loading registered system accounts..."}
          </span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#D8D2C8] shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#133020] text-white font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 px-4">{locale === "zh" ? "用户" : "User"}</th>
                <th className="p-3.5 px-4">{locale === "zh" ? "电子邮箱" : "Email Address"}</th>
                <th className="p-3.5 px-4">{locale === "zh" ? "分配角色" : "Assigned Role"}</th>
                <th className="p-3.5 px-4">{locale === "zh" ? "加入日期" : "Joined Date"}</th>
                <th className="p-3.5 px-4 text-right">{locale === "zh" ? "操作" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2C8]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#F9F7F7] transition">
                  <td className="p-3.5 px-4 font-bold text-[#133020]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#046241] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-[#133020]">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 px-4 text-[#666666] font-medium">{u.email}</td>
                  <td className="p-3.5 px-4">
                    {editingUser?.id === u.id ? (
                      <LifewoodDropdown
                        variant="compact"
                        value={editingUser.role}
                        onChange={(val) => setEditingUser({ ...editingUser, role: val })}
                        options={roleOptionsTable}
                        aria-label="Edit User Role"
                      />
                    ) : (
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase ${getRoleBadgeStyle(u.role)}`}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 px-4 text-[#666666]">
                    {new Date(u.createdAt).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US")}
                  </td>
                  <td className="p-3.5 px-4 text-right">
                    {userRole === "SUPERADMIN" ? (
                      <div className="flex items-center justify-end gap-2">
                        {editingUser?.id === u.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateRole(u.id, editingUser.role)}
                              className="p-1.5 bg-[#046241] text-white rounded-lg hover:bg-[#133020] transition cursor-pointer"
                              title={locale === "zh" ? "保存角色" : "Save Role"}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="p-1.5 bg-gray-200 text-[#133020] rounded-lg hover:bg-gray-300 transition cursor-pointer"
                              title={locale === "zh" ? "取消" : "Cancel"}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingUser(u)}
                              className="px-2.5 py-1 text-[#046241] bg-[#046241]/10 hover:bg-[#046241]/20 rounded-lg transition font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              title={locale === "zh" ? "修改角色" : "Change Role"}
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>{locale === "zh" ? "角色" : "Role"}</span>
                            </button>

                            <button
                              onClick={() => {
                                setResetPasswordUser(u);
                                setNewPasswordValue("");
                              }}
                              className="px-2.5 py-1 text-[#C17110] bg-[#FFB347]/15 hover:bg-[#FFB347]/30 rounded-lg transition font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              title={locale === "zh" ? "重置密码" : "Reset Password"}
                            >
                              <Key className="w-3.5 h-3.5" />
                              <span>{locale === "zh" ? "密码" : "Password"}</span>
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-[#B91C1C] hover:bg-[#B91C1C]/10 rounded-lg transition font-medium cursor-pointer"
                          title={locale === "zh" ? "删除用户" : "Delete User"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#666666] italic">{locale === "zh" ? "仅查看" : "View Only"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      <ModalPortal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-[#133020] text-white p-5 px-7 flex items-center justify-between shrink-0 border-b border-white/10 font-manrope">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFB347] text-[#133020] flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {locale === "en" ? "Register New Account" : "注册新用户账号"}
              </h3>
              <p className="text-[10px] text-[#F5EEDB]/70 uppercase tracking-wider">
                {locale === "zh" ? "系统账号预配与分配" : "System Account Provisioning"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(false)}
            className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transform hover:rotate-90 transition duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 bg-white font-manrope space-y-4">
          <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#133020] uppercase tracking-wider mb-1">
                {locale === "zh" ? "用户姓名" : "Full Name"}
              </label>
              <input
                type="text"
                required
                placeholder={locale === "zh" ? "例如：Alex Wong" : "e.g. Alex Wong"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl text-xs bg-[#F9F7F7] focus:bg-white focus:outline-none focus:border-[#046241]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#133020] uppercase tracking-wider mb-1">
                {locale === "zh" ? "电子邮箱" : "Email Address"}
              </label>
              <input
                type="email"
                required
                placeholder="alex@lifewood.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl text-xs bg-[#F9F7F7] focus:bg-white focus:outline-none focus:border-[#046241]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#133020] uppercase tracking-wider mb-1">
                {locale === "zh" ? "初始密码" : "Password"}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl text-xs bg-[#F9F7F7] focus:bg-white focus:outline-none focus:border-[#046241]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#133020] uppercase tracking-wider mb-1">
                {locale === "zh" ? "系统角色" : "System Role"}
              </label>
              <LifewoodDropdown
                value={formData.role}
                onChange={(val) => setFormData({ ...formData, role: val })}
                options={roleOptionsModal}
                aria-label="System Role"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-[#D8D2C8] rounded-xl text-xs text-[#666666] font-bold hover:bg-[#F9F7F7]"
              >
                {locale === "zh" ? "取消" : "Cancel"}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-bold text-xs rounded-xl transition shadow-sm"
              >
                {locale === "zh" ? "创建账号" : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </ModalPortal>

      {/* Reset Password Modal */}
      <ModalPortal isOpen={!!resetPasswordUser} onClose={() => setResetPasswordUser(null)}>
        <div className="bg-[#133020] text-white p-5 px-7 flex items-center justify-between shrink-0 border-b border-white/10 font-manrope">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFB347] text-[#133020] flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {locale === "zh" ? "重置账号密码" : "Reset Account Password"}
              </h3>
              <p className="text-[10px] text-[#F5EEDB]/70 uppercase tracking-wider">
                {resetPasswordUser?.name} ({resetPasswordUser?.email})
              </p>
            </div>
          </div>
          <button
            onClick={() => setResetPasswordUser(null)}
            className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transform hover:rotate-90 transition duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 bg-white font-manrope space-y-4">
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#133020] uppercase tracking-wider mb-1.5">
                {locale === "zh" ? "新安全密码" : "New Security Password"}
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder={locale === "zh" ? "输入至少 6 位字符" : "Enter at least 6 characters"}
                value={newPasswordValue}
                onChange={(e) => setNewPasswordValue(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl text-xs bg-[#F9F7F7] text-[#133020] focus:bg-white focus:outline-none focus:border-[#046241]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetPasswordUser(null)}
                className="px-4 py-2 border border-[#D8D2C8] rounded-xl text-xs text-[#666666] font-bold hover:bg-[#F9F7F7]"
              >
                {locale === "zh" ? "取消" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={resetting}
                className="px-5 py-2.5 bg-[#133020] hover:bg-[#046241] text-white font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-50"
              >
                {resetting
                  ? locale === "zh" ? "正在更新密码..." : "Updating Password..."
                  : locale === "zh" ? "设置新密码" : "Set New Password"}
              </button>
            </div>
          </form>
        </div>
      </ModalPortal>

      {/* Delete User Modal */}
      <DeleteEventModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDeleteUser}
        title={locale === "zh" ? "确认删除用户" : "Confirm Delete User"}
        eventName={deletingUser?.name}
        description={
          locale === "zh"
            ? "此操作不可逆。该用户账户将被从系统中永久删除。"
            : "This action cannot be undone. This user account will be permanently removed from the system."
        }
        isDeleting={isDeletingUser}
      />
    </div>
  );
}
