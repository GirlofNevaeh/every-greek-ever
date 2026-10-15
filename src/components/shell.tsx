import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LANGS, useI18n } from "@/lib/i18n";
import { NAV } from "@/data/catalog";
import { SearchBox } from "@/components/search-box";
import { Paywall, useUnlock } from "@/components/paywall";

export function Shell({
  children,
  search = true,
}: {
  children: React.ReactNode;
  search?: boolean;
}) {
  const { t, lang, setLang } = useI18n();
  const { unlocked } = useUnlock();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const bare = path.length > 1 ? path.replace(/\/$/, "") : path;
  const locked = bare !== "/" && !unlocked;
  const [openLang, setOpenLang] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  const label = LANGS.find(([id]) => id === lang)?.[1] ?? "English";

  useEffect(() => {
    if (!openLang && !openPhone) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenLang(false);
        setOpenPhone(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openLang, openPhone]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-card focus:p-3">
        {t("ui.skip")}
      </a>
      <header className="mx-auto w-full max-w-5xl px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <Link to="/" className="min-w-0 font-display text-2xl leading-tight font-bold text-blue sm:text-4xl">
            Every Greek Ever
          </Link>
          <div className="relative shrink-0">
            <button
              type="button"
              aria-expanded={openLang}
              aria-haspopup="listbox"
              onClick={() => setOpenLang((value) => !value)}
              className="max-w-36 min-h-11 rounded-2xl border-2 border-blue bg-card px-3 py-1 text-center text-sm leading-tight font-semibold break-words"
            >
              {label}
            </button>
            {openLang ? (
              <ul
                role="listbox"
                className="absolute right-0 z-30 mt-2 w-52 rounded-2xl border-2 border-blue bg-card p-2 shadow-sm"
              >
                {LANGS.map(([id, name]) => (
                  <li key={id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={id === lang}
                      onClick={() => {
                        setLang(id);
                        setOpenLang(false);
                      }}
                      className={`min-h-11 w-full rounded-xl px-3 text-left text-base ${id === lang ? "bg-blue text-white" : "text-ink"}`}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <p className="mt-1 text-sm font-semibold">{t("ui.ages")}</p>
        {search && !locked ? (
          <div className="mt-3">
            <SearchBox />
          </div>
        ) : null}
        <nav className="mt-3 grid grid-cols-3 gap-2" aria-label={t("nav.home")}>
          {NAV.map((item) => {
            const on = item.to === "/" ? path === "/" : path === item.to || path.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={on ? "page" : undefined}
                className={`grid min-h-11 place-items-center rounded-2xl border-2 px-1 py-2 text-center text-sm leading-tight font-bold break-words ${on ? "border-blue bg-blue text-white" : "border-blue bg-card text-ink"}`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
      </header>
      <main id="main" className="mx-auto w-full max-w-5xl px-4 py-6">
        {locked ? <Paywall /> : children}
      </main>
      <footer className="mx-auto w-full max-w-5xl px-4 pb-10">
        <p className="max-w-xl text-base">{t("foot.why")}</p>
        <button
          type="button"
          onClick={() => setOpenPhone(true)}
          className="no-print mt-4 min-h-12 rounded-2xl border-2 border-blue bg-card px-4 font-semibold"
        >
          {t("iphone.open")}
        </button>
      </footer>
      {openPhone ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/40 p-4" onClick={() => setOpenPhone(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="iphone-title"
            className="max-h-[90vh] w-full max-w-md overflow-auto rounded-3xl bg-card p-5 text-ink"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="iphone-title" className="font-display text-3xl leading-tight">
              {t("iphone.title")}
            </h2>
            <p className="mt-2 text-lg">{t("iphone.lead")}</p>
            <h3 className="mt-4 font-display text-2xl">{t("iphone.h")}</h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-base">
              <li>{t("iphone.1")}</li>
              <li>{t("iphone.2")}</li>
              <li>{t("iphone.3")}</li>
            </ol>
            <h3 className="mt-4 font-display text-2xl">{t("ipad.h")}</h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-base">
              <li>{t("ipad.1")}</li>
              <li>{t("ipad.2")}</li>
              <li>{t("ipad.3")}</li>
            </ol>
            <button type="button" onClick={() => setOpenPhone(false)} className="mt-5 min-h-12 rounded-2xl bg-blue px-4 font-bold text-white">
              {t("ui.close")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Why({ k, vars }: { k: string; vars?: Record<string, string> }) {
  const { t } = useI18n();
  return (
    <p className="mt-4 border-l-4 border-blue pl-3 text-lg">
      <span className="font-bold">{t("ui.why")} </span>
      {t(k, vars)}
    </p>
  );
}

export function Pager({
  prev,
  next,
}: {
  prev?: { to: "/people/$id" | "/gods/$id" | "/myths/$id" | "/thinkers/$id" | "/places/$id"; id: string; label: string };
  next?: { to: "/people/$id" | "/gods/$id" | "/myths/$id" | "/thinkers/$id" | "/places/$id"; id: string; label: string };
}) {
  const { t } = useI18n();
  if (!prev && !next) return null;
  return (
    <div className="mt-6 grid grid-cols-2 gap-2">
      {prev ? (
        <Link to={prev.to} params={{ id: prev.id }} className="min-h-12 rounded-2xl border-2 border-blue bg-card px-3 py-2 text-center font-bold break-words">
          {t("ui.prev")}
          <span className="mt-1 block text-sm font-semibold">{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={next.to} params={{ id: next.id }} className="min-h-12 rounded-2xl bg-blue px-3 py-2 text-center font-bold text-white break-words">
          {t("ui.next")}
          <span className="mt-1 block text-sm font-semibold">{next.label}</span>
        </Link>
      ) : null}
    </div>
  );
}
