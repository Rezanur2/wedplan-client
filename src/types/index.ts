import {type LucideIcon } from "lucide-react";
export type TUserRole = "customer" | "vendor" | "admin";

export interface IMenuItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "pink" | "gray";
}