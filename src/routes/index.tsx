import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { SearchBox } from "@/components/search-box";
import { KeyStrip, Portrait, SymbolBadge } from "@/components/art";
import { allPeople, gods, myths } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Home,
});

const doors = [
  { to: "/gods", key: "nav.gods", kind: "circle" },
  { to: "/myths", key: "nav.myths", kind: "scroll" },
  { to: "/thinkers", key: "nav.thinkers", kind: "ask" },
  { to: "/places", key: "nav.places", kind: "map" },
  { to: "/time", key: "nav.time", kind: "steps" },
] as const;

function Home() {
  const { t } = useI18n();
  const navigate = useNavigate();

  function surprise() {
    const pool = [
      ...allPeople.map((person) =>
        person.thinker
          ? ({ to: "/thinkers/$id" as const, params: { id: person.id } })
          : ({ to: "/people/$id" as const, params: { id: person.id } }),
      ),
      ...gods.map((god) => ({ to: "/gods/$id" as const, params: { id: god.id } })),
      ...myths.map((myth) => ({ to: "/myths/$id" as const, params: { id: myth.id } })),
    ];
    const pick = pool[Math.floor(Math.random() * pool.length)]!;
    void navigate(pick);
  }

  return (
    <Shell search={false}>
      <section className="overflow-hidden rounded-[2rem] bg-blue text-white">
        <KeyStrip on="blue" />
        <div className="px-5 py-6 sm:px-8">
          <p className="text-sm font-semibold">{t("ui.ages")}</p>
          <h1 className="mt-1 font-display text-4xl leading-tight sm:text-6xl">Every Greek Ever</h1>
          <p className="mt-2 max-w-md text-lg">{t("home.hero")}</p>
          <div className="mt-5 rounded-3xl bg-card p-3 text-ink">
            <SearchBox large />
          </div>
          <button type="button" onClick={surprise} className="mt-3 min-h-14 w-full rounded-2xl bg-card px-4 text-lg font-bold text-blue">
            {t("ui.surprise")}
            <span className="mt-1 block text-sm font-semibold text-ink">{t("ui.surpriseHelp")}</span>
          </button>
        </div>
        <KeyStrip on="blue" />
      </section>

      <h2 className="mt-8 font-display text-3xl">{t("ui.homeCta")}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {doors.map((door) => (
          <Link
            key={door.to}
            to={door.to}
            className="min-h-28 overflow-hidden rounded-3xl border-2 border-blue bg-card"
          >
            <DoorFace kind={door.kind} label={t(door.key)} />
          </Link>
        ))}
      </div>

      <p className="mt-4 max-w-xl text-lg">{t("pay.homeHint")}</p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <article className="rounded-3xl border-2 border-ink bg-card p-5">
          <p className="text-sm font-bold tracking-wide text-blue">{t("ui.fact")}</p>
          <p className="mt-2 text-xl leading-snug">{t("home.fact")}</p>
        </article>
        <article className="rounded-3xl bg-blue p-5 text-white">
          <p className="text-sm font-bold">{t("ui.story")}</p>
          <p className="mt-2 text-xl leading-snug">{t("home.story")}</p>
        </article>
      </div>
    </Shell>
  );
}

function DoorFace({ kind, label }: { kind: (typeof doors)[number]["kind"]; label: string }) {
  return (
    <span className="flex items-center gap-3 p-4">
      <span className="grid size-16 shrink-0 place-items-center" aria-hidden="true">
        {kind === "circle" ? (
          <SymbolBadge prop="owl" label="" />
        ) : kind === "scroll" ? (
          <img src="/creatures/minotaur.jpg" alt="" className="size-16 rounded-2xl object-cover" />
        ) : kind === "ask" ? (
          <Portrait hair="beard" prop="scroll" frame="ask" label="" />
        ) : kind === "map" ? (
          <Portrait prop="mountain" frame="land" label="" />
        ) : (
          <span className="font-display text-4xl text-blue">1 2 3</span>
        )}
      </span>
      <span className="font-display text-3xl leading-tight">{label}</span>
    </span>
  );
}
