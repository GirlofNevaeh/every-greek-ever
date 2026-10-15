import { createFileRoute } from "@tanstack/react-router";
import { Pager, Shell, Why } from "@/components/shell";
import { Portrait, CreatureArt, creatureSrc } from "@/components/art";
import { myths, neighbors } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/myths/$id")({
  component: MythPage,
});

function MythPage() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const myth = myths.find((item) => item.id === id);
  if (!myth) {
    return (
      <Shell>
        <h1 className="font-display text-4xl">{t("ui.missing")}</h1>
      </Shell>
    );
  }
  const { prev, next } = neighbors(myths, id);
  const lines = Array.from({ length: myth.lines }, (_, i) => `myth.${myth.id}.${i + 1}`);
  return (
    <Shell>
      <article className="mx-auto max-w-2xl">
        <p className="inline-block rounded-full bg-ink px-3 py-1 text-sm font-bold text-white">{t("ui.story")}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{t(`myth.${myth.id}.title`)}</h1>
        <div className="mt-4 overflow-hidden rounded-[2rem] border-2 border-blue bg-card">
          {creatureSrc[myth.id] ? (
            <CreatureArt id={myth.id} label={t(`myth.${myth.id}.title`)} />
          ) : (
            <Portrait prop={myth.prop} frame="frieze" label={t(`myth.${myth.id}.title`)} />
          )}
        </div>
        <div className="mt-4 space-y-3">
          {lines.map((key) => (
            <p key={key} className="rounded-2xl bg-card px-4 py-3 text-lg leading-snug">
              {t(key)}
            </p>
          ))}
        </div>
        <Why k={`myth.${myth.id}.why`} />
      </article>
      <Pager
        prev={prev ? { to: "/myths/$id", id: prev.id, label: t(`myth.${prev.id}.title`) } : undefined}
        next={next ? { to: "/myths/$id", id: next.id, label: t(`myth.${next.id}.title`) } : undefined}
      />
    </Shell>
  );
}
