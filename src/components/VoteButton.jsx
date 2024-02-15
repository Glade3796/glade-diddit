"use client";

import { useFormStatus } from "react-dom";

export function VoteButton({ label, voted, postId }) {
  const { pending } = useFormStatus();
  return (
    <button
      className={
        !voted
          ? "border rounded border-zinc-600 px-3 py-2 hover:bg-pink-400 hover:text-black"
          : "border rounded border-zinc-600 px-3 py-2 bg-pink-400"
      }
      disabled={pending || voted}
    >
      {pending ? `Saving ${label}` : voted ? "voted" : label}
    </button>
  );
}
