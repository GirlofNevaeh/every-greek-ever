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
        className="mt-5 grid gap-4 rounded-[2rem] border-2 border-blue bg-card p-4 sm:grid-cols-[180px_1fr]"
      >
        <Portrait hair={first.hair} woman={first.woman} prop={first.prop} label={nice(first.id)} />
        <span>
          <span className="inline-block rounded-full bg-blue px-3 py-1 text-sm font-bold text-white">{t(`person.${first.id}.years`)}</span>
          <span className="mt-3 block font-display text-4xl">{nice(first.id)}</span>
          <span className="mt-2 block text-lg">{t(`person.${first.id}.role`)}</span>
        </span>
      </Link>
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-3xl border-2 border-blue bg-card">
        {rest.map((person) => {
          const link = personHref(person.id);
          return (
            <li key={person.id}>
              <Link to={link.to} params={link.params} className="grid min-h-16 grid-cols-[88px_1fr_auto] items-center gap-3 px-3 py-2">
                <span className="text-sm font-bold break-words">{t(`person.${person.id}.years`)}</span>
                <span className="min-w-0">
                  <span className="block font-display text-2xl leading-tight">{nice(person.id)}</span>
                  <span className="block text-sm break-words">{t(`person.${person.id}.role`)}</span>
                </span>
                <span className="size-14">
                  <Portrait hair={person.hair} woman={person.woman} prop={person.prop} frame="tondo" label="" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}
