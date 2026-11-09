"use client";

import { useEffect, useState } from "react";
import {
  User,
  Settings as SettingsIcon,
  Mail,
  Lock,
  MonitorSmartphone,
  Palette,
  Bell,
  Eye,
  Users,
  BookOpen,
  Download,
  Trash2,
  Camera,
  Save,
  Check,
  Loader2,
  ShieldCheck,
  ChevronRight,
  Github,
} from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";

const sections = [
  {
    title: "Account",
    items: [
      { id: "profile", label: "Public profile", icon: User },
      { id: "account", label: "Account settings", icon: SettingsIcon },
      { id: "emails", label: "Emails", icon: Mail },
      { id: "security", label: "Password & authentication", icon: Lock },
      { id: "sessions", label: "Sessions", icon: MonitorSmartphone },
    ],
  },
  {
    title: "Preferences",
    items: [
      { id: "appearance", label: "Appearance", icon: Palette },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "privacy", label: "Privacy", icon: Eye },
    ],
  },
  {
    title: "Collaboration",
    items: [
      { id: "collaboration", label: "Invitations", icon: Users },
      { id: "blogs", label: "Blog preferences", icon: BookOpen },
    ],
  },
  {
    title: "Advanced",
    items: [
      { id: "export", label: "Export data", icon: Download },
      { id: "danger", label: "Delete account", icon: Trash2 },
    ],
  },
];

export default function SettingsPage() {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    website: "",
    location: "",
  });

  useEffect(() => {
    if (!user) return;

    setProfile({
      name: user.user_metadata?.full_name || "",
      username: user.user_metadata?.username || "",
      bio: user.user_metadata?.bio || "",
      website: user.user_metadata?.website || "",
      location: user.user_metadata?.location || "",
    });
  }, [user]);

  const handleProfileSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.name,
          username: profile.username,
          bio: profile.bio,
          website: profile.website,
          location: profile.location,
        },
      });

      if (error) throw error;

      setMessage("Your profile has been updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  const currentItem = sections
    .flatMap((section) => section.items)
    .find((item) => item.id === activeSection);

  return (
    <div className="min-h-screen bg-[#08090c] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 border-b border-white/[0.08] pb-7">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-zinc-300">Settings</span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight">Settings</h1>

          <p className="mt-2 text-sm text-zinc-400">
            Manage your account, preferences and collaboration settings.
          </p>
          <br />
          <div className="text-center text-sm text-zinc-500">
            PAGE IS UNDER CONSTRUCTION
          </div>
        </div>

        {/* Sidebar */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden space-y-7 lg:block">
            {/* User card */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold">
                  {(profile.name || user?.email || "U").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {profile.name || "Your account"}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    @{profile.username || "username"}
                  </p>
                </div>
              </div>
            </div>

            {sections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  {section.title}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setMessage("");
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                          active
                            ? "bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20"
                            : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        <Icon size={17} className="shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 font-bold">
                {(profile.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {profile.name || "Your account"}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  @{profile.username || "username"}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.025] p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-2">
                {sections.flatMap((section) =>
                  section.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setMessage("");
                        }}
                        className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition ${
                          active
                            ? "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30"
                            : "text-zinc-400 hover:bg-white/[0.05]"
                        }`}
                      >
                        <Icon size={15} />
                        {item.label}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="min-w-0">
            {/* Section heading */}
            <div className="mb-6 border-b border-white/[0.08] pb-5">
              <h2 className="text-xl font-semibold">{currentItem?.label}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Manage your {currentItem?.label.toLowerCase()} information.
              </p>
            </div>

            {/* Public profile */}
            {activeSection === "profile" && (
              <div className="space-y-7">
                <div className="flex flex-col gap-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-3xl font-bold">
                    {(profile.name || user?.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-semibold">Profile picture</h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      Your profile picture represents you across NintrixBlog.
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
                      <Camera size={14} />
                      Avatar upload will be connected later.
                    </p>
                  </div>
                </div>

                <div className="space-y-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Display name
                    </label>
                    <input
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      placeholder="Your name"
                      className="w-full rounded-lg border border-white/10 bg-[#101116] px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Username
                    </label>
                    <div className="flex items-center rounded-lg border border-white/10 bg-[#101116] focus-within:border-violet-500">
                      <span className="border-r border-white/10 px-3 text-sm text-zinc-500">
                        @
                      </span>
                      <input
                        value={profile.username}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            username: e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9_-]/g, ""),
                          })
                        }
                        placeholder="username"
                        className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                      />
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">
                      Your unique identity on NintrixBlog.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      maxLength={160}
                      rows={4}
                      placeholder="Tell people a little about yourself..."
                      className="w-full resize-none rounded-lg border border-white/10 bg-[#101116] px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                    />
                    <p className="mt-1 text-right text-xs text-zinc-600">
                      {profile.bio.length}/160
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Website
                    </label>
                    <input
                      value={profile.website}
                      onChange={(e) =>
                        setProfile({ ...profile, website: e.target.value })
                      }
                      placeholder="https://yourwebsite.com"
                      className="w-full rounded-lg border border-white/10 bg-[#101116] px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Location
                    </label>
                    <input
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                      placeholder="Your location"
                      className="w-full rounded-lg border border-white/10 bg-[#101116] px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-zinc-500">
                      Changes are saved to your account.
                    </p>

                    <button
                      onClick={handleProfileSave}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-violet-500 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Save changes
                    </button>
                  </div>

                  {message && (
                    <p className="flex items-center gap-2 text-sm text-violet-300">
                      <Check size={16} />
                      {message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Account */}
            {activeSection === "account" && (
              <SettingsCard title="Account information">
                <SettingRow
                  title="Email address"
                  description={user?.email || "No email found"}
                  badge="Primary"
                />
                <SettingRow title="User ID" description={user?.id || ""} />
                <SettingRow
                  title="Authentication provider"
                  description={user?.app_metadata?.provider || "Email"}
                />
                <SettingRow
                  title="Account created"
                  description={
                    user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "Unavailable"
                  }
                />
              </SettingsCard>
            )}

            {/* Emails */}
            {activeSection === "emails" && (
              <SettingsCard title="Email addresses">
                <SettingRow
                  title="Primary email"
                  description={user?.email || ""}
                  badge={user?.email_confirmed_at ? "Verified" : "Unverified"}
                />
                <p className="text-sm text-zinc-500">
                  Email management and changing your primary email can be added
                  here.
                </p>
              </SettingsCard>
            )}

            {/* Security */}
            {activeSection === "security" && (
              <SettingsCard title="Password and authentication">
                <SettingRow
                  title="Password"
                  description="Manage your account password."
                  action="Change password"
                  onAction={() => {
                    window.location.href = "/forgot-password";
                  }}
                />
                <SettingRow
                  title="Google authentication"
                  description="Your Google account authentication provider."
                  badge={
                    user?.app_metadata?.provider === "google"
                      ? "Connected"
                      : "Not connected"
                  }
                />
                <SettingRow
                  title="Two-factor authentication"
                  description="Add another layer of security."
                  badge="Coming soon"
                />
              </SettingsCard>
            )}

            {/* Sessions */}
            {activeSection === "sessions" && (
              <SettingsCard title="Active sessions">
                <SettingRow
                  title="Current session"
                  description="You are currently signed in on this device."
                  badge="Active"
                />
                <p className="text-sm text-zinc-500">
                  Device-level session management will be connected here.
                </p>
              </SettingsCard>
            )}

            {/* Appearance */}
            {activeSection === "appearance" && (
              <SettingsCard title="Appearance">
                <SettingRow
                  title="Interface theme"
                  description="Choose how NintrixBlog looks."
                />
                <div className="grid grid-cols-3 gap-3">
                  {["Light", "Dark", "System"].map((theme) => (
                    <button
                      key={theme}
                      className="rounded-lg border border-white/10 bg-[#101116] p-4 text-sm transition hover:border-violet-500"
                    >
                      <Palette size={20} className="mb-3 text-violet-400" />
                      {theme}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-zinc-600">
                  Theme selection is currently a UI preview; persistence will be
                  added later.
                </p>
              </SettingsCard>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <SettingsCard title="Notification preferences">
                {[
                  ["New followers", "When someone follows you."],
                  ["Blog comments", "When someone comments on your blog."],
                  ["Mentions", "When someone mentions you."],
                  ["Collaboration invitations", "When someone invites you."],
                  ["Invitation updates", "When an invitation is accepted."],
                  ["Email notifications", "Receive updates through email."],
                ].map(([title, description]) => (
                  <ToggleRow
                    key={title}
                    title={title}
                    description={description}
                  />
                ))}
                <p className="text-xs text-zinc-600">
                  Notification preferences are not persisted yet.
                </p>
              </SettingsCard>
            )}

            {/* Privacy */}
            {activeSection === "privacy" && (
              <SettingsCard title="Privacy controls">
                {[
                  ["Public profile", "Allow others to view your profile."],
                  ["Show activity", "Display your recent activity."],
                  ["Allow followers", "Allow other users to follow you."],
                  ["Allow invitations", "Allow collaboration invitations."],
                ].map(([title, description]) => (
                  <ToggleRow
                    key={title}
                    title={title}
                    description={description}
                  />
                ))}
              </SettingsCard>
            )}

            {/* Collaboration */}
            {activeSection === "collaboration" && (
              <SettingsCard title="Collaboration preferences">
                <SettingRow
                  title="Pending invitations"
                  description="Manage invitations you've received."
                  action="View invitations"
                  onAction={() => {
                    window.location.href = "/invitations";
                  }}
                />
                <SettingRow
                  title="Default collaborator role"
                  description="Choose the default role for new collaborators."
                  badge="Coming soon"
                />
                <SettingRow
                  title="Invitation permissions"
                  description="Control who can invite you to collaborate."
                  badge="Coming soon"
                />
              </SettingsCard>
            )}

            {/* Blog preferences */}
            {activeSection === "blogs" && (
              <SettingsCard title="Blog preferences">
                <SettingRow
                  title="Default visibility"
                  description="Choose whether new blogs are public or private."
                  badge="Coming soon"
                />
                <SettingRow
                  title="Default publishing status"
                  description="Choose the default status for new blogs."
                  badge="Coming soon"
                />
              </SettingsCard>
            )}

            {/* Export */}
            {activeSection === "export" && (
              <SettingsCard title="Export your data">
                <p className="text-sm leading-6 text-zinc-400">
                  You will be able to download your profile, blogs, repositories
                  and other account information.
                </p>
                <button
                  disabled
                  className="mt-5 flex cursor-not-allowed items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-zinc-500"
                >
                  <Download size={16} />
                  Export data — Coming soon
                </button>
              </SettingsCard>
            )}

            {/* Danger zone */}
            {activeSection === "danger" && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-5">
                <div className="flex items-center gap-2 text-red-400">
                  <ShieldCheck size={20} />
                  <h3 className="font-semibold">Danger zone</h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Deleting your account is permanent. Your profile, repositories
                  and associated content may be affected.
                </p>

                <button
                  disabled
                  className="mt-5 cursor-not-allowed rounded-lg border border-red-500/30 px-4 py-2.5 text-sm text-red-400 opacity-50"
                >
                  Delete account — Coming soon
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* Reusable components */

function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
      <h3 className="text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function SettingRow({
  title,
  description,
  badge,
  action,
  onAction,
}: {
  title: string;
  description: string;
  badge?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/[0.06] py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 break-all text-xs text-zinc-500">{description}</p>
      </div>

      {action ? (
        <button
          onClick={onAction}
          className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs transition hover:border-violet-500 hover:text-violet-300"
        >
          {action}
        </button>
      ) : badge ? (
        <span className="w-fit shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-400">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function ToggleRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-4 last:border-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-violet-600" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
