"use client";

import { useRouter } from "next/navigation";

type Option = { label: string; href: string };

/** A native select that navigates to the chosen option's link. */
export function LinkSelect({
  id,
  label,
  placeholder,
  options,
}: {
  id: string;
  label: string;
  placeholder: string;
  options: Option[];
}) {
  const router = useRouter();

  return (
    <div>
      <label htmlFor={id} className="block text-xl font-bold">
        {label}
      </label>
      <div className="relative mt-3">
        <select
          id={id}
          defaultValue=""
          onChange={(event) => {
            if (event.target.value) router.push(event.target.value);
          }}
          className="w-full appearance-none rounded-md border border-border bg-background px-4 py-3 pr-10 text-foreground outline-none focus:border-brand"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={`${option.href}-${option.label}`} value={option.href}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-brand"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
