import type { InputHTMLAttributes } from "react";

export default function FormField({
  label,
  id,
  ...inputProps
}: { label: string; id: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="w-full rounded-xl border px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--color-primary-500)]"
        style={{
          borderColor: "var(--surface-stroke)",
          background: "var(--surface-overlay)",
        }}
        {...inputProps}
      />
    </div>
  );
}
