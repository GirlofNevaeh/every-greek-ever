import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

const PLANS_URL = "https://www.everyschoolever.com/pricing?plan=";

type UnlockValue = { unlocked: boolean; markUnlocked: () => void };

const UnlockContext = createContext<UnlockValue | null>(null);

export function UnlockProvider({ unlocked, children }: { unlocked: boolean; children: ReactNode }) {
  const [paid, setPaid] = useState(unlocked);
  useEffect(() => {
    if (unlocked) setPaid(true);
  }, [unlocked]);
  const markUnlocked = useCallback(() => setPaid(true), []);
  const value = useMemo(() => ({ unlocked: paid || unlocked, markUnlocked }), [paid, unlocked, markUnlocked]);
  return <UnlockContext.Provider value={value}>{children}</UnlockContext.Provider>;
}

export function useUnlock() {
  const value = useContext(UnlockContext);
  if (!value) throw new Error("Unlock is missing.");
  return value;
}

export function Paywall() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-lg rounded-[2rem] border-2 border-blue bg-card px-5 py-8 text-center">
      <div className="mx-auto grid size-24 place-items-center rounded-[1.5rem] bg-blue text-paper" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="size-16">
          <rect x="18" y="28" width="28" height="22" rx="3" fill="#F7F5F2" />
          <path d="M24 28v-6a8 8 0 0 1 16 0v6" fill="none" stroke="#F7F5F2" strokeWidth="4" />
          <circle cx="32" cy="38" r="2.5" fill="#0D5EAF" />
          <path d="M32 40.5v6" stroke="#0D5EAF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <p className="mt-4 text-sm font-bold text-blue">{t("pay.kicker")}</p>
      <h1 className="mt-1 font-display text-4xl leading-tight">{t("pay.title")}</h1>
      <p className="mt-3 text-lg">{t("pay.body")}</p>
      <a
        href={PLANS_URL}
        className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-blue px-4 text-lg font-bold text-white"
      >
        {t("pay.button")}
      </a>
      <p className="mt-4 text-base">{t("pay.note")}</p>
      <Link to="/" className="mt-4 inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-blue px-4 font-bold">
        {t("pay.back")}
      </Link>
    </section>
  );
}