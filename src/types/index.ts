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
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  isBlocked?: boolean | null;
  businessName?: string | null;
  subscriptionPlan?: string | null;
  subscriptionExpiresAt?: Date | string | null;
}

export interface DashboardSidebarProps {
  user?: IDashboardUser | null;
}

export interface ServiceFormData {
  serviceName: string;
  category: string;
  pricingType: string;
  price: string | number;
  location: string;
  description: string;
  images: string[];
  vendorId?: string;
  status?: string;
  createdAt?: string;
}

