import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Portrait } from "@/components/art";
import { nice, thinkers } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/thinkers/")({
  component: ThinkersPage,
});

function ThinkersPage() {
  const { t } = useI18n();
  return (
    <Shell>
      <h1 className="font-display text-4xl">{t("nav.thinkers")}</h1>
      <p className="mt-3 max-w-xl text-xl leading-snug">{t("thinkers.intro")}</p>
      <div className="mt-5 grid gap-3">
        {[
          ["think.q.friend", "think.a.friend"],
          ["think.q.fair", "think.a.fair"],
          ["think.q.true", "think.a.true"],
        ].map(([q, a]) => (
          <details key={q} className="rounded-3xl border-2 border-ink bg-card p-4">
            <summary className="cursor-pointer text-xl font-bold">{t(q)}</summary>
            <p className="mt-3 text-lg">{t(a)}</p>
            <p className="mt-1 text-sm">{t("ui.thought")}</p>
          </details>
        ))}
      </div>
      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {thinkers.map((person) => (
          <li key={person.id}>
            <Link to="/thinkers/$id" params={{ id: person.id }} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 rounded-[2rem] bg-blue p-3 text-white md:grid-cols-1">
              <Portrait hair={person.hair} woman={person.woman} prop={person.prop} frame="ask" label={nice(person.id)} />
              <span className="mt-2 block font-display text-3xl">{nice(person.id)}</span>
              <span className="block text-sm">{t(`person.${person.id}.role`)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/people/$id" params={{ id: "pythagoras" }} className="mt-4 block rounded-3xl border-2 border-blue bg-card p-4">
        <span className="font-display text-2xl">Pythagoras</span>
        <span className="mt-1 block text-base">{t("thinkers.pythagorasNote")}</span>
      </Link>
    </Shell>
  );
}
