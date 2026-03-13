import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AccountSettings from "@/components/dashboard/AccountSettings";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, createdAt: true },
  });

  if (!user) redirect("/login");

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user.email[0].toUpperCase();

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your profile and account preferences</p>
      </div>

      <div className="p-8 max-w-2xl">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
          {/* Avatar banner */}
          <div className="h-20 bg-gradient-to-r from-violet-500 to-indigo-600" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-8 mb-6">
              <div className="w-16 h-16 bg-white ring-4 ring-white rounded-2xl flex items-center justify-center text-xl font-bold text-violet-700 bg-gradient-to-br from-violet-100 to-indigo-100 shadow-sm flex-shrink-0">
                {initials}
              </div>
              <div className="pb-1">
                <p className="font-bold text-slate-900 text-base">{user.name || "Your Account"}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <AccountSettings initialName={user.name || ""} email={user.email} />
          </div>
        </div>

        {/* Account info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm font-semibold text-slate-900 mb-4">Account Information</p>
          <dl className="space-y-0">
            {[
              { label: "Email address", value: user.email },
              { label: "Member since", value: memberSince },
              { label: "Account status", value: "Active", badge: true },
            ].map((item, i, arr) => (
              <div key={item.label} className={`flex items-center justify-between py-3.5 ${i !== arr.length - 1 ? "border-b border-slate-50" : ""}`}>
                <dt className="text-sm text-slate-500">{item.label}</dt>
                <dd className="text-sm font-medium text-slate-900 flex items-center gap-2">
                  {item.badge ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200/80 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {item.value}
                    </span>
                  ) : item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
