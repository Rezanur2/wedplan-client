"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Users,
  Heart,
  Store,
  ShieldCheck,
  Search,
  Eye,
  Ban,
  CheckCircle2,
  SearchX,
  X,
  RotateCcw,
  Crown,
} from "lucide-react";
import { IDashboardUser, TUserRole } from "@/types";
import { toast } from "@/components/ui/toast";
import UserDetailsModal from "./UserDetailsModal";
import { updateUserRole } from "@/lib/actions/users";

interface ManageUsersProps {
  users?: IDashboardUser[];
}

export default function ManageUsers({ users = [] }: ManageUsersProps) {
  const [roles, setRoles] = useState<Record<string, TUserRole>>(() =>
    Object.fromEntries(users.map((user) => [user._id || user.id || "", (user.role || "customer") as TUserRole]))
  );
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<IDashboardUser | null>(null);

  // User counts by role and status
  const totalUsersCount = users.length;
  const customerCount = users.filter(
    (user) => (user.role || "customer").toLowerCase() === "customer"
  ).length;
  const vendorCount = users.filter(
    (user) => (user.role || "").toLowerCase() === "vendor"
  ).length;
  const adminCount = users.filter(
    (user) => (user.role || "").toLowerCase() === "admin"
  ).length;
  const blockedCount = users.filter((user) => Boolean(user.isBlocked)).length;

  // Filtered users list
  const filteredUsers = users.filter((user) => {
    const role = (user.role || "customer").toLowerCase();
    const isBlocked = Boolean(user.isBlocked);
    const searchQuery = search.toLowerCase().trim();

    if (
      searchQuery &&
      !(
        user.name?.toLowerCase().includes(searchQuery) ||
        user.email?.toLowerCase().includes(searchQuery)
      )
    ) {
      return false;
    }
    if (activeTab === "customer" && role !== "customer") return false;
    if (activeTab === "vendor" && role !== "vendor") return false;
    if (activeTab === "admin" && role !== "admin") return false;
    if (activeTab === "blocked" && !isBlocked) return false;

    if (statusFilter === "active" && isBlocked) return false;
    if (statusFilter === "blocked" && !isBlocked) return false;

    return true;
  });

  // Handlers for user to connect backend logic later
  const handleRoleChange = async (user: IDashboardUser, role: TUserRole) => {
    const userId = user._id || user.id || "";
    setRoles((prev) => ({ ...prev, [userId]: role }));
    const res = await updateUserRole(userId, role);

    if (res?.modifiedCount > 0) {
      toast.add({
        title: "Role Change Event",
        description: `Assigned ${user.name || "user"} as ${role}.`,
        type: "info",
      });
    }
  };

  const handleToggleBlock = (user: IDashboardUser) => {
    const currentRole = (roles[user._id || user.id || ""] || user.role || "customer").toLowerCase();
    if (currentRole === "admin") {
      toast.add({
        title: "Action Not Allowed",
        description: "Admin accounts cannot be blocked.",
        type: "error",
      });
      return;
    }

    const willBlock = !user.isBlocked;
    toast.add({
      title: willBlock ? "Block User Event" : "Unblock User Event",
      description: `${willBlock ? "Blocking" : "Unblocking"} ${user.name || "user"}. (Ready for logic)`,
      type: "info",
    });
  };

  // Reusable UI helpers for role badge, status badge, and action buttons
  const getRoleBadge = (user: IDashboardUser) => {
    const role = (roles[user._id || user.id || ""] || user.role || "customer").toLowerCase();
    const badgeColor =
      role === "admin"
        ? "bg-purple-50 text-purple-700 border-purple-200"
        : role === "vendor"
        ? "bg-rose-50 text-[#844353] border-rose-200"
        : "bg-sky-50 text-sky-700 border-sky-200";

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border capitalize ${badgeColor}`}
      >
        {role === "admin" ? <Crown className="h-3 w-3" /> : role === "vendor" ? <Store className="h-3 w-3" /> : <Heart className="h-3 w-3" />}
        <span>{role}</span>
      </span>
    );
  };

  const getStatusBadge = (isBlocked: boolean) => (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
        isBlocked ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isBlocked ? "bg-rose-500" : "bg-emerald-500"}`} />
      {isBlocked ? "Blocked" : "Active"}
    </span>
  );

  // Role Render Button 
  const renderRoleButtons = (user: IDashboardUser) => {
    const currentRole = roles[user._id || user.id || ""] || user.role || "customer";
    const role = currentRole.toLowerCase();
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {role !== "admin" && (
          <button
            type="button"
            onClick={() => handleRoleChange(user, "admin")}
            className="rounded-lg border border-purple-200 bg-purple-50/70 px-2 py-0.5 text-[10px] font-medium text-purple-700 hover:bg-purple-100 transition cursor-pointer"
          >
            Make Admin
          </button>
        )}
        {role !== "vendor" && (
          <button
            type="button"
            onClick={() => handleRoleChange(user, "vendor")}
            className="rounded-lg border border-rose-200 bg-rose-50/70 px-2 py-0.5 text-[10px] font-medium text-[#844353] hover:bg-rose-100 transition cursor-pointer"
          >
            Make Vendor
          </button>
        )}
        {role !== "customer" && (
          <button
            type="button"
            onClick={() => handleRoleChange(user, "customer")}
            className="rounded-lg border border-sky-200 bg-sky-50/70 px-2 py-0.5 text-[10px] font-medium text-sky-700 hover:bg-sky-100 transition cursor-pointer"
          >
            Make Customer
          </button>
        )}
      </div>
    );
  };

  const renderActionButtons = (user: IDashboardUser) => {
    const isBlocked = Boolean(user.isBlocked);
    const userRole = (roles[user._id || user.id || ""] || user.role || "customer").toLowerCase();
    const isAdmin = userRole === "admin";

    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedUser(user)}
          className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer shadow-2xs transition"
        >
          <Eye className="h-3 w-3 text-stone-500" />
          <span>View</span>
        </button>

        {!isAdmin && (
          <button
            type="button"
            onClick={() => handleToggleBlock(user)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition cursor-pointer shadow-2xs ${
              isBlocked
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            {isBlocked ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                <span>Unblock</span>
              </>
            ) : (
              <>
                <Ban className="h-3 w-3" />
                <span>Block</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  const stats = [
    { id: "all", label: "Total Users", count: totalUsersCount, icon: Users, color: "text-stone-700 bg-stone-100" },
    { id: "customer", label: "Customers", count: customerCount, icon: Heart, color: "text-[#844353] bg-rose-50" },
    { id: "vendor", label: "Vendors", count: vendorCount, icon: Store, color: "text-amber-700 bg-amber-50" },
    { id: "admin", label: "Admins", count: adminCount, icon: ShieldCheck, color: "text-emerald-700 bg-emerald-50" },
  ];

  const tabs = [
    { id: "all", label: "All Users", count: totalUsersCount },
    { id: "customer", label: "Customers", count: customerCount },
    { id: "vendor", label: "Vendors", count: vendorCount },
    { id: "admin", label: "Admins", count: adminCount },
    { id: "blocked", label: "Blocked", count: blockedCount },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-16">
      {/* 1. Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          ADMIN / USERS & ACCOUNTS
        </div>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900">Manage Users</h1>
        <p className="mt-1 text-xs text-stone-500">
          View, search, and manage couples, vendors, and admins across WedPlan.
        </p>
      </div>

      {/* 2. Top Stats Cards (Click to Filter) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((statItem) => {
          const Icon = statItem.icon;
          const isSelected = activeTab === statItem.id;
          return (
            <button
              key={statItem.id}
              type="button"
              onClick={() => setActiveTab(statItem.id)}
              className={`rounded-2xl border p-3.5 sm:p-4 text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-[#844353] bg-rose-50/20 shadow-xs ring-1 ring-[#844353]/30"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  {statItem.label}
                </span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${statItem.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {statItem.count}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Filter Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-stone-100 p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-stone-900 shadow-2xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>{tab.label}</span>
              <span className="rounded-full bg-stone-200/70 px-1.5 py-0.2 text-[10px] text-stone-600">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-stone-200 bg-white pl-9.5 pr-8 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#844353] focus:outline-none shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700 shadow-2xs cursor-pointer focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="blocked">Blocked Accounts</option>
          </select>
        </div>
      </div>

      {/* 4. Users Display (Mobile Cards & Desktop Table) */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center shadow-2xs">
          <SearchX className="mx-auto h-8 w-8 text-stone-400 mb-2" />
          <h3 className="font-serif text-base font-semibold text-stone-900">No users found</h3>
          <p className="mt-1 text-xs text-stone-500">No user accounts match your search criteria.</p>
          {(search || activeTab !== "all" || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveTab("all");
                setStatusFilter("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer transition shadow-2xs"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear all filters</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile User Cards (< lg) */}
          <div className="grid grid-cols-1 gap-3 lg:hidden">
            {filteredUsers.map((user) => {
              const initials = (user.name || "U").slice(0, 2).toUpperCase();
              const joinedDate = user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "Member";

              return (
                <div key={user.id || user._id || user.email} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone-200 bg-stone-100 font-bold text-xs text-stone-600">
                        {user.image ? <Image src={user.image} alt={user.name || "User"} fill className="object-cover" /> : initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-stone-900 text-sm truncate">{user.name || "Unnamed"}</h4>
                        <p className="text-xs text-stone-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(Boolean(user.isBlocked))}
                  </div>

                  <div className="flex items-center justify-between border-y border-stone-100 py-2 text-xs">
                    {getRoleBadge(user)}
                    <span className="text-[11px] text-stone-400">Joined {joinedDate}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Assign Role</span>
                    {renderRoleButtons(user)}
                  </div>

                  <div className="flex items-center justify-end pt-1 border-t border-stone-100">
                    {renderActionButtons(user)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Users Table (>= md) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-180 text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    <th className="py-3.5 pl-4 pr-3 font-semibold">User</th>
                    <th className="py-3.5 px-3 font-semibold">Email</th>
                    <th className="py-3.5 px-3 font-semibold">Role</th>
                    <th className="py-3.5 px-3 font-semibold">Status</th>
                    <th className="py-3.5 px-3 font-semibold">Joined</th>
                    <th className="py-3.5 px-3 font-semibold">Assign Role</th>
                    <th className="py-3.5 pl-3 pr-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.map((user) => {
                    const initials = (user.name || "U").slice(0, 2).toUpperCase();
                    const joinedDate = user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "Member";

                    return (
                      <tr key={user.id || user._id || user.email} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 pl-4 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone-200 bg-stone-100 font-bold text-xs text-stone-600">
                              {user.image ? <Image src={user.image} alt={user.name || "User"} fill className="object-cover" /> : initials}
                            </div>
                            <span className="font-semibold text-stone-900 truncate max-w-37.5">{user.name || "Unnamed"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-stone-600 truncate max-w-45">{user.email}</td>
                        <td className="py-3 px-3">{getRoleBadge(user)}</td>
                        <td className="py-3 px-3">{getStatusBadge(Boolean(user.isBlocked))}</td>
                        <td className="py-3 px-3 text-stone-500 text-[11px] whitespace-nowrap">{joinedDate}</td>
                        <td className="py-3 px-3">{renderRoleButtons(user)}</td>
                        <td className="py-3 pl-3 pr-4 text-right">{renderActionButtons(user)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-stone-100 px-4 py-2.5 text-xs text-stone-500">
              Total <strong>{filteredUsers.length}</strong> user(s) displayed
            </div>
          </div>

          {/* Mobile Count Footer */}
          <div className="md:hidden text-center text-xs text-stone-500 py-1">
            Total <strong>{filteredUsers.length}</strong> user(s) displayed
          </div>
        </div>
      )}

      {/* 5. View User Details Modal */}
      <UserDetailsModal
        selectedUser={selectedUser}
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}