import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { allPeople, gods, myths, nice, places, thinkers } from "@/data/catalog";
import { en } from "@/data/en";
import { useI18n } from "@/lib/i18n";

type Dest = {
  label: string;
  hay: string;
  to: "/people/$id" | "/thinkers/$id" | "/gods/$id" | "/myths/$id" | "/places/$id";
  params: { id: string };
};

const EXTRA: Record<string, string> = {
  homer: "iliad odyssey poet",
  sappho: "lesbos poems",
  athena: "owl minerva wisdom",
  zeus: "jupiter lightning",
  poseidon: "neptune trident sea",
  hera: "juno peacock",
  ares: "mars",
  aphrodite: "venus dove",
  hermes: "mercury sandals",
  artemis: "diana bow",
  apollo: "lyre",
  hades: "pluto underworld",
  dionysus: "theatre theater mask",
  hephaestus: "vulcan hammer",
  heracles: "hercules tasks",
  odysseus: "ulysses ithaca cyclops",
  horse: "trojan troy wooden",
  maze: "theseus minotaur labyrinth crete",
  icarus: "daedalus wings wax",
  pandora: "jar hope",
  midas: "gold",
  prometheus: "fire",
  seasons: "persephone demeter spring winter",
  arachne: "spider",
  athens: "parthenon",
  olympia: "olympic games",
  alexandria: "library euclid",
  pythagoras: "triangle maths math",
};

function norm(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function SearchBox({ large = false }: { large?: boolean }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [q, setQ] = useState("");
  const [note, setNote] = useState("");
  const [hits, setHits] = useState<Dest[]>([]);

  const items = useMemo<Dest[]>(() => {
    const out: Dest[] = [];
    for (const person of allPeople) {
      const to = thinkers.some((item) => item.id === person.id) ? "/thinkers/$id" : "/people/$id";
      out.push({
        label: nice(person.id),
        to,
        params: { id: person.id },
        hay: norm(
          `${person.id} ${nice(person.id)} ${["role", "a", "b", "c", "d", "e"].map((part) => en[`person.${person.id}.${part}`] ?? "").join(" ")} ${t(`person.${person.id}.role`)} ${EXTRA[person.id] ?? ""}`,
        ),
      });
    }
    for (const god of gods) {
      out.push({
        label: nice(god.id),
        to: "/gods/$id",
        params: { id: god.id },
        hay: norm(`${god.id} ${nice(god.id)} ${en[`god.${god.id}.job`] ?? ""} ${en[`god.${god.id}.sign`] ?? ""} ${t(`god.${god.id}.sign`)} ${EXTRA[god.id] ?? ""}`),
      });
    }
    for (const myth of myths) {
      out.push({
        label: t(`myth.${myth.id}.title`),
        to: "/myths/$id",
        params: { id: myth.id },
        hay: norm(`${myth.id} ${en[`myth.${myth.id}.title`] ?? ""} ${t(`myth.${myth.id}.title`)} ${EXTRA[myth.id] ?? ""}`),
      });
    }
    for (const place of places) {
      out.push({
        label: nice(place.id),
        to: "/places/$id",
        params: { id: place.id },
        hay: norm(`${place.id} ${nice(place.id)} ${en[`place.${place.id}.a`] ?? ""} ${EXTRA[place.id] ?? ""}`),
      });
    }
    return out;
  }, [t]);

  function go(dest: Dest) {
    setHits([]);
    setNote("");
    setQ("");
    void navigate({ to: dest.to, params: dest.params });
  }

  function run(raw: string) {
    const query = norm(raw);
    if (query.length < 2) {
      setHits([]);
      setNote(t("ui.typeMore"));
      return;
    }
    const ranked = items
      .map((item) => {
        let score = 0;
        if (norm(item.label) === query) score = 100;
        else if (norm(item.label).startsWith(query)) score = 90;
        else if (item.hay.split(" ").includes(query)) score = 75;
        else if (item.hay.includes(query)) score = 55;
        return { item, score };
      })
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score);
    if (!ranked.length) {
      setHits([]);
      setNote(t("ui.noMatch"));
      return;
    }
    const top = ranked[0]!;
    const second = ranked[1];
    if (!second || top.score > second.score) {
      go(top.item);
      return;
    }
    setNote(t("ui.many"));
    setHits(ranked.slice(0, 6).map((row) => row.item));
  }

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const onNative = (event: Event) => {
      event.preventDefault();
      const data = new FormData(form);
      run(String(data.get("q") ?? ""));
    };
    form.addEventListener("submit", onNative);
    return () => form.removeEventListener("submit", onNative);
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(String(new FormData(event.currentTarget).get("q") ?? q));
  }

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} className="flex gap-2" role="search">
        <label className="sr-only" htmlFor={large ? "search-home" : "search-all"}>
          {t("ui.search")}
        </label>
        <input
          id={large ? "search-home" : "search-all"}
          name="q"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder={t("ui.searchPlaceholder")}
          autoComplete="off"
          enterKeyHint="search"
          className={`min-w-0 flex-1 rounded-2xl border-2 border-blue bg-card px-4 text-ink ${large ? "min-h-14 text-lg" : "min-h-12 text-base"}`}
        />
        <button
          type="submit"
          className={`shrink-0 rounded-2xl bg-blue px-4 font-bold text-white ${large ? "min-h-14 text-base" : "min-h-12 text-sm"}`}
        >
          {t("ui.search")}
        </button>
      </form>
      {note ? <p className="mt-2 text-base">{note}</p> : null}
      {hits.length ? (
        <ul className="mt-2 grid gap-2">
          {hits.map((hit) => (
            <li key={`${hit.to}-${hit.params.id}`}>
              <button type="button" onClick={() => go(hit)} className="min-h-12 w-full rounded-2xl border-2 border-blue bg-card px-4 text-left font-semibold break-words">
                {hit.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
