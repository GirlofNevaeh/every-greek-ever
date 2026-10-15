import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Portrait, CreatureArt, creatureSrc } from "@/components/art";
import { myths } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/myths/")({
  component: MythsPage,
});

function MythsPage() {
  const { t } = useI18n();
  return (
    <Shell>
      <p className="inline-block rounded-full bg-blue px-3 py-1 text-sm font-bold text-white">{t("ui.story")}</p>
      <h1 className="mt-3 font-display text-4xl">{t("nav.myths")}</h1>
      <p className="mt-2 max-w-xl text-lg">{t("myths.intro")}</p>
      <h2 className="mt-6 font-display text-3xl">{t("ui.inStories")}</h2>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(["maze", "odysseus", "heracles", "horse", "arachne"] as const).map((id) => (
          <li key={id}>
            <Link to="/myths/$id" params={{ id }} className="block overflow-hidden rounded-3xl border-2 border-blue bg-card">
              <CreatureArt id={id} label="" />
              <span className="block px-3 py-2 font-display text-xl leading-tight">{t(`myth.${id}.title`)}</span>
            </Link>
          </li>
        ))}
        {(["athena", "hera"] as const).map((id) => (
          <li key={id}>
            <Link to="/gods/$id" params={{ id }} className="block overflow-hidden rounded-3xl border-2 border-blue bg-card">
              <CreatureArt id={id} label="" />
              <span className="block px-3 py-2 font-display text-xl leading-tight">{id[0]!.toUpperCase() + id.slice(1)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="mt-5 grid gap-4">
        {myths.map((myth, index) => (
          <li key={myth.id}>
            <Link
              to="/myths/$id"
              params={{ id: myth.id }}
              className={`grid items-center gap-3 rounded-[2rem] border-2 border-blue p-3 sm:grid-cols-[160px_1fr] ${index % 2 ? "bg-paper" : "bg-card"}`}
            >
              {creatureSrc[myth.id] ? (
                <CreatureArt id={myth.id} label="" />
              ) : (
                <Portrait prop={myth.prop} frame="frieze" label="" />
              )}
              <span>
                <span className="block text-sm font-bold text-blue">{t("ui.story")}</span>
                <span className="block font-display text-3xl leading-tight">{t(`myth.${myth.id}.title`)}</span>
                <span className="mt-1 block text-base">{t(`myth.${myth.id}.1`)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
