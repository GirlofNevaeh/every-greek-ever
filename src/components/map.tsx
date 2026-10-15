import { Link } from "@tanstack/react-router";
import { places, nice } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

const ink = "var(--color-ink)";
const blue = "var(--color-blue)";
const card = "var(--color-card)";
const paper = "var(--color-paper)";

export function GreeceMap() {
  const { t } = useI18n();
  const here = places.filter((p) => !p.far);
  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-3xl border-2 border-blue bg-card p-3">
        <p className="px-2 pb-2 text-base font-semibold">{t("ui.tap")}</p>
        <p className="px-2 pb-3 text-sm">{t("ui.seaNote")}</p>
        <div className="relative w-full" style={{ aspectRatio: "640 / 860" }}>
          <svg viewBox="0 0 640 860" className="absolute inset-0 h-full w-full" role="img" aria-label={t("nav.places")}>
            <rect width="640" height="860" fill={paper} />
            <path
              fill={blue}
              d="M150 90
                 C190 40 280 30 340 55
                 C390 40 420 80 400 130
                 C450 160 410 210 430 250
                 C400 290 450 320 420 360
                 L360 345
                 C330 330 300 355 275 345
                 C250 370 210 360 175 390
                 C140 420 145 480 175 540
                 C200 575 250 560 275 510
                 C300 460 290 400 250 370
                 C230 340 200 300 175 250
                 C145 190 130 140 150 90 Z"
            />
            <ellipse cx="350" cy="760" rx="140" ry="26" fill={blue} />
            <ellipse cx="490" cy="230" rx="28" ry="16" fill={blue} />
            <ellipse cx="455" cy="370" rx="14" ry="10" fill={blue} />
            <ellipse cx="540" cy="330" rx="22" ry="12" fill={blue} />
            <ellipse cx="555" cy="410" rx="16" ry="11" fill={blue} />
            <ellipse cx="560" cy="510" rx="24" ry="16" fill={blue} />
            <path fill={blue} d="M530 70 L630 60 L640 170 L545 180 Z" />
          </svg>
          <span className="pointer-events-none absolute top-[5%] left-[24%] text-sm font-bold text-white [text-shadow:0_1px_2px_rgb(0_0_0_/_55%)]">
            {t("map.macedon")}
          </span>
          <span className="pointer-events-none absolute top-[83%] left-[18%] text-sm font-bold">
            {t("map.crete")}
          </span>
          <span className="pointer-events-none absolute top-[68%] left-[42%] text-sm font-semibold">
            {t("map.aegean")}
          </span>
          {here.map((place) => (
            <Link
              key={place.id}
              to="/places/$id"
              params={{ id: place.id }}
              aria-label={nice(place.id)}
              className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left: `${(place.x / 640) * 100}%`, top: `${(place.y / 860) * 100}%` }}
            >
              <span className="size-4 rounded-full border-2 border-ink bg-card shadow-sm" aria-hidden="true" />
              <span className="absolute size-2 rounded-full bg-blue" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
      <ul className="grid content-start gap-2">
        {places.map((place) => (
          <li key={place.id}>
            <Link
              to="/places/$id"
              params={{ id: place.id }}
              className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border-2 border-blue bg-card px-4 py-2 font-semibold"
            >
              <span className="min-w-0 break-words">{nice(place.id)}</span>
              <span className="shrink-0 text-sm text-blue">{t("ui.open")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
