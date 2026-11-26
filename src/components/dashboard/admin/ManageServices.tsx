"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Download, Search, X, Check, Layers, AlertTriangle, Loader2 } from "lucide-react";
import { IVendorService } from "@/types";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import ServiceDetailsModal from "./ServiceDetailsModal";
import { updateService, deleteService } from "@/lib/actions/services";

const FALLBACK_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80";

interface ManageServicesProps {
  initialServices?: IVendorService[];
}

export default function ManageServices({ initialServices = [] }: ManageServicesProps) {
  // Real data state from database
  const [serviceList, setServiceList] = useState<IVendorService[]>(initialServices);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedService, setSelectedService] = useState<IVendorService | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<IVendorService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Derived counts for metrics and category pills
  const pendingServices = useMemo(() => {
    return serviceList.filter(
      (serviceItem) => (serviceItem.status || "Pending").toLowerCase() === "pending"
    );
  }, [serviceList]);

  const activeCount = useMemo(() => {
    return serviceList.filter((serviceItem) => {
      const status = (serviceItem.status || "").toLowerCase();
      return status === "active" || status === "approved";
    }).length;
  }, [serviceList]);

  const pausedCount = useMemo(() => {
    return serviceList.filter(
      (serviceItem) => (serviceItem.status || "").toLowerCase() === "paused"
    ).length;
  }, [serviceList]);

  const categoryCounts = useMemo(() => {
    const countsMap: Record<string, number> = {};
    serviceList.forEach((serviceItem) => {
      const categoryName = serviceItem.category || "Other";
      countsMap[categoryName] = (countsMap[categoryName] || 0) + 1;
    });
    return countsMap;
  }, [serviceList]);

  const availableCategories = useMemo(() => Object.keys(categoryCounts), [categoryCounts]);

  // Filtered services for the table and mobile cards
  const filteredServices = useMemo(() => {
    return serviceList.filter((serviceItem) => {
      const cleanSearch = searchQuery.toLowerCase().trim();
      const name = (serviceItem.serviceName || "").toLowerCase();
      const vendor = (serviceItem.businessName || serviceItem.vendorName || "").toLowerCase();
      const location = (serviceItem.location || "").toLowerCase();
      const category = (serviceItem.category || "").toLowerCase();
      const status = (serviceItem.status || "pending").toLowerCase();

      if (cleanSearch && !`${name} ${vendor} ${location} ${category}`.includes(cleanSearch)) {
        return false;
      }
      if (selectedCategory !== "all" && category !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (statusFilter !== "all") {
        if (statusFilter === "active") {
          if (status !== "active" && status !== "approved") return false;
        } else if (status !== statusFilter.toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }, [serviceList, searchQuery, selectedCategory, statusFilter]);

  // Status badge helper renderer
  const renderStatusBadge = (statusName?: string) => {
    const status = (statusName || "pending").toLowerCase();
    const styleMap: Record<string, { bg: string; dot: string; label: string }> = {
      active: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", label: "Active" },
      approved: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", label: "Active" },
      rejected: { bg: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500", label: "Rejected" },
      paused: { bg: "bg-amber-50 text-amber-800 border-amber-200", dot: "bg-amber-500", label: "Paused" },
    };
    const currentStyle = styleMap[status] || {
      bg: "bg-stone-100 text-stone-700 border-stone-200",
      dot: "bg-amber-500 animate-pulse",
      label: "Pending",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${currentStyle.bg}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${currentStyle.dot}`} />
        <span>{currentStyle.label}</span>
      </span>
    );
  };

  const getServiceId = (serviceItem: IVendorService) =>
    serviceItem._id || serviceItem.id || "";

  // Reusable actions renderer (used in both desktop table and mobile cards)
  const renderServiceActions = (serviceItem: IVendorService) => {
    const serviceId = getServiceId(serviceItem);
    const rawStatus = (serviceItem.status || "").toLowerCase();
    const isServiceActive = rawStatus === "active" || rawStatus === "approved";

    return (
      <div className="inline-flex items-center gap-3 text-xs">
        <button
          type="button"
          onClick={() => {
            setSelectedService(serviceItem);
            setIsDetailsModalOpen(true);
          }}
          className="font-medium text-stone-600 hover:text-stone-900 transition cursor-pointer"
        >
          Review
        </button>
        <button
          type="button"
          onClick={() => handleStatusChange(serviceId, isServiceActive ? "Paused" : "Active")}
          className={`font-medium transition cursor-pointer ${
            isServiceActive ? "text-amber-700 hover:text-amber-800" : "text-emerald-700 hover:text-emerald-800"
          }`}
        >
          {isServiceActive ? "Pause" : "Activate"}
        </button>
        <button
          type="button"
          onClick={() => setServiceToDelete(serviceItem)}
          className="font-medium text-rose-600 hover:text-rose-700 transition cursor-pointer"
        >
          Delete
        </button>
      </div>
    );
  };

  // Delete inappropriate service handler
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    const serviceId = getServiceId(serviceToDelete);
    const serviceName = serviceToDelete.serviceName || "Service";

    setIsDeleting(true);
    try {
      const response = await deleteService(serviceId);
      if (response?.deletedCount) {
        setServiceList((previousServices) =>
          previousServices.filter((serviceItem) => getServiceId(serviceItem) !== serviceId)
        );
        toast.add({
          title: "Service Deleted",
          description: `"${serviceName}" has been removed from the platform.`,
          type: "info",
        });
        setServiceToDelete(null);
      } else {
        toast.add({
          title: "Delete Failed",
          description: "Could not delete this service. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.add({
        title: "Delete Failed",
        description: "Could not delete this service. Please try again.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Status change handler
  const handleStatusChange = async (serviceId: string, newStatus: string) => {
    try {
      const response = await updateService(serviceId, { status: newStatus });

      if (response?.modifiedCount > 0 || response?.acknowledged) {
        setServiceList((previousServices) =>
          previousServices.map((serviceItem) =>
            getServiceId(serviceItem) === serviceId
              ? { ...serviceItem, status: newStatus }
              : serviceItem
          )
        );
        toast.add({
          title: "Success",
          description: `Service status updated to ${newStatus}`,
          type: "success",
        });
      } else {
        toast.add({
          title: "Update Failed",
          description: "Could not update service status.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to update status on server:", error);
      toast.add({
        title: "Update Failed",
        description: "Failed to connect to server. Please try again.",
        type: "error",
      });
    }
  };

  // Export CSV handler
  const handleExportCSV = () => {
    if (serviceList.length === 0) {
      toast.add({
        title: "No Data",
        description: "There are no services in the catalog to export.",
        type: "error",
      });
      return;
    }

    const csvHeader = "Service Name,Category,Price,Status,Location,Vendor\n";
    const csvRows = serviceList.map((serviceItem) => {
      const name = `"${(serviceItem.serviceName || "").replace(/"/g, '""')}"`;
      const category = `"${serviceItem.category || ""}"`;
      const price = serviceItem.price || 0;
      const status = serviceItem.status || "Pending";
      const location = `"${(serviceItem.location || "").replace(/"/g, '""')}"`;
      const vendor = `"${(serviceItem.businessName || serviceItem.vendorName || "").replace(/"/g, '""')}"`;
      return `${name},${category},${price},${status},${location},${vendor}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvHeader + csvRows.join("\n");
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", encodeURI(csvContent));
    downloadLink.setAttribute("download", "wedplan_services_catalog.csv");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    toast.add({
      title: "Success",
      description: "Services catalog exported as CSV",
      type: "success",
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/80 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#844353] whitespace-nowrap shrink-0 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#844353]" />
              Admin Center • Services Catalog
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 tracking-tight pt-0.5">
            Manage Services
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-stone-500">
            Review pending vendor submissions and manage live wedding services.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 shadow-2xs transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-stone-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Summary Stats Cards (4 Responsive Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Pending */}
        <div
          onClick={() => {
            setStatusFilter("pending");
            setSelectedCategory("all");
          }}
          className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition shadow-2xs ${
            statusFilter === "pending"
              ? "border-rose-400 bg-rose-50/40 ring-1 ring-rose-300"
              : "border-stone-200 bg-white hover:border-stone-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              Pending
            </span>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-[#844353] border border-rose-100">
              {pendingServices.length} items
            </span>
          </div>
          <p className="mt-2 sm:mt-3 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {pendingServices.length}
          </p>
          <p className="mt-0.5 sm:mt-1 text-[11px] text-stone-500 truncate">Requires action</p>
        </div>

        {/* Card 2: Active */}
        <div
          onClick={() => {
            setStatusFilter("active");
            setSelectedCategory("all");
          }}
          className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition shadow-2xs ${
            statusFilter === "active"
              ? "border-emerald-400 bg-emerald-50/40 ring-1 ring-emerald-300"
              : "border-stone-200 bg-white hover:border-stone-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              Active
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
              Live
            </span>
          </div>
          <p className="mt-2 sm:mt-3 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {activeCount.toLocaleString()}
          </p>
          <p className="mt-0.5 sm:mt-1 text-[11px] text-stone-500 truncate">Published offerings</p>
        </div>

        {/* Card 3: Paused */}
        <div
          onClick={() => {
            setStatusFilter("paused");
            setSelectedCategory("all");
          }}
          className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition shadow-2xs ${
            statusFilter === "paused"
              ? "border-amber-400 bg-amber-50/40 ring-1 ring-amber-300"
              : "border-stone-200 bg-white hover:border-stone-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              Paused
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
              Suspended
            </span>
          </div>
          <p className="mt-2 sm:mt-3 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {pausedCount.toLocaleString()}
          </p>
          <p className="mt-0.5 sm:mt-1 text-[11px] text-stone-500 truncate">Paused by admin</p>
        </div>

        {/* Card 4: Total Services */}
        <div
          onClick={() => {
            setSelectedCategory("all");
            setStatusFilter("all");
          }}
          className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition shadow-2xs ${
            selectedCategory === "all" && statusFilter === "all"
              ? "border-stone-400 bg-stone-50/60"
              : "border-stone-200 bg-white hover:border-stone-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              Total Catalog
            </span>
            <Layers className="h-3.5 w-3.5 text-stone-400" />
          </div>
          <p className="mt-2 sm:mt-3 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {serviceList.length}
          </p>
          <p className="mt-0.5 sm:mt-1 text-[11px] text-stone-500 truncate">All services submitted</p>
        </div>
      </div>

      {/* 3. Pending Submissions Section */}
      {pendingServices.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#844353]" />
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Pending Submissions ({pendingServices.length})
              </h2>
            </div>
            <span className="text-xs text-stone-500 hidden sm:inline-block">
              Review and publish vendor listings
            </span>
          </div>

          <div className="space-y-3">
            {pendingServices.map((serviceItem) => {
              const serviceId = getServiceId(serviceItem);
              const serviceImage =
                serviceItem.images?.[0] ||
                FALLBACK_SERVICE_IMAGE;

              return (
                <div
                  key={serviceId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs transition hover:border-stone-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                      <Image
                        src={serviceImage}
                        alt={serviceItem.serviceName}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap text-stone-500 text-[11px]">
                        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700">
                          {serviceItem.category || "Wedding"}
                        </span>
                        {serviceItem.location && <span>{serviceItem.location}</span>}
                      </div>
                      <h3 className="font-serif font-bold text-stone-900 text-sm mt-0.5 truncate">
                        {serviceItem.serviceName}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        By <span className="font-medium text-stone-700">{serviceItem.businessName || serviceItem.vendorName || "Vendor"}</span> •{" "}
                        <span className="font-semibold text-stone-800">
                          ${Number(serviceItem.price || 0).toLocaleString()}
                        </span> / {serviceItem.pricingType || "event"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(serviceId, "Rejected")}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 transition cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedService(serviceItem);
                        setIsDetailsModalOpen(true);
                      }}
                      className="rounded-lg border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                    >
                      Review Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(serviceId, "Active")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs transition cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. All Services Section or Empty Catalog State */}
      {serviceList.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Wedding Services Submitted Yet"
          description="There are currently no wedding services in the platform catalog. Once vendors submit services, they will appear here for review, approval, and management."
        />
      ) : (
        <div className="space-y-4 pt-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">All Services</h2>
              <p className="text-xs text-stone-500">Manage and monitor active offerings across WedPlan.</p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(changeEvent) => setSearchQuery(changeEvent.target.value)}
                placeholder="Search services or vendors..."
                className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-8 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#844353] focus:outline-none focus:ring-1 focus:ring-[#844353] transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              All ({serviceList.length})
            </button>

            {availableCategories.map((categoryName) => (
              <button
                key={categoryName}
                type="button"
                onClick={() => setSelectedCategory(categoryName)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  selectedCategory.toLowerCase() === categoryName.toLowerCase()
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                {categoryName} ({categoryCounts[categoryName] || 0})
              </button>
            ))}
          </div>

          {/* Status Sub-Filters (Responsive Scroll / Pill Tabs) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-0.5">
              Status:
            </span>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 shrink-0 bg-stone-100/70 p-1 rounded-xl">
              {["all", "active", "pending", "paused", "rejected"].map((statusKey) => (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => setStatusFilter(statusKey)}
                  className={`capitalize px-2.5 py-1 rounded-lg text-xs transition cursor-pointer shrink-0 ${
                    statusFilter === statusKey
                      ? "font-semibold text-stone-900 bg-white shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {statusKey}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Desktop Services Table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  <th className="py-3.5 px-4">Service & Vendor</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredServices.map((serviceItem) => {
                  const serviceId = getServiceId(serviceItem);
                  const serviceImage =
                    serviceItem.images?.[0] ||
                    FALLBACK_SERVICE_IMAGE;

                  return (
                    <tr key={serviceId} className="hover:bg-stone-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                            <Image src={serviceImage} alt={serviceItem.serviceName} fill className="object-cover" sizes="44px" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900 truncate">{serviceItem.serviceName}</p>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              {serviceItem.vendorName ? `By ${serviceItem.vendorName}` : ""}
                              {serviceItem.businessName ? `${serviceItem.vendorName ? " • " : ""}${serviceItem.businessName}` : ""}
                              {serviceItem.location ? ` • ${serviceItem.location}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-700 border border-stone-200">
                          {serviceItem.category || "General"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        ${Number(serviceItem.price || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">{renderStatusBadge(serviceItem.status)}</td>
                      <td className="py-3 px-4 text-right">{renderServiceActions(serviceItem)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 6. Mobile Services Cards */}
          <div className="md:hidden space-y-3">
            {filteredServices.map((serviceItem) => {
              const serviceId = getServiceId(serviceItem);
              const serviceImage =
                serviceItem.images?.[0] ||
                FALLBACK_SERVICE_IMAGE;

              return (
                <div key={serviceId} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                      <Image src={serviceImage} alt={serviceItem.serviceName} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700">
                          {serviceItem.category || "General"}
                        </span>
                        {renderStatusBadge(serviceItem.status)}
                      </div>
                      <h3 className="font-semibold text-stone-900 text-sm mt-1 truncate">{serviceItem.serviceName}</h3>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {serviceItem.vendorName ? `By ${serviceItem.vendorName}` : ""}
                        {serviceItem.businessName ? `${serviceItem.vendorName ? " • " : ""}${serviceItem.businessName}` : ""}
                        {serviceItem.location ? ` • ${serviceItem.location}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <div>
                      <span className="text-stone-400 text-[11px]">Price: </span>
                      <span className="font-bold text-stone-900">
                        ${Number(serviceItem.price || 0).toLocaleString()}
                      </span>
                    </div>
                    {renderServiceActions(serviceItem)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State when filters return 0 results */}
          {filteredServices.length === 0 && (
            <EmptyState
              title="No Services Matching Filters"
              description={`No services matched your current query "${searchQuery || selectedCategory}". Try resetting the search or category filters.`}
              actionLabel="Clear all filters"
              onAction={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setStatusFilter("all");
              }}
            />
          )}
        </div>
      )}

      {/* 7. Service Details Modal */}
      <ServiceDetailsModal
        selectedService={selectedService}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedService(null);
        }}
        onStatusChange={handleStatusChange}
      />

      {/* 8. Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(serviceToDelete)}
        onOpenChange={(open) => !open && !isDeleting && setServiceToDelete(null)}
      >
        <DialogContent className="sm:max-w-md p-4 sm:p-6">
          <DialogHeader className="text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="font-serif text-lg text-stone-900">
              Delete Wedding Service?
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-stone-800">{serviceToDelete?.serviceName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setServiceToDelete(null)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-stone-200 px-3.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteService}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-4 text-xs font-medium text-white hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
            >
              {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isDeleting ? "Deleting..." : "Confirm Delete"}</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
