import { type LucideIcon } from "lucide-react";

export type TUserRole = "customer" | "vendor" | "admin";

export interface IMenuItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "pink" | "gray";
}

export interface IDashboardUser {
  id?: string;
  _id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  isBlocked?: boolean | null;
  businessName?: string | null;
  subscriptionPlan?: string | null;
  subscriptionExpiresAt?: Date | string | null;
  createdAt?: string | Date | null;
}

export interface DashboardSidebarProps {
  user?: IDashboardUser | null;
  pendingCount?: number;
  isPremium?: boolean;
}

//SERVICE TYPES
export type TServiceStatus = "Active" | "Pending" | "Under Review";
export type TFilterTab = "all" | "active" | "review";

export interface ServiceFormData {
  serviceName: string;
  category: string;
  pricingType: string;
  price: string | number;
  location: string;
  description: string;
  images: string[];
  vendorId?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendorAvatar?: string;
  businessName?: string;
  status?: TServiceStatus | string;
  createdAt?: string;
}

export interface IVendorService extends ServiceFormData {
  _id?: string;
  id?: string;
  isAvailable?: boolean;
  views?: number;
  inquiries?: number;
  bookings?: number;
  features?: string[];
  reviewNotice?: string;
  vendorName?: string;
  vendorAvatar?: string;
  vendorSubtitle?: string;
  businessName?: string;
}

// BOOKING TYPES
export interface IBookingPayload {
  _id?: string;
  serviceId: string;
  serviceName?: string;
  servicePrice?: number | string;
  serviceImage?: string;
  serviceCategory?: string;
  vendorId?: string;
  vendorEmail?: string;
  customerId?: string;
  customerName?: string | null;
  customerEmail?: string | null;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status?: string;
  createdAt?: string | Date;
}
