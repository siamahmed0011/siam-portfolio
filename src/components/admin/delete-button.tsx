"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/actions/admin-actions";

interface DeleteButtonProps {
  id: number;
  itemName?: string;
  onDelete: (id: number) => Promise<ActionResult>;
  className?: string;
  redirectAfterDelete?: string;
}

export function DeleteButton({
  id,
  itemName = "item",
  onDelete,
  className = "",
  redirectAfterDelete,
}: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleDelete() {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        const result = await onDelete(id);
        if (result.success) {
          setShowConfirm(false);
          if (redirectAfterDelete) {
            router.push(redirectAfterDelete);
          } else {
            router.refresh();
          }
        } else {
          setErrorMsg(result.message || "Failed to delete");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Deletion failed";
        setErrorMsg(msg);
      }
    });
  }

  if (showConfirm) {
    return (
      <div className="inline-flex items-center gap-2 p-1.5 bg-rose-950/90 border border-rose-800/80 rounded-xl text-xs animate-in fade-in duration-150 shadow-lg">
        <span className="text-rose-200 font-semibold px-1.5">Delete?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="h-7 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs transition-colors disabled:opacity-50 inline-flex items-center justify-center"
        >
          {isPending ? "Deleting..." : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowConfirm(false);
            setErrorMsg(null);
          }}
          disabled={isPending}
          className="h-7 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-xs transition-colors inline-flex items-center justify-center"
        >
          Cancel
        </button>
        {errorMsg && <span className="text-rose-400 text-xs px-1">{errorMsg}</span>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className={`h-8 px-3 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-all cursor-pointer ${className}`}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      Delete
    </button>
  );
}
