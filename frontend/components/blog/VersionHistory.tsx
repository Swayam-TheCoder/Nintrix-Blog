"use client";

import { Clock3, UserRound } from "lucide-react";
import type { BlogVersion } from "@/services/blog-version.service";

interface VersionHistoryProps {
  versions: BlogVersion[];
  selectedVersionId?: string;
  onSelect: (version: BlogVersion) => void;
}

export default function VersionHistory({
  versions,
  selectedVersionId,
  onSelect,
}: VersionHistoryProps) {
  if (!versions.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <p className="text-sm text-white/40">
          No versions available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="font-semibold">Version history</h2>
        <p className="mt-1 text-sm text-white/40">
          Published versions of this blog
        </p>
      </div>

      <div className="divide-y divide-white/10">
        {versions.map((version) => {
          const selected = version.id === selectedVersionId;

          return (
            <button
              key={version.id}
              onClick={() => onSelect(version)}
              className={`w-full px-5 py-4 text-left transition ${
                selected
                  ? "bg-white/[0.06]"
                  : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">
                    Version {version.version_number}
                  </p>

                  <p className="mt-1 line-clamp-1 text-sm text-white/50">
                    {version.title}
                  </p>
                </div>

                <span className="text-xs text-white/30">
                  {new Date(version.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1.5">
                  <UserRound size={13} />
                  {version.profiles?.display_name ||
                    version.profiles?.username ||
                    "Unknown"}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock3 size={13} />
                  {new Date(version.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}