import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell, Why } from "@/components/shell";
import { gods, nice, projectGroups, projects } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/work")({
  component: WorkPage,
});

const sortLines = ["sheet.fact1", "sheet.fact2", "sheet.fact3", "sheet.fact4", "sheet.fact5", "sheet.fact6", "sheet.fact7", "sheet.fact8"];

function WorkPage() {
  const { t } = useI18n();
  const [group, setGroup] = useState<(typeof projectGroups)[number] | "all">("all");
  const shown = group === "all" ? projects : projects.filter((item) => item.group === group);
  return (
    <Shell>
      <h1 className="font-display text-4xl">{t("nav.work")}</h1>
      <p className="mt-2 text-lg">{t("work.intro")}</p>

      <div className="no-print mt-4">
        <button type="button" onClick={() => window.print()} className="min-h-12 rounded-2xl bg-blue px-4 font-bold text-white">
          {t("ui.print")}
        </button>
      </div>

      <h2 className="mt-6 font-display text-3xl">{t("ui.sheets")}</h2>
      <div className="mt-3 grid gap-4">
        <article className="sheet rounded-3xl border-2 border-blue bg-card p-4">
          <h3 className="font-display text-2xl">{t("sheet.symbols")}</h3>
          <p className="mt-1">{t("sheet.symbols.help")}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {gods.slice(0, 8).map((god) => (
              <li key={god.id} className="flex items-center justify-between gap-3 border-b border-line py-2">
                <span className="font-bold">{nice(god.id)}</span>
                <span className="text-sm">{t(`god.${god.id}.sign`)}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="sheet rounded-3xl border-2 border-ink bg-paper p-4">
          <h3 className="font-display text-2xl">{t("sheet.sort")}</h3>
          <p>{t("sheet.sort.help")}</p>
          <ul className="mt-3 space-y-3">
            {sortLines.map((key) => (
              <li key={key} className="flex items-start justify-between gap-3">
                <span className="text-lg">{t(key)}</span>
                <span className="mt-1 size-8 shrink-0 rounded-md border-2 border-blue" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </article>
        <article className="sheet rounded-3xl border-2 border-blue bg-card p-4">
          <h3 className="font-display text-2xl">{t("sheet.map")}</h3>
          <p>{t("sheet.map.help")}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {["Athens", "Sparta", "Olympia", "Delphi", "Troy", "Knossos"].map((name) => (
              <div key={name} className="rounded-2xl border-2 border-dashed border-blue p-3">
                <span className="block size-4 rounded-full bg-blue" aria-hidden="true" />
                <span className="mt-6 block h-6 border-b-2 border-ink" />
                <span className="sr-only">{name}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="sheet rounded-3xl bg-blue p-4 text-white">
          <h3 className="font-display text-2xl">{t("sheet.tri")}</h3>
          <p className="mt-2 text-lg">{t("sheet.tri.help")}</p>
          <p className="mt-2">3×3 + 4×4 = 5×5</p>
        </article>
      </div>

      <h2 className="mt-8 font-display text-3xl">{t("ui.projects")}</h2>
      <p className="text-sm font-semibold">63</p>
      <div className="no-print mt-3 flex flex-wrap gap-2">
        <Filter on={group === "all"} onClick={() => setGroup("all")} label={t("ui.all")} />
        {projectGroups.map((item) => (
          <Filter key={item} on={group === item} onClick={() => setGroup(item)} label={t(`group.${item}`)} />
        ))}
      </div>
      <ol className="mt-4 grid gap-3">
        {shown.map((project, index) => (
          <li key={project.id} className={project.group === "ask" || project.group === "tell" ? "rounded-[2rem] bg-blue p-4 text-white" : "rounded-[2rem] border-2 border-blue bg-card p-4"}>
            <p className="text-sm font-bold">
              {projects.findIndex((item) => item.id === project.id) + 1}. {t(`group.${project.group}`)}
            </p>
            <h3 className="font-display text-2xl leading-tight">{t(`p.${project.id}.t`)}</h3>
            <p className="mt-2 text-lg">{t(`p.${project.id}.s`)}</p>
            {project.group === "ask" || project.group === "tell" ? (
              <p className="mt-2 text-base">
                <span className="font-bold">{t("ui.why")} </span>
                {t(`p.${project.id}.w`)}
              </p>
            ) : (
              <Why k={`p.${project.id}.w`} />
            )}
            <span className="sr-only">{index}</span>
          </li>
        ))}
      </ol>
    </Shell>
  );
}

function Filter({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className={`min-h-11 rounded-full px-3 text-sm font-bold ${on ? "bg-blue text-white" : "border-2 border-blue bg-card"}`}>
      {label}
    </button>
  );
}
