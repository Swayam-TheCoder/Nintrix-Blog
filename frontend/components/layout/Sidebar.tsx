"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  BookOpen,
  Compass,
  FolderGit2,
  Home,
  LogOut,
  Settings,
  User,
  Users,
  Plus,
} from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Repositories",
    href: "/repositories",
    icon: FolderGit2,
  },
  {
    name: "Discover",
    href: "/discover",
    icon: Compass,
  },
  {
    name: "Invitations",
    href: "/invitations",
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[#0b0c10]">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
            <BookOpen size={19} />
          </div>

          <div>
            <div className="font-semibold tracking-tight">
              NintrixBlog
            </div>

            <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              Workspace
            </div>
          </div>
        </Link>
      </div>

      {/* Create button */}
      <div className="p-4">
        <Link
          href="/repositories/new"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
        >
          <Plus size={17} />
          New Repository
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Account
        </p>

        <div className="space-y-1">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            <User size={18} />
            Profile
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-300">
            {user?.email?.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white">
              {user?.user_metadata?.full_name ||
                "User"}
            </p>

            <p className="truncate text-xs text-white/40">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="rounded-lg p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}