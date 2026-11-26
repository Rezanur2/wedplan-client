'use server'

import { protectedMutation } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const checkoutVerify = async (sessionId: string) => {
  try {
    const api = `${BASE_URL}/transactions/checkout-verify`;
    const response = await protectedMutation(api, "POST", { sessionId });

    if (!response.ok) {
      const errText = await response.text();
      try {
        return JSON.parse(errText);
      } catch {
        return { success: false, message: "Server returned non-JSON error" };
      }
    }

    return response.json();
  } catch (error) {
    console.error("Verification error:", error);
    return { success: false, message: "Network connection error" };
  }
};


export const createCheckoutSession = async () => {
  const api = `${BASE_URL}/create-checkout-session`;
  const response = await protectedMutation(api, "POST");
  return response.json();
}