const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const checkoutVerify = async (sessionId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/transactions/checkout-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

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