import { createFileRoute } from "@tanstack/react-router";
import { Pager, PersonFacts, Shell, Why } from "@/components/shell";
import { Portrait } from "@/components/art";
import { neighbors, nice, thinkers } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/thinkers/$id")({
  component: ThinkerPage,
});

function ThinkerPage() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const person = thinkers.find((item) => item.id === id);
  if (!person) {
    return (
      <Shell>
        <h1 className="font-display text-4xl">{t("ui.missing")}</h1>
      </Shell>
    );
  }
  const { prev, next } = neighbors(thinkers, id);
  return (
    <Shell>
      <p className="text-sm font-bold">{t("ui.realPerson")}</p>
      <h1 className="mt-2 font-display text-5xl leading-none">{nice(person.id)}</h1>
      <p className="mt-2 text-lg">{t("thinkers.intro")}</p>
      <div className="mt-4 grid grid-cols-[7.5rem_1fr] items-start gap-3 sm:grid-cols-[11rem_1fr]">
        <Portrait hair={person.hair} woman={false} prop={person.prop} frame="ask" label={nice(person.id)} />
        <div>
          <p className="w-fit rounded-full bg-blue px-3 py-1 text-sm font-bold text-white">{t(`person.${person.id}.years`)}</p>
          <p className="mt-3 text-xl">{t(`person.${person.id}.role`)}</p>
        </div>
      </div>
      <p className="mt-4 text-sm font-bold">{t("ui.remember")}</p>
      <PersonFacts id={person.id} />
      <div className="mt-4 grid gap-2">
        {["think.q.friend", "think.q.fair", "think.q.true"].map((key) => (
          <p key={key} className="text-lg font-semibold">
            {t(key)}
          </p>
        ))}
      </div>
      <Why k={`person.${person.id}.why`} />
      <Pager
        prev={prev ? { to: "/thinkers/$id", id: prev.id, label: nice(prev.id) } : undefined}
        next={next ? { to: "/thinkers/$id", id: next.id, label: nice(next.id) } : undefined}
      />
    </Shell>
  );
}
