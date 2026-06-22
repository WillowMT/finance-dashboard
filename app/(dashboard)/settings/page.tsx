import { Suspense } from "react";
import { auth, signOut } from "@/lib/auth";
import { IOSCard } from "@/components/ui/IOSCard";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChevronRight, LogOut, User, Bell, Shield } from "lucide-react";

async function UserProfile() {
  const session = await auth();
  return (
    <IOSCard>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
          <User className="w-6 h-6 text-[#007AFF]" />
        </div>
        <div>
          <p className="font-semibold text-[#1C1C1E]">{session?.user?.name ?? "User"}</p>
          <p className="text-sm text-[#8E8E93]">{session?.user?.email ?? ""}</p>
        </div>
      </div>
    </IOSCard>
  );
}

function ProfileSkeleton() {
  return (
    <IOSCard>
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div>
          <Skeleton className="h-4 w-28 mb-1.5 rounded-lg" />
          <Skeleton className="h-3 w-40 rounded-lg" />
        </div>
      </div>
    </IOSCard>
  );
}

export default function SettingsPage() {
  return (
    <div className="pt-14 px-4">
      <IOSPageHeader title="Settings" />

      <div className="space-y-5">
        <Suspense fallback={<ProfileSkeleton />}>
          <UserProfile />
        </Suspense>

        <div>
          <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider px-1 mb-2">
            Preferences
          </p>
          <IOSCard padding={false}>
            {[
              { icon: Bell, label: "Notifications", color: "#FF9500" },
              { icon: Shield, label: "Privacy & Security", color: "#34C759" },
            ].map(({ icon: Icon, label, color }, i, arr) => (
              <div key={label}>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: color + "20" }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span className="flex-1 text-[#1C1C1E] text-sm font-medium">{label}</span>
                  <ChevronRight className="w-4 h-4 text-[#C7C7CC]" />
                </div>
                {i < arr.length - 1 && <div className="h-px bg-[#F2F2F7] ml-[60px]" />}
              </div>
            ))}
          </IOSCard>
        </div>

        <div>
          <IOSCard padding={false}>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/sign-in" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-3 px-4 py-3.5 w-full"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF3B30]/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-[#FF3B30]" />
                </div>
                <span className="text-[#FF3B30] text-sm font-medium">Sign Out</span>
              </button>
            </form>
          </IOSCard>
        </div>

        <p className="text-center text-xs text-[#8E8E93] pb-4">Finance Tracker v1.0</p>
      </div>
    </div>
  );
}
