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
  Loader2,
} from "lucide-react";
import { IDashboardUser, TUserRole } from "@/types";
import { toast } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserDetailsModal from "./UserDetailsModal";
import { updateUserRole, toggleUserBlock } from "@/lib/actions/users";

interface ManageUsersProps {
  users?: IDashboardUser[];
  currentUserId?: string;
}

export default function ManageUsers({ users = [], currentUserId }: ManageUsersProps) {
  const getUserId = (user: IDashboardUser) => user._id || user.id || "";

  const [userList, setUserList] = useState<IDashboardUser[]>(users);
  const [roles, setRoles] = useState<Record<string, TUserRole>>(() =>
    Object.fromEntries(users.map((user) => [getUserId(user), (user.role || "customer") as TUserRole]))
  );
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<IDashboardUser | null>(null);

  // User counts by role and status
  const totalUsersCount = userList.length;
  const customerCount = userList.filter(
    (user) => (roles[getUserId(user)] || user.role || "customer").toLowerCase() === "customer"
  ).length;
  const vendorCount = userList.filter(
    (user) => (roles[getUserId(user)] || user.role || "").toLowerCase() === "vendor"
  ).length;
  const adminCount = userList.filter(
    (user) => (roles[getUserId(user)] || user.role || "").toLowerCase() === "admin"
  ).length;
  const blockedCount = userList.filter((user) => Boolean(user.isBlocked)).length;

  // Filtered users list
  const filteredUsers = userList.filter((user) => {
    const role = (roles[getUserId(user)] || user.role || "customer").toLowerCase();
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

  // Handlers for user role and block status
  const handleRoleChange = async (user: IDashboardUser, role: TUserRole) => {
    const userId = getUserId(user);
    const previousRole = roles[userId] || (user.role as TUserRole) || "customer";
    setRoles((previousRoles) => ({ ...previousRoles, [userId]: role }));

    try {
      const updateResponse = await updateUserRole(userId, role);

      if (updateResponse?.modifiedCount > 0) {
        toast.add({
          title: "Role Updated",
          description: `Assigned ${user.name || "user"} as ${role}.`,
          type: "success",
        });
      } else {
        setRoles((previousRoles) => ({ ...previousRoles, [userId]: previousRole }));
        toast.add({
          title: "Update Failed",
          description: updateResponse?.message || "Could not update user role.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
      setRoles((previousRoles) => ({ ...previousRoles, [userId]: previousRole }));
      toast.add({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        type: "error",
      });
    }
  };

  const handleToggleBlock = async (user: IDashboardUser) => {
    const userId = getUserId(user);
    const currentRole = (roles[userId] || user.role || "customer").toLowerCase();

    if (currentRole === "admin") {
      toast.add({
        title: "Action Not Allowed",
        description: "Admin accounts cannot be blocked.",
        type: "error",
      });
      return;
    }

    const willBlock = !user.isBlocked;
    setLoadingUserId(userId);

    // Optimistically update the UI
    setUserList((previousUsers) =>
      previousUsers.map((currentUser) =>
        getUserId(currentUser) === userId ? { ...currentUser, isBlocked: willBlock } : currentUser
      )
    );

    if (selectedUser && getUserId(selectedUser) === userId) {
      setSelectedUser((previousSelected) =>
        previousSelected ? { ...previousSelected, isBlocked: willBlock } : null
      );
    }

    try {
      const response = await toggleUserBlock(userId, willBlock);

      if (response?.success) {
        toast.add({
          title: willBlock ? "User Blocked" : "User Unblocked",
          description: `${user.name || "User"} is now ${willBlock ? "blocked" : "active"}.`,
          type: "success",
        });
      } else {
        // Revert on failure
        setUserList((previousUsers) =>
          previousUsers.map((currentUser) =>
            getUserId(currentUser) === userId ? { ...currentUser, isBlocked: !willBlock } : currentUser
          )
        );
        toast.add({
          title: "Update Failed",
          description: response?.message || "Could not update user status.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
      // Revert on error
      setUserList((previousUsers) =>
        previousUsers.map((currentUser) =>
          getUserId(currentUser) === userId ? { ...currentUser, isBlocked: !willBlock } : currentUser
        )
      );
      toast.add({
        title: "Connection Error",
        description: "Failed to connect to server. Please try again.",
        type: "error",
      });
    } finally {
      setLoadingUserId(null);
    }
  };

  // Helper to format joined date
  const formatJoinedDate = (createdAt?: string | Date | null) => {
    if (!createdAt) return "Member";
    return new Date(createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Reusable avatar renderer (defines image / initials fallback once)
  const renderUserAvatar = (user: IDashboardUser, sizeClass = "h-8 w-8") => {
    const initials = (user.name || "U").slice(0, 2).toUpperCase();
    return (
      <div
        className={`relative flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone-200 bg-stone-100 font-bold text-xs text-stone-600`}
      >
        {user.image ? (
          <Image src={user.image} alt={user.name || "User"} fill sizes="40px" className="object-cover" />
        ) : (
          initials
        )}
      </div>
    );
  };

  // Reusable UI helpers for role badge, status badge, and action buttons
  const getRoleBadge = (user: IDashboardUser) => {
    const role = (roles[getUserId(user)] || user.role || "customer").toLowerCase();
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

  // Role Dropdown Selector
  const renderRoleButtons = (user: IDashboardUser) => {
    const userId = getUserId(user);
    const currentRole = (roles[userId] || user.role || "customer").toLowerCase() as TUserRole;
    const isCurrentUser = Boolean(currentUserId && userId === currentUserId);

    return (
      <Select
        value={currentRole}
        disabled={isCurrentUser}
        onValueChange={(newRole) => {
          if (newRole && newRole !== currentRole) {
            handleRoleChange(user, newRole as TUserRole);
          }
        }}
      >
        <SelectTrigger
          title={isCurrentUser ? "You cannot change your own role" : "Change user role"}
          className="h-8 w-32 rounded-lg border border-stone-200 bg-white px-2.5 text-xs capitalize text-stone-700 shadow-2xs hover:border-stone-300 focus-visible:border-[#844353] focus-visible:ring-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-stone-200 bg-white p-1 shadow-lg min-w-32">
          <SelectItem
            value="customer"
            className="rounded-lg px-2.5 py-1.5 text-xs text-stone-700 cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353]"
          >
            Customer
          </SelectItem>
          <SelectItem
            value="vendor"
            className="rounded-lg px-2.5 py-1.5 text-xs text-stone-700 cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353]"
          >
            Vendor
          </SelectItem>
          <SelectItem
            value="admin"
            className="rounded-lg px-2.5 py-1.5 text-xs text-stone-700 cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353]"
          >
            Admin
          </SelectItem>
        </SelectContent>
      </Select>
    );
  };

  const renderActionButtons = (user: IDashboardUser) => {
    const userId = getUserId(user);
    const isBlocked = Boolean(user.isBlocked);
    const userRole = (roles[userId] || user.role || "customer").toLowerCase();
    const isAdmin = userRole === "admin";
    const isSaving = loadingUserId === userId;

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
            disabled={isSaving}
            onClick={() => handleToggleBlock(user)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition cursor-pointer shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed ${
              isBlocked
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isBlocked ? (
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
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/80 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#844353] whitespace-nowrap shrink-0 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
            Admin Center • User Management
          </span>
        </div>
        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 tracking-tight pt-0.5">
          Manage Users
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm text-stone-500">
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

          <Select
            value={statusFilter}
            onValueChange={(val) => {
              if (val) setStatusFilter(val);
            }}
          >
            <SelectTrigger className="w-full sm:w-44 h-9 rounded-xl border border-stone-200 bg-white px-3 text-xs text-stone-700 shadow-2xs hover:border-stone-300 focus-visible:border-[#844353] focus-visible:ring-0 cursor-pointer">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-stone-200 bg-white p-1 shadow-lg min-w-44">
              <SelectItem
                value="all"
                className="rounded-lg px-2.5 py-1.5 text-xs text-stone-700 cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353] focus:bg-[#FAF6F7] focus:text-[#844353]"
              >
                All Statuses
              </SelectItem>
              <SelectItem
                value="active"
                className="rounded-lg px-2.5 py-1.5 text-xs text-stone-700 cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353] focus:bg-[#FAF6F7] focus:text-[#844353]"
              >
                Active Accounts
              </SelectItem>
              <SelectItem
                value="blocked"
                className="rounded-lg px-2.5 py-1.5 text-xs text-stone-700 cursor-pointer hover:bg-[#FAF6F7] hover:text-[#844353] focus:bg-[#FAF6F7] focus:text-[#844353]"
              >
                Blocked Accounts
              </SelectItem>
            </SelectContent>
          </Select>
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
              const joinedDate = formatJoinedDate(user.createdAt);

              return (
                <div key={getUserId(user) || user.email} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {renderUserAvatar(user, "h-10 w-10")}
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

          {/* Desktop Users Table (>= lg) */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs">
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
                    const joinedDate = formatJoinedDate(user.createdAt);

                    return (
                      <tr key={getUserId(user) || user.email} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 pl-4 pr-3">
                          <div className="flex items-center gap-2.5">
                            {renderUserAvatar(user, "h-8 w-8")}
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
          <div className="lg:hidden text-center text-xs text-stone-500 py-1">
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