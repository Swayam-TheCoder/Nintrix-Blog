"use client";

import { ChevronDown, Clock3, UserRound } from "lucide-react";
import type { BlogVersion } from "@/services/blog-version.service";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  if (!versions.length) return null;

  const selectedVersion = versions.find(
    (version) => version.id === selectedVersionId
  );

  return (
    <div className="relative">
      {/* Versions Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08]"
      >
        <Clock3 size={15} />

        {versions.length}{" "}
        {versions.length === 1 ? "Version" : "Versions"}

        <ChevronDown
          size={15}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Versions Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#111318] shadow-2xl shadow-black/40">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">
              Version history
            </p>

            <p className="mt-1 text-xs text-white/40">
              Select a version to view its data
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {versions.map((version) => {
              const selected =
                version.id === selectedVersionId;

              return (
                <button
                  key={version.id}
                  type="button"
                  onClick={() => {
                    onSelect(version);
                    setOpen(false);
                  }}
                  className={`w-full border-b border-white/[0.06] px-4 py-3 text-left transition last:border-b-0 ${
                    selected
                      ? "bg-violet-500/10"
                      : "hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">
                        Version {version.version_number}
                      </p>

                      <p className="mt-1 line-clamp-1 text-xs text-white/40">
                        {version.title}
                      </p>
                    </div>

                    <span className="text-[11px] text-white/30">
                      {new Date(
                        version.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-[11px] text-white/35">
                    <span className="flex items-center gap-1">
                      <UserRound size={12} />

                      {version.profiles?.display_name ||
                        version.profiles?.username ||
                        "Unknown"}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock3 size={12} />

                      {new Date(
                        version.created_at
                      ).toLocaleTimeString([], {
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
      )}

      {/* Selected Version Data */}
      {selectedVersion && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/30">
                Selected version
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                Version {selectedVersion.version_number}
              </h3>
            </div>

            <span className="text-xs text-white/30">
              {new Date(
                selectedVersion.created_at
              ).toLocaleString()}
            </span>
          </div>

          <div>
            <p className="text-sm text-white/40">
              Title
            </p>

            <p className="mt-1 font-medium">
              {selectedVersion.title}
            </p>
          </div>

          <div className="mt-5">
            <p className="text-sm text-white/40">
              Content
            </p>

            <div className="mt-2 whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm leading-7 text-white/70">
              {selectedVersion.content || "No content"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}