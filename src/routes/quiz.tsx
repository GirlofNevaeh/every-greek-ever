import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { questions, type Q, type Topic } from "@/data/quiz";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
});

const topicKeys: Array<Topic | "all"> = ["all", "people", "gods", "myths", "thinkers", "places", "time", "mix"];

function resolveVars(t: (key: string) => string, vars?: Record<string, string>) {
  if (!vars) return undefined;
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars)) {
    if (value.startsWith("#")) out[key] = t(value.slice(1));
    else if (value.startsWith("@")) out[key] = value.slice(1);
    else out[key] = value;
  }
  return out;
}

function textOf(t: (key: string, vars?: Record<string, string>) => string, token: string, vars?: Record<string, string>) {
  if (token.startsWith("@")) return token.slice(1);
  if (token.startsWith("#")) return t(token.slice(1));
  return t(token, vars);
}

function QuizPage() {
  const { t } = useI18n();
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [offset, setOffset] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<"pick" | "play" | "done">("pick");
  const [pack, setPack] = useState<Q[]>([]);
  const [jump, setJump] = useState("1");

  const filtered = useMemo(
    () => (topic === "all" ? questions : questions.filter((item) => item.topic === topic)),
    [topic],
  );

  function start(at: number) {
    const slice = filtered.slice(at, at + 10);
    setPack(slice.length ? slice : filtered.slice(0, 10));
    setOffset(at);
    setCursor(0);
    setPicked(null);
    setScore(0);
    setMode("play");
  }

  function openNumber(raw: string) {
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    const index = Math.min(250, Math.max(1, Math.floor(n))) - 1;
    const question = questions[index];
    if (!question) return;
    setPack([question]);
    setCursor(0);
    setPicked(null);
    setScore(0);
    setMode("play");
  }

  const current = pack[cursor];

  return (
    <Shell>
      <h1 className="font-display text-4xl">{t("nav.quiz")}</h1>
      <p className="mt-2 text-lg">{t("quiz.intro")}</p>
      <p className="text-base font-semibold">{t("ui.bank")}</p>

      {mode !== "play" ? (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {topicKeys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTopic(key);
                  setOffset(0);
                }}
                className={`min-h-11 rounded-full px-3 text-sm font-bold ${topic === key ? "bg-blue text-white" : "border-2 border-blue bg-card text-ink"}`}
              >
                {key === "all" ? t("ui.all") : key === "mix" ? t("ui.mix") : t(`nav.${key}`)}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => start(offset)} className="min-h-12 rounded-2xl bg-blue px-4 font-bold text-white">
              {t("ui.play")}
            </button>
            <button
              type="button"
              onClick={() => start(Math.min(offset + 10, Math.max(filtered.length - 1, 0)))}
              className="min-h-12 rounded-2xl border-2 border-blue bg-card px-4 font-bold"
            >
              {t("ui.nextTen")}
            </button>
          </div>
          <form
            className="mt-4 flex flex-wrap items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              openNumber(jump);
            }}
          >
            <label className="grid gap-1 text-sm font-bold">
              {t("ui.classNum")}
              <input
                value={jump}
                onChange={(event) => setJump(event.target.value)}
                inputMode="numeric"
                className="min-h-12 w-28 rounded-2xl border-2 border-blue bg-card px-3 text-lg"
              />
            </label>
            <button type="submit" className="min-h-12 rounded-2xl bg-ink px-4 font-bold text-white">
              {t("ui.go")}
            </button>
          </form>
          {mode === "done" ? (
            <p className="mt-4 rounded-3xl bg-card p-4 text-xl">
              {t("ui.end")} {t("ui.setScore", { score: String(score), total: String(pack.length) })}
            </p>
          ) : null}
        </div>
      ) : null}

      {mode === "play" && current ? (
        <QuestionCard
          question={current}
          index={questions.indexOf(current) + 1}
          cursor={cursor}
          total={pack.length}
          picked={picked}
          onPick={(choice) => {
            if (picked !== null) return;
            setPicked(choice);
            if (choice === current.answer) setScore((value) => value + 1);
          }}
          onNext={() => {
            if (cursor + 1 >= pack.length) {
              setMode("done");
              return;
            }
            setCursor((value) => value + 1);
            setPicked(null);
          }}
        />
      ) : null}
    </Shell>
  );
}

function QuestionCard({
  question,
  index,
  cursor,
  total,
  picked,
  onPick,
  onNext,
}: {
  question: Q;
  index: number;
  cursor: number;
  total: number;
  picked: number | null;
  onPick: (choice: number) => void;
  onNext: () => void;
}) {
  const { t } = useI18n();
  const pv = resolveVars(t, question.pv);
  const wv = resolveVars(t, question.wv);
  const prompt = textOf(t, question.prompt, pv);
  const why = textOf(t, question.why, wv);
  return (
    <section className="mx-auto mt-4 max-w-xl">
      <p className="text-sm font-bold">
        {t("ui.question")} {index}
        {total > 1 ? (
          <span className="ml-2">
            {cursor + 1} {t("ui.of")} {total}
          </span>
        ) : null}
      </p>
      <div className="mt-2 overflow-hidden rounded-[2rem] border-2 border-blue bg-card">
        <div className="bg-blue px-4 py-2 text-sm font-bold text-white">{t("ui.choose")}</div>
        <h2 className="px-4 py-4 font-display text-3xl leading-tight">{prompt}</h2>
        <div className="grid gap-2 px-4 pb-4">
          {question.choices.map((choice, choiceIndex) => {
            const shown = textOf(t, choice, pv);
            const state =
              picked === null ? "border-blue bg-paper" : choiceIndex === question.answer ? "border-blue bg-blue text-white" : choiceIndex === picked ? "border-ink bg-card" : "border-line bg-card";
            return (
              <button
                key={choice}
                type="button"
                onClick={() => onPick(choiceIndex)}
                className={`min-h-14 rounded-2xl border-2 px-3 py-2 text-left text-lg leading-snug break-words ${state}`}
              >
                {shown}
              </button>
            );
          })}
        </div>
      </div>
      {picked !== null ? (
        <div className="mt-3 rounded-3xl bg-paper p-4">
          <p className="text-lg font-bold">{picked === question.answer ? t("ui.correct") : t("ui.wrong")}</p>
          <p className="mt-2 text-lg">
            <span className="font-bold">{t("ui.why")} </span>
            {why}
          </p>
          <button type="button" onClick={onNext} className="mt-3 min-h-12 rounded-2xl bg-blue px-4 font-bold text-white">
            {t("ui.next")}
          </button>
        </div>
      ) : null}
    </section>
  );
}
