"use client";

import { useId, useState } from "react";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  className?: string;
};

/** Password input with a show/hide toggle. */
export function PasswordField({
  name,
  label,
  placeholder,
  autoComplete,
  minLength,
  className,
}: Props) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        placeholder={placeholder ?? label}
        className={`${className ?? ""} pr-20`}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 mt-2 px-4 text-sm font-semibold text-brand hover:text-brand-dark"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
