import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { useUnlock } from "@/components/paywall";
import { useI18n } from "@/lib/i18n";
import { confirmCheckout } from "@/lib/paywall.functions";

export const Route = createFileRoute("/unlock")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  component: UnlockPage,
});

function UnlockPage() {
  const { session_id } = Route.useSearch();
  const { t } = useI18n();
  const { markUnlocked } = useUnlock();
  const navigate = useNavigate();
  const [state, setState] = useState<"wait" | "ok" | "no">(session_id ? "wait" : "no");

  useEffect(() => {
    if (!session_id) {
      setState("no");
      return;
    }
    let cancel = false;
    confirmCheckout({ data: { sessionId: session_id } })
      .then((result) => {
        if (cancel) return;
        if (result.ok) {
          markUnlocked();
          setState("ok");
          window.setTimeout(() => {
            void navigate({ to: "/" });
          }, 900);
        } else {
          setState("no");
        }
      })
      .catch(() => {
        if (!cancel) setState("no");
      });
    return () => {
      cancel = true;
    };
  }, [session_id, markUnlocked, navigate]);

  return (
    <Shell search={false}>
      <section className="mx-auto max-w-lg rounded-[2rem] border-2 border-blue bg-card px-5 py-8 text-center">
        <h1 className="font-display text-4xl leading-tight">{state === "ok" ? t("pay.thanks") : t("pay.title")}</h1>
        <p className="mt-3 text-lg">{state === "wait" ? t("pay.checking") : state === "no" ? t("pay.notPaid") : t("pay.body")}</p>
        {state === "no" ? (
          <Link to="/" className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue px-4 font-bold text-white">
            {t("pay.back")}
          </Link>
        ) : null}
      </section>
    </Shell>
  );
}
