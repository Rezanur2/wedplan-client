'use server'
import { headers } from "next/headers";
import { auth } from "../auth";
import { IDashboardUser } from "@/types";
import { authFetch } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Fetch All Users with JWT Authentication
export async function getAllUsers(): Promise<IDashboardUser[]> {
  const jwtToken = await auth.api.getToken({ headers: await headers() });
  if (!jwtToken?.token) {
    throw new Error("No session found");
  }

  const token = jwtToken.token;
  const res = await fetch(`${BASE_URL}/users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = await res.json();
  if (Array.isArray(body)) {
    return body;
  }
  return body.data ?? body.users ?? [];
}

// Alias for pages referencing getUsers
export const getUsers = getAllUsers;

// Check user premium status
export const getUserPremiumById = async (userId: string) => {
  const api = `${BASE_URL}/users/${userId}/premium`;
  const response = await authFetch(api);
  if (!response.ok) return { premium: false };
  return response.json();
};
