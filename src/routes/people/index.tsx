import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Portrait } from "@/components/art";
import { allPeople, nice, personHref } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/people/")({
  component: PeoplePage,
});

function PeoplePage() {
  const { t } = useI18n();
  const [first, ...rest] = allPeople;
  if (!first) return null;
  const href = personHref(first.id);
  return (
    <Shell>
      <h1 className="font-display text-4xl">{t("nav.people")}</h1>
      <p className="mt-2 max-w-xl text-lg">{t("people.intro")}</p>
      <Link
        to={href.to}
        params={href.params}
        className="mt-5 grid grid-cols-[7.5rem_1fr] items-center gap-3 rounded-[2rem] border-2 border-blue bg-card p-4 sm:grid-cols-[11rem_1fr] sm:gap-4"
      >
        <Portrait hair={first.hair} woman={first.woman} prop={first.prop} label={nice(first.id)} />
        <span>
          <span className="inline-block rounded-full bg-blue px-3 py-1 text-sm font-bold text-white">{t(`person.${first.id}.years`)}</span>
          <span className="mt-3 block font-display text-4xl">{nice(first.id)}</span>
          <span className="mt-2 block text-lg">{t(`person.${first.id}.role`)}</span>
          <span className="mt-2 block text-base">{t(`person.${first.id}.c`)}</span>
        </span>
      </Link>
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-3xl border-2 border-blue bg-card">
        {rest.map((person) => {
          const link = personHref(person.id);
          return (
            <li key={person.id}>
              <Link to={link.to} params={link.params} className="flex min-h-16 items-center gap-3 px-3 py-3">
                <span className="grid size-14 shrink-0 place-items-center overflow-hidden">
                  <span className="w-14">
                    <Portrait hair={person.hair} woman={person.woman} prop={person.prop} frame="tondo" label="" />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-2xl leading-tight">{nice(person.id)}</span>
                  <span className="block text-sm break-words">{t(`person.${person.id}.role`)}</span>
                  <span className="mt-1 block text-sm break-words">{t(`person.${person.id}.c`)}</span>
                  <span className="mt-1 block text-sm font-bold text-blue">{t(`person.${person.id}.years`)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}
