import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { SymbolBadge } from "@/components/art";
import { gods, nice } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/gods/")({
  component: GodsPage,
});

function GodsPage() {
  const { t } = useI18n();
  return (
    <Shell>
      <h1 className="font-display text-4xl text-blue">{t("nav.gods")}</h1>
      <p className="mt-3 max-w-xl rounded-3xl bg-card p-4 text-lg">{t("gods.intro")}</p>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {gods.map((god) => (
          <li key={god.id}>
            <Link to="/gods/$id" params={{ id: god.id }} className="block rounded-full border-2 border-blue bg-card p-3 text-center">
              <SymbolBadge prop={god.prop} label={t(`god.${god.id}.sign`)} />
              <span className="mt-1 block font-display text-2xl leading-tight">{nice(god.id)}</span>
              <span className="block text-sm break-words">{t(`god.${god.id}.sign`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
