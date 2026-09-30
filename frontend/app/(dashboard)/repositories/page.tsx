"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FolderGit2, Plus, Search } from "lucide-react";

import {
  getMyRepositories,
  type Repository,
} from "@/services/repository.service";

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const repositories = await getMyRepositories();
        setRepositories(repositories || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadRepositories();
  }, []);

  const filteredRepositories = repositories.filter((repository) => {
    const query = search.toLowerCase();

    return (
      repository.name.toLowerCase().includes(query) ||
      repository.slug.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Repositories</h1>

            <p className="mt-1 text-sm text-white/40">
              Manage your blogging workspaces.
            </p>
          </div>

          <Link
            href="/repositories/new"
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
          >
            <Plus size={17} />
            New Repository
          </Link>
        </div>
      </header>

      <div className="p-8">
        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repositories..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/20"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 text-center text-sm text-white/40">
            Loading repositories...
          </div>
        ) : filteredRepositories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <FolderGit2 size={30} className="mx-auto text-white/25" />

            <h2 className="mt-4 font-medium">
              {search ? "No repositories found" : "No repositories yet"}
            </h2>

            <p className="mt-2 text-sm text-white/35">
              {search
                ? "Try a different search."
                : "Create your first repository to get started."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRepositories.map((repository) => (
              <Link
                key={repository.id}
                href={`/repositories/${repository.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <FolderGit2 size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{repository.name}</h3>

                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/40">
                      {repository.visibility}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-white/35">
                    {repository.slug}
                  </p>

                  {repository.description && (
                    <p className="mt-2 truncate text-sm text-white/40">
                      {repository.description}
                    </p>
                  )}
                </div>

                <span className="text-white/20 transition group-hover:text-white/60">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
