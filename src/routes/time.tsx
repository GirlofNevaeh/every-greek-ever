import { createFileRoute } from "@tanstack/react-router";
import { Shell, Why } from "@/components/shell";
import { eras } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/time")({
  component: TimePage,
});

function TimePage() {
  const { t } = useI18n();
  return (
    <Shell>
      <h1 className="font-display text-4xl">{t("nav.time")}</h1>
      <p className="mt-2 text-xl">{t("time.lead")}</p>
      <p className="mt-1 max-w-xl text-base">{t("time.intro")}</p>
      <ol className="relative mt-6 border-l-4 border-blue pl-6">
        {eras.map((era, index) => (
          <li key={era.id} className="mb-5">
            <span
              className={`absolute -left-4 grid size-8 place-items-center text-sm font-bold ${index % 2 ? "rounded-full bg-card text-blue ring-2 ring-blue" : "bg-blue text-white"}`}
            >
              {index + 1}
            </span>
            <article className={`rounded-3xl p-4 ${index % 3 === 2 ? "bg-blue text-white" : "border-2 border-blue bg-card text-ink"}`}>
              <p className="text-sm font-bold">{t(era.yearKey)}</p>
              <h2 className="font-display text-3xl leading-tight">{t(`time.${era.id}.title`)}</h2>
              <p className="mt-2 text-lg">{t(`time.${era.id}.a`)}</p>
              {index % 3 === 2 ? null : <Why k={`time.${era.id}.why`} />}
              {index % 3 === 2 ? (
                <p className="mt-3 text-base">
                  <span className="font-bold">{t("ui.why")} </span>
                  {t(`time.${era.id}.why`)}
                </p>
              ) : null}
            </article>
          </li>
        ))}
      </ol>
    </Shell>
  );
}
