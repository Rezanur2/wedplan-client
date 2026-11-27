'use server';

import { ITransaction } from "@/types";
import { authFetch } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Get all transactions for Admin (auditing revenue & subscriptions)
export const getAdminTransactions = async (): Promise<ITransaction[]> => {
  try {
    const api = `${BASE_URL}/admin/transactions`;
    const res = await authFetch(api);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching admin transactions:", error);
    return [];
  }
};

// Get logged-in vendor's own payment history
export const getMyTransactions = async (): Promise<ITransaction[]> => {
  try {
    const api = `${BASE_URL}/transactions/my`;
    const res = await authFetch(api);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching vendor payment history:", error);
    return [];
  }
};
