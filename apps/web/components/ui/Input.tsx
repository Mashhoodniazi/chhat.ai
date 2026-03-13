"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          block w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500
          transition-all duration-150
          ${error ? "border-red-300 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300"}
          ${props.disabled ? "opacity-60 cursor-not-allowed bg-slate-50" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
