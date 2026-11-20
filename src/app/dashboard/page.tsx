import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect unauthenticated visitors to sign in
  if (!session?.user) {
    redirect("/signin");
  }

  const role = session.user.role;

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
