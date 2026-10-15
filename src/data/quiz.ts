import { allPeople, eras, gods, myths, places } from "./catalog";

export type Topic = "people" | "gods" | "myths" | "thinkers" | "places" | "time" | "mix";

export type Q = {
  id: string;
  topic: Topic;
  prompt: string;
  pv?: Record<string, string>;
  choices: [string, string, string];
  answer: 0 | 1 | 2;
  why: string;
  wv?: Record<string, string>;
};

function nice(id: string) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function placeChoices(correct: string, wrongs: string[], i: number) {
  const answer = (i % 3) as 0 | 1 | 2;
  const choices = ["", "", ""] as [string, string, string];
  choices[answer] = correct;
  let w = 0;
  for (let s = 0; s < 3; s++) if (s !== answer) choices[s] = wrongs[w++] ?? wrongs[0]!;
  return { choices, answer };
}

const list: Q[] = [];

function push(partial: Omit<Q, "id">) {
  list.push({ ...partial, id: `q${list.length + 1}` });
}

for (const [i, god] of gods.entries()) {
  const name = nice(god.id);
  const others = gods.filter((g) => g.id !== god.id);
  const w1 = others[i % others.length]!;
  const w2 = others[(i + 5) % others.length]!;
  const packed = placeChoices(`#god.${god.id}.sign`, [`#god.${w1.id}.sign`, `#god.${w2.id}.sign`], list.length);
  push({
    topic: "gods",
    prompt: "q.whichSign",
    pv: { name },
    ...packed,
    why: "q.whichSign.why",
    wv: { name, sign: `#god.${god.id}.sign` },
  });
}

for (const [i, god] of gods.entries()) {
  const name = nice(god.id);
  const packed = placeChoices("ui.no", ["ui.yes", "ui.notSure"], list.length + i);
  push({
    topic: "gods",
    prompt: "q.realNo",
    pv: { name },
    ...packed,
    why: "q.realNo.why",
    wv: { name },
  });
}

for (const [i, god] of gods.entries()) {
  const name = nice(god.id);
  const others = gods.filter((g) => g.id !== god.id);
  const packed = placeChoices(
    `#god.${god.id}.job`,
    [`#god.${others[i % others.length]!.id}.job`, `#god.${others[(i + 4) % others.length]!.id}.job`],
    list.length,
  );
  push({
    topic: "gods",
    prompt: "q.job",
    pv: { name },
    ...packed,
    why: "q.job.why",
    wv: { name, job: `#god.${god.id}.job` },
  });
}

for (const [i, god] of gods.entries()) {
  const name = nice(god.id);
  const others = gods.filter((g) => g.id !== god.id);
  const packed = placeChoices(`@${name}`, [`@${nice(others[i % others.length]!.id)}`, `@${nice(others[(i + 6) % others.length]!.id)}`], list.length);
  push({
    topic: "gods",
    prompt: "q.whoSign",
    pv: { sign: `#god.${god.id}.sign` },
    ...packed,
    why: "q.whoSign.why",
    wv: { name },
  });
}

for (const [i, god] of gods.entries()) {
  const name = nice(god.id);
  const others = gods.filter((g) => g.id !== god.id);
  const packed = placeChoices(`@${name}`, [`@${nice(others[(i + 2) % others.length]!.id)}`, `@${nice(others[(i + 7) % others.length]!.id)}`], list.length);
  push({
    topic: "gods",
    prompt: "q.whoJob",
    pv: { job: `#god.${god.id}.job` },
    ...packed,
    why: "q.whoJob.why",
    wv: { name, job: `#god.${god.id}.job` },
  });
}

for (const person of allPeople) {
  const name = nice(person.id);
  const packed = placeChoices("ui.yes", ["ui.no", "ui.notSure"], list.length);
  push({
    topic: person.thinker ? "thinkers" : "people",
    prompt: "q.realYes",
    pv: { name },
    ...packed,
    why: "q.realYes.why",
    wv: { name },
  });
}

const placeByPerson: Record<string, string> = {
  sappho: "Mytilene",
  pericles: "Athens",
  aspasia: "Athens",
  herodotus: "Halicarnassus",
  hippocrates: "Kos",
  pythagoras: "Samos",
  euclid: "Alexandria",
  archimedes: "Syracuse",
  alexander: "Pella",
  leonidas: "Sparta",
  socrates: "Athens",
  plato: "Athens",
  aristotle: "Athens",
};

const placePool = ["Athens", "Sparta", "Olympia", "Delphi", "Kos", "Samos", "Troy", "Crete"];

for (const [i, person] of allPeople.entries()) {
  const name = nice(person.id);
  if (person.id === "homer") {
    const packed = placeChoices("ui.notSure", ["@Athens", "@Sparta"], list.length);
    push({
      topic: "people",
      prompt: "q.place",
      pv: { name },
      ...packed,
      why: "q.homerYear.why",
    });
    continue;
  }
  const correct = placeByPerson[person.id] ?? "Athens";
  const wrongs = placePool.filter((p) => p !== correct);
  const packed = placeChoices(`@${correct}`, [`@${wrongs[i % wrongs.length]}`, `@${wrongs[(i + 3) % wrongs.length]}`], list.length);
  push({
    topic: person.thinker ? "thinkers" : "people",
    prompt: "q.place",
    pv: { name },
    ...packed,
    why: "q.place.why",
    wv: { name, place: correct },
  });
}

for (const [i, person] of allPeople.entries()) {
  const name = nice(person.id);
  const others = allPeople.filter((p) => p.id !== person.id);
  const packed = placeChoices(
    `#person.${person.id}.a`,
    [`#person.${others[i % others.length]!.id}.a`, `#person.${others[(i + 3) % others.length]!.id}.a`],
    list.length,
  );
  push({
    topic: person.thinker ? "thinkers" : "people",
    prompt: "q.trueLine",
    pv: { name },
    ...packed,
    why: "q.trueLine.why",
    wv: { line: `#person.${person.id}.a` },
  });
}

for (const myth of myths) {
  const packed = placeChoices("ui.no", ["ui.yes", "ui.notSure"], list.length);
  push({
    topic: "myths",
    prompt: "q.isStory",
    pv: { title: `#myth.${myth.id}.title` },
    ...packed,
    why: "q.isStory.why",
  });
}

for (const [i, myth] of myths.entries()) {
  const others = myths.filter((m) => m.id !== myth.id);
  const packed = placeChoices(
    `#myth.${myth.id}.2`,
    [`#myth.${others[i % others.length]!.id}.2`, `#myth.${others[(i + 3) % others.length]!.id}.2`],
    list.length,
  );
  push({
    topic: "myths",
    prompt: "q.mythNext",
    pv: { bit: `#myth.${myth.id}.1` },
    ...packed,
    why: "q.mythNext.why",
    wv: { next: `#myth.${myth.id}.2` },
  });
}

for (const place of places) {
  const name = nice(place.id);
  const packed = placeChoices("ui.yes", ["ui.no", "ui.notSure"], list.length);
  push({
    topic: "places",
    prompt: "q.placeReal",
    pv: { place: name },
    ...packed,
    why: "q.placeReal.why",
    wv: { place: name },
  });
}

for (const [i, place] of places.entries()) {
  const name = nice(place.id);
  const others = places.filter((p) => p.id !== place.id);
  const packed = placeChoices(
    `@${name}`,
    [`@${nice(others[i % others.length]!.id)}`, `@${nice(others[(i + 5) % others.length]!.id)}`],
    list.length,
  );
  push({
    topic: "places",
    prompt: "q.whichPlace",
    pv: { sentence: `#place.${place.id}.a` },
    ...packed,
    why: "q.whichPlace.why",
    wv: { place: name },
  });
}

for (const [i, era] of eras.entries()) {
  const others = eras.filter((e) => e.id !== era.id);
  const packed = placeChoices(
    `#time.${era.id}.title`,
    [`#time.${others[i % others.length]!.id}.title`, `#time.${others[(i + 4) % others.length]!.id}.title`],
    list.length,
  );
  push({
    topic: "time",
    prompt: "q.era",
    pv: { year: `#${era.yearKey}` },
    ...packed,
    why: "q.era.why",
    wv: { year: `#${era.yearKey}`, title: `#time.${era.id}.title` },
  });
}

for (let i = 0; i < eras.length - 1; i++) {
  const early = eras[i]!;
  const later = eras[i + 1]!;
  const decoy = eras[i + 2 < eras.length ? i + 2 : i - 1]!;
  const first = eras.indexOf(decoy) < i ? decoy : early;
  const second = first === early ? later : early;
  const wrongs = [early, later, decoy].filter((era) => era !== first).map((era) => `#${era.yearKey}`);
  const packed = placeChoices(`#${first.yearKey}`, wrongs, i);
  push({
    topic: "time",
    prompt: "q.earlier",
    ...packed,
    why: "q.earlier.why",
    wv: { early: `#${first.yearKey}`, later: `#${second.yearKey}` },
  });
}

const fixed: Omit<Q, "id">[] = [
  { topic: "mix", prompt: "q.phil", choices: ["opt.loving", "opt.horses", "opt.ships"], answer: 0, why: "q.phil.why" },
  { topic: "thinkers", prompt: "q.tri", choices: ["opt.five", "opt.six", "opt.seven"], answer: 0, why: "q.tri.why" },
  { topic: "thinkers", prompt: "q.five", choices: ["opt.side5", "opt.side9", "opt.side25"], answer: 0, why: "q.five.why" },
  { topic: "people", prompt: "q.alex", choices: ["opt.egypt", "opt.street", "opt.moon"], answer: 0, why: "q.alex.why" },
  { topic: "people", prompt: "q.leon", choices: ["opt.sailor", "opt.king", "opt.baker"], answer: 1, why: "q.leon.why" },
  { topic: "people", prompt: "q.homerYear", choices: ["opt.notSure", "opt.year1", "opt.always"], answer: 0, why: "q.homerYear.why" },
  { topic: "people", prompt: "q.euclidYear", choices: ["opt.year100", "opt.notSure", "opt.year1"], answer: 1, why: "q.euclidYear.why" },
  { topic: "people", prompt: "q.doc", choices: ["opt.race", "opt.hide", "opt.help"], answer: 2, why: "q.doc.why" },
  { topic: "gods", prompt: "q.dio", choices: ["opt.theatre", "opt.wine", "opt.farmOnly"], answer: 0, why: "q.dio.why" },
  { topic: "gods", prompt: "q.hades", choices: ["opt.market", "opt.under", "opt.cloud"], answer: 1, why: "q.hades.why" },
  { topic: "gods", prompt: "q.ares", choices: ["opt.cook", "opt.danceOnly", "opt.war"], answer: 2, why: "q.ares.why" },
  { topic: "gods", prompt: "q.bird", choices: ["opt.eagle", "opt.owl", "opt.cat"], answer: 1, why: "q.bird.why" },
  { topic: "myths", prompt: "q.season", choices: ["opt.seasons", "opt.tides", "opt.names"], answer: 0, why: "q.season.why" },
  { topic: "myths", prompt: "q.wax", choices: ["opt.higher", "opt.landed", "opt.wax"], answer: 2, why: "q.wax.why" },
  { topic: "myths", prompt: "q.fire", choices: ["opt.fire", "opt.gold", "opt.maps"], answer: 0, why: "q.fire.why" },
  { topic: "myths", prompt: "q.hope", choices: ["opt.shoes", "opt.hope", "opt.songs"], answer: 1, why: "q.hope.why" },
  { topic: "myths", prompt: "q.thread", choices: ["opt.whistle", "opt.horseRide", "opt.thread"], answer: 2, why: "q.thread.why" },
  { topic: "myths", prompt: "q.trick", choices: ["opt.trick", "opt.gift", "opt.ship"], answer: 0, why: "q.trick.why" },
  { topic: "myths", prompt: "q.food", choices: ["opt.sing", "opt.eat", "opt.rain"], answer: 1, why: "q.food.why" },
  { topic: "myths", prompt: "q.spider", choices: ["opt.bird", "opt.tree", "opt.spider"], answer: 2, why: "q.spider.why" },
  { topic: "myths", prompt: "q.away", choices: ["opt.away", "opt.stay", "opt.sleep"], answer: 0, why: "q.away.why" },
  { topic: "myths", prompt: "q.river", choices: ["opt.broom", "opt.wash", "opt.left"], answer: 1, why: "q.river.why" },
  { topic: "myths", prompt: "q.skyHold", choices: ["opt.hermes", "opt.hestia", "opt.atlas"], answer: 2, why: "q.skyHold.why" },
  { topic: "time", prompt: "q.vote", choices: ["opt.someMen", "opt.everyone", "opt.noOne"], answer: 0, why: "q.vote.why" },
  { topic: "places", prompt: "q.games", choices: ["opt.sparta", "opt.olympia", "opt.kos"], answer: 1, why: "q.games.why" },
  { topic: "time", prompt: "q.gamesYear", choices: ["opt.y1", "opt.y2000", "opt.y776"], answer: 2, why: "q.gamesYear.why" },
  { topic: "time", prompt: "q.rome", choices: ["opt.romeRules", "opt.romeGone", "opt.romeGames"], answer: 0, why: "q.rome.why" },
  { topic: "places", prompt: "q.parthenon", choices: ["opt.troy", "opt.athens", "opt.crete"], answer: 1, why: "q.parthenon.why" },
  { topic: "thinkers", prompt: "q.ask", choices: ["opt.build", "opt.sailOnly", "opt.questions"], answer: 2, why: "q.ask.why" },
  { topic: "thinkers", prompt: "q.fairQ", choices: ["opt.fair", "opt.fastest", "opt.loudest"], answer: 0, why: "q.fairQ.why" },
  { topic: "thinkers", prompt: "q.academy", choices: ["opt.homer", "opt.plato", "opt.sappho"], answer: 1, why: "q.academy.why" },
  { topic: "thinkers", prompt: "q.animals", choices: ["opt.zeus", "opt.hera", "opt.aristotle"], answer: 2, why: "q.animals.why" },
  { topic: "thinkers", prompt: "q.maths", choices: ["opt.numbers", "opt.crowns", "opt.fishing"], answer: 0, why: "q.maths.why" },
  { topic: "thinkers", prompt: "q.wisdom", choices: ["opt.theatreWord", "opt.philosophy", "opt.columnWord"], answer: 1, why: "q.wisdom.why" },
  { topic: "people", prompt: "q.shapes", choices: ["opt.leonidas", "opt.euclid", "opt.sappho"], answer: 1, why: "q.shapes.why" },
  { topic: "people", prompt: "q.water", choices: ["opt.archimedes", "opt.pericles", "opt.aspasia"], answer: 0, why: "q.water.why" },
  { topic: "people", prompt: "q.poems", choices: ["opt.homer", "opt.sappho", "opt.euclid"], answer: 1, why: "q.poems.why" },
  { topic: "people", prompt: "q.long", choices: ["opt.aspasia", "opt.leonidas", "opt.homer"], answer: 2, why: "q.long.why" },
  { topic: "people", prompt: "q.spoke", choices: ["opt.pericles", "opt.herodotus", "opt.sappho"], answer: 0, why: "q.spoke.why" },
  { topic: "people", prompt: "q.known", choices: ["opt.hera", "opt.aspasia", "opt.artemis"], answer: 1, why: "q.known.why" },
  { topic: "people", prompt: "q.heard", choices: ["opt.zeus", "opt.plato", "opt.herodotus"], answer: 2, why: "q.heard.why" },
  { topic: "mix", prompt: "q.homeFact", choices: ["opt.storyOlive", "opt.factTemple", "opt.factGames"], answer: 1, why: "q.homeFact.why" },
  { topic: "mix", prompt: "q.homeStory", choices: ["opt.storyOlive", "opt.factTemple", "opt.factGames"], answer: 0, why: "q.homeStory.why" },
  { topic: "mix", prompt: "q.olive", choices: ["opt.lion", "opt.shipGift", "opt.olive"], answer: 2, why: "q.olive.why" },
  { topic: "gods", prompt: "q.neighbour", choices: ["opt.yesGods", "opt.noGods", "opt.maybeGods"], answer: 1, why: "q.neighbour.why" },
  { topic: "places", prompt: "q.crete", choices: ["opt.lesbos", "opt.sicily", "opt.knossosIsle"], answer: 2, why: "q.crete.why" },
  { topic: "places", prompt: "q.named", choices: ["opt.alexander", "opt.poseidon", "opt.homer"], answer: 0, why: "q.named.why" },
  { topic: "mix", prompt: "q.hopeCity", choices: ["opt.factTemple", "opt.storyOlive", "opt.factGames"], answer: 1, why: "q.hopeCity.why" },
  { topic: "gods", prompt: "q.mask", choices: ["opt.dionysus", "opt.ares", "opt.hades"], answer: 0, why: "q.mask.why" },
  { topic: "gods", prompt: "q.sand", choices: ["opt.apollo", "opt.hermesName", "opt.hestiaName"], answer: 1, why: "q.sand.why" },
  { topic: "gods", prompt: "q.hearth", choices: ["opt.demeter", "opt.ares", "opt.hestiaName"], answer: 2, why: "q.hearth.why" },
  { topic: "people", prompt: "q.notSureWord", choices: ["opt.tuesday", "opt.notSure", "opt.always"], answer: 1, why: "q.notSureWord.why" },
];

for (const item of fixed) push(item);

const factPool: { line: string; fact: boolean }[] = [
  { line: "sheet.fact1", fact: true },
  { line: "sheet.fact2", fact: true },
  { line: "sheet.fact5", fact: true },
  { line: "person.euclid.a", fact: true },
  { line: "person.leonidas.a", fact: true },
  { line: "place.olympia.a", fact: true },
  { line: "myth.pandora.1", fact: false },
  { line: "myth.icarus.1", fact: false },
  { line: "myth.horse.1", fact: false },
  { line: "myth.prometheus.1", fact: false },
  { line: "home.story", fact: false },
  { line: "myth.midas.1", fact: false },
];

let guard = 0;
while (list.length < 250 && guard < 40) {
  const a = factPool[guard % factPool.length]!;
  const b = factPool[(guard + 3) % factPool.length]!;
  const c = factPool[(guard + 7) % factPool.length]!;
  const trio = [a, b, c];
  if (new Set(trio.map((t) => t.line)).size < 3 || trio.filter((t) => t.fact).length !== 1) {
    guard++;
    continue;
  }
  const answer = trio.findIndex((t) => t.fact) as 0 | 1 | 2;
  push({
    topic: "mix",
    prompt: "q.whichFact",
    choices: [trio[0]!.line, trio[1]!.line, trio[2]!.line],
    answer,
    why: "q.whichFact.why",
    wv: { line: `#${trio[answer]!.line}` },
  });
  guard++;
}

export const questions: Q[] = list.slice(0, 250);
