"use client";

import { useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
};

/**
 * Submit button that shows a spinner while the form posts. These forms are
 * plain HTML posts that navigate, so we track the submit event ourselves
 * rather than using useFormStatus (which only tracks form actions).
 */
export function SubmitButton({ children, className, pendingLabel }: Props) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      onClick={(event) => {
        const form = event.currentTarget.form;
        // Let the browser run validation first; only spin on a real submit.
        if (form && !form.checkValidity()) return;
        setPending(true);
      }}
      className={`inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 ${className ?? ""}`}
    >
      {pending ? (
        <>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 animate-spin"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-25"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          {pendingLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
