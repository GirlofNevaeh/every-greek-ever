export type Hair = "short" | "long" | "curls" | "beard" | "wreath" | "bun";
export type Prop =
  | "scroll"
  | "owl"
  | "trident"
  | "bolt"
  | "bow"
  | "lyre"
  | "sandals"
  | "hearth"
  | "mask"
  | "flower"
  | "key"
  | "hammer"
  | "dove"
  | "grain"
  | "peacock"
  | "helmet"
  | "triangle"
  | "jar"
  | "wings"
  | "horse"
  | "thread"
  | "column"
  | "ship"
  | "water"
  | "flame"
  | "laurel"
  | "mountain"
  | "maze"
  | "cup"
  | "apple"
  | "track";
export type Frame = "stele" | "tondo" | "frieze" | "ask" | "land";

export type Person = {
  id: string;
  woman: boolean;
  hair: Hair;
  prop: Prop;
  place: string;
  thinker?: boolean;
};

export const people: Person[] = [
  { id: "homer", woman: false, hair: "beard", prop: "scroll", place: "unsure" },
  { id: "sappho", woman: true, hair: "long", prop: "lyre", place: "mytilene" },
  { id: "pericles", woman: false, hair: "wreath", prop: "column", place: "athens" },
  { id: "aspasia", woman: true, hair: "bun", prop: "scroll", place: "athens" },
  { id: "herodotus", woman: false, hair: "beard", prop: "ship", place: "halicarnassus" },
  { id: "hippocrates", woman: false, hair: "beard", prop: "cup", place: "kos" },
  { id: "pythagoras", woman: false, hair: "beard", prop: "triangle", place: "samos", thinker: true },
  { id: "euclid", woman: false, hair: "short", prop: "triangle", place: "alexandria" },
  { id: "archimedes", woman: false, hair: "beard", prop: "water", place: "syracuse" },
  { id: "alexander", woman: false, hair: "wreath", prop: "ship", place: "pella" },
  { id: "leonidas", woman: false, hair: "beard", prop: "helmet", place: "sparta" },
];

export const thinkers: Person[] = [
  { id: "socrates", woman: false, hair: "beard", prop: "scroll", place: "athens", thinker: true },
  { id: "plato", woman: false, hair: "beard", prop: "scroll", place: "athens", thinker: true },
  { id: "aristotle", woman: false, hair: "beard", prop: "scroll", place: "athens", thinker: true },
];

export const allPeople: Person[] = [...people, ...thinkers];

export type God = { id: string; woman: boolean; hair: Hair; prop: Prop };

export const gods: God[] = [
  { id: "zeus", woman: false, hair: "beard", prop: "bolt" },
  { id: "hera", woman: true, hair: "bun", prop: "peacock" },
  { id: "poseidon", woman: false, hair: "beard", prop: "trident" },
  { id: "demeter", woman: true, hair: "long", prop: "grain" },
  { id: "athena", woman: true, hair: "bun", prop: "owl" },
  { id: "apollo", woman: false, hair: "wreath", prop: "lyre" },
  { id: "artemis", woman: true, hair: "long", prop: "bow" },
  { id: "ares", woman: false, hair: "short", prop: "helmet" },
  { id: "aphrodite", woman: true, hair: "long", prop: "dove" },
  { id: "hephaestus", woman: false, hair: "beard", prop: "hammer" },
  { id: "hermes", woman: false, hair: "short", prop: "sandals" },
  { id: "hestia", woman: true, hair: "bun", prop: "hearth" },
  { id: "dionysus", woman: false, hair: "wreath", prop: "mask" },
  { id: "hades", woman: false, hair: "beard", prop: "key" },
  { id: "persephone", woman: true, hair: "long", prop: "flower" },
];

export type Myth = { id: string; prop: Prop; lines: number };

export const myths: Myth[] = [
  { id: "pandora", prop: "jar", lines: 5 },
  { id: "icarus", prop: "wings", lines: 5 },
  { id: "seasons", prop: "flower", lines: 6 },
  { id: "maze", prop: "thread", lines: 5 },
  { id: "heracles", prop: "apple", lines: 5 },
  { id: "horse", prop: "horse", lines: 5 },
  { id: "odysseus", prop: "ship", lines: 5 },
  { id: "midas", prop: "cup", lines: 5 },
  { id: "arachne", prop: "scroll", lines: 4 },
  { id: "prometheus", prop: "flame", lines: 4 },
];

export type Place = { id: string; x: number; y: number; prop: Prop; far?: boolean };

/** Map dots use the SVG viewBox 0 0 640 860. */
export const places: Place[] = [
  { id: "pella", x: 250, y: 100, prop: "laurel" },
  { id: "olympus", x: 320, y: 145, prop: "mountain" },
  { id: "delphi", x: 250, y: 255, prop: "column" },
  { id: "thebes", x: 315, y: 285, prop: "column" },
  { id: "athens", x: 365, y: 330, prop: "column" },
  { id: "corinth", x: 275, y: 345, prop: "ship" },
  { id: "epidaurus", x: 325, y: 400, prop: "mask" },
  { id: "olympia", x: 185, y: 420, prop: "track" },
  { id: "sparta", x: 235, y: 490, prop: "helmet" },
  { id: "mytilene", x: 490, y: 230, prop: "lyre" },
  { id: "troy", x: 575, y: 115, prop: "horse" },
  { id: "delos", x: 455, y: 370, prop: "lyre" },
  { id: "samos", x: 540, y: 330, prop: "triangle" },
  { id: "kos", x: 555, y: 410, prop: "cup" },
  { id: "rhodes", x: 560, y: 510, prop: "column" },
  { id: "knossos", x: 370, y: 760, prop: "maze" },
  { id: "syracuse", x: 70, y: 640, prop: "water", far: true },
  { id: "alexandria", x: 110, y: 800, prop: "scroll", far: true },
];

export const eras = [
  { id: "crete", yearKey: "time.crete.year" },
  { id: "walls", yearKey: "time.walls.year" },
  { id: "quiet", yearKey: "time.quiet.year" },
  { id: "games", yearKey: "time.games.year" },
  { id: "vote", yearKey: "time.vote.year" },
  { id: "parthenon", yearKey: "time.parthenon.year" },
  { id: "trial", yearKey: "time.trial.year" },
  { id: "travel", yearKey: "time.travel.year" },
  { id: "shapes", yearKey: "time.shapes.year" },
  { id: "rome", yearKey: "time.rome.year" },
] as const;

export const projectGroups = ["make", "ask", "move", "measure", "tell", "look"] as const;
export type ProjectGroup = (typeof projectGroups)[number];

export const projects: { id: string; group: ProjectGroup }[] = [
  ...Array.from({ length: 16 }, (_, i) => ({ id: `p${String(i + 1).padStart(2, "0")}`, group: "make" as const })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `p${String(i + 17).padStart(2, "0")}`, group: "ask" as const })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `p${String(i + 27).padStart(2, "0")}`, group: "move" as const })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `p${String(i + 35).padStart(2, "0")}`, group: "measure" as const })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `p${String(i + 45).padStart(2, "0")}`, group: "tell" as const })),
  ...Array.from({ length: 9 }, (_, i) => ({ id: `p${String(i + 55).padStart(2, "0")}`, group: "look" as const })),
];

export const NAV = [
  { to: "/", key: "nav.home" },
  { to: "/people", key: "nav.people" },
  { to: "/gods", key: "nav.gods" },
  { to: "/myths", key: "nav.myths" },
  { to: "/thinkers", key: "nav.thinkers" },
  { to: "/places", key: "nav.places" },
  { to: "/time", key: "nav.time" },
  { to: "/quiz", key: "nav.quiz" },
  { to: "/work", key: "nav.work" },
] as const;

export function nice(id: string) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

export function personHref(id: string): { to: "/thinkers/$id" | "/people/$id"; params: { id: string } } {
  if (thinkers.some((t) => t.id === id)) return { to: "/thinkers/$id", params: { id } };
  return { to: "/people/$id", params: { id } };
}

export function neighbors<T extends { id: string }>(list: T[], id: string) {
  const i = list.findIndex((item) => item.id === id);
  return {
    prev: i > 0 ? list[i - 1] : undefined,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined,
  };
}
