import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AccountSettings from "@/components/dashboard/AccountSettings";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, createdAt: true, plan: true },
  });

  if (!user) redirect("/login");

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user.email[0].toUpperCase();

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <div className="px-8 pt-8 pb-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and security preferences.</p>
        </div>
        <AccountSettings
          initialName={user.name || ""}
          email={user.email}
          initials={initials}
          memberSince={memberSince}
          plan={user.plan}
        />
      </div>
    </div>
  );
}
