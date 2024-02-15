"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const text = error.message;
  return (
    <div className="flex flex-col justify-center items-center gap-4 m-4 ">
      <h2>Hey cutie!</h2>
      <p className="border border-white p-4">please log in to vote</p>
      <p>
        Don&apos;t worry though, go back and try again, if the error persists
        let us know at help@diddit.com
      </p>

      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="border rounded border-zinc-600 px-3 py-2 hover:bg-pink-400 hover:text-black"
      >
        Go back
      </button>
    </div>
  );
}
