import { createFileRoute } from "@tanstack/react-router";
import { Pager, Shell, Why } from "@/components/shell";
import { Portrait } from "@/components/art";
import { neighbors, nice, people } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/people/$id")({
  component: PersonPage,
});

function PersonPage() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const person = people.find((item) => item.id === id);
  if (!person) {
    return (
      <Shell>
        <h1 className="font-display text-4xl">{t("ui.missing")}</h1>
        <p className="mt-2">{t("ui.missingHelp")}</p>
      </Shell>
    );
  }
  const { prev, next } = neighbors(people, id);
  return (
    <Shell>
      <p className="text-sm font-bold text-blue">{t("ui.realPerson")}</p>
      <div className="mt-3 grid grid-cols-[7.5rem_1fr] items-start gap-3 sm:grid-cols-[11rem_1fr] md:grid-cols-[15rem_1fr]">
        <Portrait hair={person.hair} woman={person.woman} prop={person.prop} frame="stele" label={nice(person.id)} />
        <div>
          <p className="inline-block rounded-full bg-blue px-3 py-1 text-sm font-bold text-white">{t("ui.years")}: {t(`person.${person.id}.years`)}</p>
          <h1 className="mt-3 font-display text-5xl leading-none">{nice(person.id)}</h1>
          <p className="mt-3 text-xl">{t(`person.${person.id}.role`)}</p>
          <div className="mt-4 grid gap-3">
            <p className="rounded-2xl border-2 border-ink bg-card p-4 text-lg">{t(`person.${person.id}.a`)}</p>
            <p className="rounded-2xl border-2 border-blue bg-paper p-4 text-lg">{t(`person.${person.id}.b`)}</p>
          </div>
          <p className="mt-3 text-sm font-bold">{t("ui.remember")}</p>
          {person.id === "pythagoras" ? (
            <div className="mt-4 rounded-3xl bg-blue p-4 text-white">
              <p className="text-sm font-bold">{t("ui.rule")}</p>
              <p className="mt-2 text-lg">{t("person.pythagoras.rule")}</p>
            </div>
          ) : null}
          <Why k={`person.${person.id}.why`} />
        </div>
      </div>
      <Pager
        prev={prev ? { to: "/people/$id", id: prev.id, label: nice(prev.id) } : undefined}
        next={next ? { to: "/people/$id", id: next.id, label: nice(next.id) } : undefined}
      />
    </Shell>
  );
}
