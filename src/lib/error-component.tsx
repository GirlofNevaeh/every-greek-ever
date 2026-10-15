import type { ErrorComponentProps } from "@tanstack/react-router";

const FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center text-ink">
      <span
        aria-hidden="true"
        className="grid size-14 place-items-center rounded-full bg-blue font-display text-2xl text-white"
      >
        !
      </span>
      <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-base break-words">{errorMessage(error)}</p>
    </main>
  );
}
