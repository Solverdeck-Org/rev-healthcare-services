"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
};

/**
 * Submit button that shows a spinner while the form posts.
 *
 * The pending state is driven by the form's own `submit` event, not the
 * button's click. Setting `disabled` during the click handler cancels the
 * browser's default submit, which silently stops the form from posting.
 */
export function SubmitButton({ children, className, pendingLabel }: Props) {
  const [pending, setPending] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const form = ref.current?.form;
    if (!form) return;

    const onSubmit = () => setPending(true);
    form.addEventListener("submit", onSubmit);

    // Coming back via the browser's back/forward cache must not leave a
    // button stuck in its spinning state.
    const onShow = () => setPending(false);
    window.addEventListener("pageshow", onShow);

    return () => {
      form.removeEventListener("submit", onSubmit);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);

  return (
    <button
      ref={ref}
      type="submit"
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 ${
        pending ? "pointer-events-none opacity-70" : ""
      } ${className ?? ""}`}
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
