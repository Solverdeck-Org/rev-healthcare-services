"use client";

import { useState } from "react";

/**
 * Fills the location form with the visitor's coordinates. The form still needs
 * a backend that can match coordinates to an office before this does anything
 * beyond populating the field.
 */
export function UseMyLocation({ label }: { label: string }) {
  const [status, setStatus] = useState<"idle" | "locating" | "error">("idle");

  return (
    <div className="mt-3 text-center">
      <button
        type="button"
        onClick={() => {
          if (!navigator.geolocation) return setStatus("error");
          setStatus("locating");
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const input =
                document.querySelector<HTMLInputElement>("#location-search");
              if (input) {
                const { latitude, longitude } = position.coords;
                input.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
              }
              setStatus("idle");
            },
            () => setStatus("error"),
          );
        }}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4 hover:text-brand-dark"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-4"
        >
          <circle cx="12" cy="12" r="7" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
        </svg>
        {status === "locating" ? "Locating…" : label}
      </button>
      {status === "error" ? (
        <p className="mt-1 text-sm text-muted">
          Could not get your location. Enter a ZIP code instead.
        </p>
      ) : null}
    </div>
  );
}
