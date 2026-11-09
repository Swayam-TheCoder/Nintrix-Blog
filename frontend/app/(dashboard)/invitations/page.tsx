
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  FolderGit2,
  Inbox,
  X,
} from "lucide-react";

import {
  getMyInvitations,
  respondToInvitation,
  type Invitation,
} from "@/services/invitation.service";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadInvitations = useCallback(async () => {
    try {
      setError("");
      const data = await getMyInvitations();
      setInvitations(data || []);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load invitations."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const handleResponse = async (
    invitationId: string,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      setBusyId(invitationId);
      setError("");

      await respondToInvitation(invitationId, status);
      await loadInvitations();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Unable to process invitation."
      );
    } finally {
      setBusyId(null);
    }
  };

  const pendingInvitations = invitations.filter((item) => {
    return (
      item.status === "PENDING" &&
      (!item.expires_at || new Date(item.expires_at) > new Date())
    );
  });

  const otherInvitations = invitations.filter(
    (item) => !pendingInvitations.includes(item)
  );

  return (
    <main className="min-h-screen py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-white/40">Workspace</p>
          <h1 className="text-2xl font-semibold">Invitations</h1>
          <p className="mt-2 text-sm text-white/40">
            Manage repository invitations sent to you.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <p className="text-xs text-white/40">Pending invitations</p>
          <p className="mt-1 text-xl font-semibold">
            {pendingInvitations.length}
          </p>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 p-12 text-center text-sm text-white/40">
          Loading invitations...
        </div>
      ) : invitations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-14 text-center">
          <Inbox className="mx-auto text-white/30" size={32} />
          <h2 className="mt-4 font-medium">No invitations yet</h2>
          <p className="mt-2 text-sm text-white/40">
            When someone invites you to collaborate, it will appear here.
          </p>
          <Link
            href="/repositories"
            className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90"
          >
            Explore repositories
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {pendingInvitations.length > 0 && (
            <section>
              <h2 className="mb-4 font-semibold">
                Pending ({pendingInvitations.length})
              </h2>

              <div className="space-y-3">
                {pendingInvitations.map((invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    busy={busyId === invitation.id}
                    onRespond={handleResponse}
                  />
                ))}
              </div>
            </section>
          )}

          {otherInvitations.length > 0 && (
            <section>
              <h2 className="mb-4 font-semibold">Previous invitations</h2>

              <div className="space-y-3">
                {otherInvitations.map((invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    busy={busyId === invitation.id}
                    onRespond={handleResponse}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}

function InvitationCard({
  invitation,
  busy,
  onRespond,
}: {
  invitation: Invitation;
  busy: boolean;
  onRespond: (
    id: string,
    status: "ACCEPTED" | "REJECTED"
  ) => void;
}) {
  const expired =
    invitation.status === "PENDING" &&
    !!invitation.expires_at &&
    new Date(invitation.expires_at) <= new Date();

  const pending = invitation.status === "PENDING" && !expired;

  const status = expired ? "EXPIRED" : invitation.status;

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
          <FolderGit2 size={21} />
        </div>

        <div className="min-w-0">
          <h3 className="font-medium">
            {invitation.repositories?.name || "Repository"}
          </h3>

          <p className="mt-1 text-sm text-white/50">
            Invited by{" "}
            <span className="text-white/80">
              {invitation.profiles?.display_name ||
                invitation.profiles?.username ||
                "Unknown user"}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/40">
            <span className="rounded-lg border border-white/10 px-2 py-1">
              {invitation.role}
            </span>
            <span>
              {new Date(invitation.created_at).toLocaleDateString()}
            </span>
            {invitation.expires_at && (
              <span>
                Expires {new Date(invitation.expires_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {pending ? (
          <>
            <button
              disabled={busy}
              onClick={() => onRespond(invitation.id, "REJECTED")}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 disabled:opacity-40"
            >
              <X size={16} />
              Decline
            </button>

            <button
              disabled={busy}
              onClick={() => onRespond(invitation.id, "ACCEPTED")}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-40"
            >
              <Check size={16} />
              {busy ? "Processing..." : "Accept"}
            </button>
          </>
        ) : (
          <span className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50">
            <Clock size={14} />
            {status}
          </span>
        )}
      </div>
    </article>
  );
}
