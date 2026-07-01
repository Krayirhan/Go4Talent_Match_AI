import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthCard({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-3 text-[var(--text-primary)]"
        >
          <span
            className="grid h-10 w-10 place-items-center text-[1.05rem] font-bold text-[var(--text-on-primary)]"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-500) 55%, var(--color-accent-500) 100%)",
              clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
            }}
          >
            G4
          </span>
          <span className="font-[var(--font-heading)] text-[1.05rem] font-bold">
            Go4Talent MatchAI
          </span>
        </Link>

        <div
          className="rounded-[28px] border p-8 shadow-2xl"
          style={{
            borderColor: "var(--surface-stroke)",
            background: "var(--surface-card)",
          }}
        >
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-500)]">
            {eyebrow}
          </span>
          <h1 className="mb-2 font-[var(--font-heading)] text-3xl font-bold leading-tight text-[var(--text-primary)]">
            {title}
          </h1>
          <p className="mb-8 text-sm text-[var(--text-secondary)]">{subtitle}</p>

          {children}
        </div>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">{footer}</p>
      </div>
    </main>
  );
}
