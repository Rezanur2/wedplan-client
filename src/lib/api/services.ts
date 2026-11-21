const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const getServices = async (vendorId?: string) => {
  const url = vendorId
    ? `${BASE_URL}/services?vendorId=${vendorId}`
    : `${BASE_URL}/services`;

  const res = await fetch(url, { cache: "no-store" });
  return res.json();
};
