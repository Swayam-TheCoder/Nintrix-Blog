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
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useRef, useState } from "react";

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

  const [mobileOpen, setMobileOpen] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleLogout = async () => {
    setMobileOpen(false);
    await signOut();
    router.replace("/login");
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  /*
   * Close drawer whenever route changes
   */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /*
   * Lock body scroll while drawer is open
   */
  useEffect(() => {
    if (!mobileOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /*
   * Swipe gestures
   *
   * Right swipe  -> open
   * Left swipe   -> close
   */
  const handleTouchStart = (
    e: React.TouchEvent
  ) => {
    const touch = e.touches[0];

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (
    e: React.TouchEvent
  ) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const touch = e.changedTouches[0];

    const deltaX =
      touch.clientX - touchStartX.current;

    const deltaY =
      touch.clientY - touchStartY.current;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    /*
     * Ignore vertical scrolling
     */
    if (absX < absY) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    /*
     * Minimum swipe distance
     */
    if (Math.abs(deltaX) < 60) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    /*
     * Open drawer
     */
    if (!mobileOpen && deltaX > 60) {
      setMobileOpen(true);
    }

    /*
     * Close drawer
     */
    if (mobileOpen && deltaX < -60) {
      setMobileOpen(false);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <>
      {/* ================================================= */}
      {/* DESKTOP SIDEBAR                                   */}
      {/* ================================================= */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#0b0c10] md:flex">
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

        {/* Create */}
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
                pathname.startsWith(
                  `${item.href}/`
                );

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

      {/* Mobile menu trigger */}
{!mobileOpen && (
  <button
    type="button"
    onClick={() => setMobileOpen(true)}
    className="
      fixed
      left-3
      top-3
      z-50
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      border
      border-white/10
      bg-[#111318]/95
      text-white/70
      shadow-lg
      backdrop-blur-xl
      transition
      hover:bg-white/10
      hover:text-white
      active:scale-95
      md:hidden
    "
    aria-label="Open navigation"
  >
    <span className="flex flex-col gap-1">
      <span className="h-[2px] w-4 rounded-full bg-current" />
      <span className="h-[2px] w-4 rounded-full bg-current" />
      <span className="h-[2px] w-4 rounded-full bg-current" />
    </span>
  </button>
)}

      {/* ================================================= */}
      {/* MOBILE SWIPE AREA                                 */}
      {/* ================================================= */}

      <div
        className="fixed inset-0 z-[60] md:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          pointerEvents: mobileOpen
            ? "auto"
            : "none",
        }}
      >
        {/* Backdrop */}
        <div
          onClick={closeMobileSidebar}
          className={`
            absolute inset-0 bg-black/60
            backdrop-blur-[2px]
            transition-opacity duration-300
            ${
              mobileOpen
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        />

        {/* Drawer */}
        <aside
          className={`
            absolute inset-y-0 left-0
            flex w-[82%] max-w-[300px]
            flex-col
            border-r border-white/10
            bg-[#0b0c10]
            shadow-2xl shadow-black/50
            transition-transform duration-300
            ease-out
            ${
              mobileOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          {/* Header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
              onClick={closeMobileSidebar}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
                <BookOpen size={19} />
              </div>

              <div>
                <div className="font-semibold tracking-tight text-white">
                  NintrixBlog
                </div>

                <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Workspace
                </div>
              </div>
            </Link>

            <button
              onClick={closeMobileSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X size={19} />
            </button>
          </div>

          {/* Create Repository */}
          <div className="p-4">
            <Link
              href="/repositories/new"
              onClick={closeMobileSidebar}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition active:scale-[0.98]"
            >
              <Plus size={17} />
              New Repository
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Workspace
            </p>

            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                const active =
                  pathname === item.href ||
                  pathname.startsWith(
                    `${item.href}/`
                  );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileSidebar}
                    className={`
                      flex items-center gap-3
                      rounded-xl px-3 py-3
                      text-sm transition
                      ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/50 hover:bg-white/5 hover:text-white"
                      }
                    `}
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
                onClick={closeMobileSidebar}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <User size={18} />
                Profile
              </Link>

              <Link
                href="/settings"
                onClick={closeMobileSidebar}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <Settings size={18} />
                Settings
              </Link>
            </div>
          </nav>

          {/* Mobile User */}
          <div className="shrink-0 border-t border-white/10 p-3">
            <div className="flex items-center gap-3 rounded-xl p-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-300">
                {user?.email
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">
                  {user?.user_metadata
                    ?.full_name || "User"}
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
      </div>

      {/* ================================================= */}
      {/* MOBILE SWIPE HANDLE                               */}
      {/* ================================================= */}

      {!mobileOpen && (
        <div
          className="fixed left-0 top-0 z-50 h-full w-5 md:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      )}
    </>
  );
}