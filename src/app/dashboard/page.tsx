import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";

export default async function DashboardPage() {
  const session = await getSession();

  // Redirect unauthenticated visitors to sign in
  if (!session?.user) {
    redirect("/signin");
  }

  const role = (session.user.role || "").toLowerCase();

  // Role-based destination redirection
  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "vendor") {
    redirect("/dashboard/vendor");
  } else if (role === "customer") {
    redirect("/dashboard/customer");
  } else {
    // Fallback for unknown or unspecified roles
    redirect("/dashboard/customer");
  }
}
