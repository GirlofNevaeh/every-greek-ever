import { createFileRoute } from "@tanstack/react-router";
import { Pager, Shell, Why } from "@/components/shell";
import { SymbolBadge, CreatureArt, creatureSrc } from "@/components/art";
import { gods, neighbors, nice } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/gods/$id")({
  component: GodPage,
});

function GodPage() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const god = gods.find((item) => item.id === id);
  if (!god) {
    return (
      <Shell>
        <h1 className="font-display text-4xl">{t("ui.missing")}</h1>
      </Shell>
    );
  }
  const { prev, next } = neighbors(gods, id);
  return (
    <Shell>
      <div className="rounded-[2rem] bg-blue px-5 py-4 text-white">
        <p className="text-sm font-bold">{t("ui.storyGod")}</p>
        <h1 className="font-display text-5xl leading-none">{nice(god.id)}</h1>
      </div>
      <div className={creatureSrc[god.id] ? "mx-auto mt-4 max-w-xl overflow-hidden rounded-[2rem] border-2 border-blue bg-card" : "relative z-10 mx-auto -mt-6 w-40"}>
        {creatureSrc[god.id] ? (
          <CreatureArt id={god.id} label={t(`god.${god.id}.sign`)} />
        ) : (
          <SymbolBadge prop={god.prop} label={t(`god.${god.id}.sign`)} />
        )}
      </div>
      <p className="mt-2 text-center text-sm font-bold">{t("ui.symbol")}: {t(`god.${god.id}.sign`)}</p>
      <div className="mx-auto mt-4 max-w-xl space-y-3 text-lg">
        <p>{t(`god.${god.id}.a`)}</p>
        <p>{t(`god.${god.id}.b`)}</p>
        <Why k={`god.${god.id}.why`} />
      </div>
      <Pager
        prev={prev ? { to: "/gods/$id", id: prev.id, label: nice(prev.id) } : undefined}
        next={next ? { to: "/gods/$id", id: next.id, label: nice(next.id) } : undefined}
      />
    </Shell>
  );
}
